use axum::{extract::Extension, Json};
use email_address::EmailAddress;
use http::StatusCode;
use log::{error, info};
use mongodb::Database;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

pub mod data;
pub mod utils;

pub struct State {
    pub db: Database,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct UserRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct LoginResponse {
    pub valid: bool,
}

pub async fn index() -> Result<&'static str, StatusCode> {
    Ok("NeuroRecovery backend server is running")
}

pub async fn register_user(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<UserRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let hashed_password = match utils::hash_password(&payload.password) {
        Ok(hashed_password) => hashed_password,
        Err(e) => {
            error!("Failure hashing password: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    if !EmailAddress::is_valid(&payload.email) {
        info!(
            "Bad email provided in registration request: {}",
            &payload.email
        );
        return Err(StatusCode::BAD_REQUEST);
    }

    let user = data::User {
        email: payload.email,
        hashed_password,
        info: None,
    };

    match data::insert_user(&state.db, user).await {
        Ok(()) => (),
        Err(e) => {
            error!("Failure inserting user: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
    Ok(Json(LoginResponse { valid: true }))
}

pub async fn login_user(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<UserRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let user = match data::find_user_by_email(&state.db, &payload.email).await {
        Ok(user) => match user {
            Some(user) => user,
            None => {
                info!("User not found with email {}", &payload.email);
                return Err(StatusCode::BAD_REQUEST);
            }
        },
        Err(e) => {
            error!("Failure finding user: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let hashed_password = match utils::hash_password(&payload.password) {
        Ok(hashed_password) => hashed_password,
        Err(e) => {
            error!("Failure hashing password: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    if user.hashed_password != hashed_password {
        info!(
            "Password provided doesn't match for user with email {}",
            &payload.email
        );
        return Err(StatusCode::BAD_REQUEST);
    }
    Ok(Json(LoginResponse { valid: true }))
}
