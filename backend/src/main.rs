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
    routes::data::create_collections(&db).await;

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
        .route("/post_patient_form", post(routes::post_patient_form))
        .route("/post_therapist_form", post(routes::post_therapist_form))
        .route(
            "/post_exercise_session",
            post(routes::post_exercise_session),
        )
        .route("/get_patient_form", post(routes::get_patient_form))
        .route("/get_therapist_form", post(routes::get_therapist_form))
        .route(
            "/get_exercise_sessions",
            post(routes::get_exercise_sessions),
        )
        .route("/get_user_type", post(routes::get_user_type))
        .layer(CorsLayer::permissive())
        .layer(Extension(state))
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum_test_helper::{TestClient, TestResponse};
    use http::StatusCode;
    use mongodb::{Client, Database};
    use serial_test::serial;

    const MONGODB_NAME: &str = "neurorecovery_test";
    const MONGODB_URL: &str = "mongodb://10.43.252.173:27017";
    const MONGODB_USERNAME: &str = "root";

    const SAMPLE_EMAIL: &str = "newuser1@gmail.com";
    const SAMPLE_PASSWORD: &str = "longerThanEight";

    #[ctor::ctor]
    fn init() {
        dotenv().ok();
        env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    }

    async fn teardown_registered_user() {
        let mongodb_client = get_mongodb_client().await;
        let db = get_mongodb(mongodb_client);
        routes::data::delete_user(&db, SAMPLE_EMAIL)
            .await
            .expect("Could not delete user");
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

    async fn register_sample_user(
        client: &TestClient,
        user_request: &routes::UserRequest,
    ) -> TestResponse {
        let resp = client
            .post("/register_user")
            .json(&user_request)
            .send()
            .await;
        resp
    }

    #[tokio::test]
    #[serial]
    async fn test_index() {
        let client = TestClient::new(setup_test_router().await);
        let resp = client.get("/").send().await;
        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[tokio::test]
    #[serial]
    async fn test_register_user() {
        let client = TestClient::new(setup_test_router().await);
        let user_request = routes::UserRequest {
            email: format!("{}a", SAMPLE_EMAIL),
            password: SAMPLE_PASSWORD.to_string(),
        };
        let resp = register_sample_user(&client, &user_request).await;
        assert_eq!(resp.status(), StatusCode::OK);

        // user should exist now
        let mongo = get_mongodb_client().await;
        let db = get_mongodb(mongo);
        match routes::data::find_user_by_email(&db, &user_request.email)
            .await
            .expect("Failure finding user by email")
        {
            Some(_) => (),
            None => panic!("User with email {} does not exist", &user_request.email),
        }
        teardown_registered_user().await;
    }

    #[tokio::test]
    #[serial]
    async fn test_login_user() {
        // register user first so that the user exists
        let client = TestClient::new(setup_test_router().await);
        let user_request = routes::UserRequest {
            email: format!("{}t", SAMPLE_EMAIL),
            password: SAMPLE_PASSWORD.to_string(),
        };
        let resp = register_sample_user(&client, &user_request).await;
        assert_eq!(resp.status(), StatusCode::OK);

        let resp = client.post("/login_user").json(&user_request).send().await;
        assert_eq!(resp.status(), StatusCode::OK);
        let resp_json: routes::LoginResponse = resp.json().await;

        // check that session ID provided in resp is in DB
        let mongo = get_mongodb_client().await;
        let db = get_mongodb(mongo);
        let user = match routes::data::find_user_by_email(&db, &user_request.email)
            .await
            .expect("Failure finding user by email")
        {
            Some(user) => user,
            None => panic!("User with email {} does not exist", &user_request.email),
        };
        assert_eq!(resp_json.session_id, user.session_id);
        teardown_registered_user().await;
    }

    #[tokio::test]
    #[serial]
    async fn test_patient_form() {
        let client = TestClient::new(setup_test_router().await);
        let user_request = routes::UserRequest {
            email: format!("{}y", SAMPLE_EMAIL),
            password: SAMPLE_PASSWORD.to_string(),
        };
        let register_resp = register_sample_user(&client, &user_request).await;
        let register_resp_json: routes::LoginResponse = register_resp.json().await;

        let patient_form = routes::data::PatientForm {
            email: SAMPLE_EMAIL.to_string(),
            session_id: register_resp_json.session_id.clone(),
            additional_info: "unique".to_string(),
            ..Default::default()
        };

        let resp = client
            .post("/post_patient_form")
            .json(&patient_form)
            .send()
            .await;
        assert_eq!(resp.status(), StatusCode::OK);

        // Form should now exist for this email
        let authenticated_request = routes::AuthenticatedRequest {
            email: format!("{}y", SAMPLE_EMAIL),
            session_id: register_resp_json.session_id,
        };

        let patient_form_resp = client
            .post("/get_patient_form")
            .json(&authenticated_request)
            .send()
            .await;
        assert_eq!(resp.status(), StatusCode::OK);
        let patient_form_resp_json: routes::data::PatientForm = patient_form_resp.json().await;
        assert_eq!(patient_form_resp_json.additional_info, "unique");
        teardown_registered_user().await;
    }

    #[tokio::test]
    #[serial]
    async fn test_therapist_form() {
        let client = TestClient::new(setup_test_router().await);
        let user_request = routes::UserRequest {
            email: format!("{}x", SAMPLE_EMAIL),
            password: SAMPLE_PASSWORD.to_string(),
        };
        let register_resp = register_sample_user(&client, &user_request).await;
        let register_resp_json: routes::LoginResponse = register_resp.json().await;

        let therapist_form = routes::data::TherapistForm {
            email: SAMPLE_EMAIL.to_string(),
            session_id: register_resp_json.session_id.clone(),
            additional_info: "unique".to_string(),
            ..Default::default()
        };

        let resp = client
            .post("/post_therapist_form")
            .json(&therapist_form)
            .send()
            .await;
        assert_eq!(resp.status(), StatusCode::OK);

        // Form should now exist for this email
        let authenticated_request = routes::AuthenticatedRequest {
            email: format!("{}x", SAMPLE_EMAIL),
            session_id: register_resp_json.session_id.clone(),
        };

        let therapist_form_resp = client
            .post("/get_therapist_form")
            .json(&authenticated_request)
            .send()
            .await;
        assert_eq!(resp.status(), StatusCode::OK);
        let therapist_form_resp_json: routes::data::TherapistForm =
            therapist_form_resp.json().await;
        assert_eq!(therapist_form_resp_json.additional_info, "unique");
        teardown_registered_user().await;
    }

    #[tokio::test]
    #[serial]
    async fn test_exercise_session() {
        let client = TestClient::new(setup_test_router().await);
        let user_request = routes::UserRequest {
            email: format!("{}z", SAMPLE_EMAIL),
            password: SAMPLE_PASSWORD.to_string(),
        };
        let register_resp = register_sample_user(&client, &user_request).await;
        let register_resp_json: routes::LoginResponse = register_resp.json().await;

        let exercise_session = routes::data::ExerciseSession {
            email: SAMPLE_EMAIL.to_string(),
            session_id: register_resp_json.session_id.clone(),
            ..Default::default()
        };

        let resp = client
            .post("/post_exercise_session")
            .json(&exercise_session)
            .send()
            .await;
        assert_eq!(resp.status(), StatusCode::OK);

        // Form should now exist for this email
        let authenticated_request = routes::AuthenticatedRequest {
            email: format!("{}z", SAMPLE_EMAIL),
            session_id: register_resp_json.session_id,
        };

        let exercise_session_resp = client
            .post("/get_exercise_session")
            .json(&authenticated_request)
            .send()
            .await;
        assert_eq!(resp.status(), StatusCode::OK);
        let exercise_session_resp_json: routes::data::TherapistForm =
            exercise_session_resp.json().await;
        assert_eq!(exercise_session_resp_json.additional_info, "unique");
        teardown_registered_user().await;
    }
}
