use axum::{
    extract::Extension,
    routing::{get, post},
    Router, Server,
};
use clap::Parser;
use dotenv::dotenv;
use log::info;
use std::env;
use std::error::Error;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::cors::CorsLayer;

mod routes;

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// First run - will initialise MongoDB collections etc.
    #[clap(long)]
    first_run: bool,
    /// Address to serve on
    #[clap(long, default_value = "127.0.0.1:8080")]
    addr: String,

    /// MongoDB connection URL
    #[clap(long, default_value = "mongodb://127.0.0.1:27017")]
    mongodb_url: String,
    /// MongoDB username
    #[clap(long, default_value = "root")]
    mongodb_username: String,
    /// MongoDB app and db name
    #[clap(long, default_value = "klaytn_installments")]
    mongodb_name: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv().ok();
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    let args = Args::parse();

    let mongodb_password = env::var("NEURORECOVERY_MONGODB_PASS")?;
    let mongodb_client = routes::data::init_mongo_client(
        &args.mongodb_url,
        &args.mongodb_name,
        &args.mongodb_username,
        &mongodb_password,
    )
    .await?;
    let db = mongodb_client.database(&args.mongodb_name);
    if args.first_run {
        routes::data::create_collections(&db).await?;
    }

    let state = Arc::new(routes::State { db });
    let app = create_router(state);

    let addr: SocketAddr = args.addr.parse()?;
    info!("neurorecovery backend serving at: {}", addr);
    Server::bind(&addr).serve(app.into_make_service()).await?;
    Ok(())
}

fn create_router(state: Arc<routes::State>) -> Router {
    Router::new()
        .route("/", get(routes::index))
        .route("/register_user", post(routes::register_user))
        .route("/login_user", post(routes::login_user))
        .layer(CorsLayer::permissive())
        .layer(Extension(state))
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum_test_helper::TestClient;
    use http::StatusCode;
    use mongodb::{Client, Database};
    use serial_test::serial;

    const MONGODB_NAME: &str = "neurorecovery_test";
    const MONGODB_URL: &str = "mongodb://10.43.252.173:27017";
    const MONGODB_USERNAME: &str = "root";

    #[ctor::ctor]
    fn setup() {
        dotenv().ok();
        env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    }

    async fn teardown() {
        let mongodb_client = get_mongodb_client().await;
        let db = get_mongodb(mongodb_client);
        routes::data::drop_collections(&db)
            .await
            .expect("Could not drop MongoDB collections");
    }

    async fn get_mongodb_client() -> Client {
        let mongodb_password = env::var("NEURORECOVERY_MONGODB_PASS")
            .expect("expected NEURORECOVERY_MONGODB_PASS envvar to be set");
        routes::data::init_mongo_client(
            MONGODB_URL,
            MONGODB_NAME,
            MONGODB_USERNAME,
            &mongodb_password,
        )
        .await
        .expect("Could not create MongoDB test client")
    }

    fn get_mongodb(client: Client) -> Database {
        client.database(MONGODB_NAME)
    }

    async fn setup_test_router() -> Router {
        let mongodb_client = get_mongodb_client().await;
        let db = get_mongodb(mongodb_client);

        let shared_state = Arc::new(routes::State { db });
        create_router(shared_state)
    }

    #[tokio::test]
    #[serial]
    async fn test_index() {
        let client = TestClient::new(setup_test_router().await);
        let resp = client.get("/").send().await;
        assert_eq!(resp.status(), StatusCode::OK);
        teardown().await;
    }
}
