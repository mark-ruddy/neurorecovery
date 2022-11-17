use http::StatusCode;
use mongodb::Database;

pub mod data;

pub struct State {
    pub db: Database,
}

pub async fn index() -> Result<&'static str, StatusCode> {
    Ok("NeuroRecovery backend server is running")
}
