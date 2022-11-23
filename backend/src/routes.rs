use axum::{extract::Extension, Json};
use email_address::EmailAddress;
use http::StatusCode;
use log::{error, info};
use mongodb::{bson::doc, Database};
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
    pub session_id: String,
}

pub async fn index() -> Result<&'static str, StatusCode> {
    Ok("NeuroRecovery backend server is running")
}

pub async fn register_user(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<UserRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    // Check that email is unique
    match data::find_user_by_email(&state.db, &payload.email).await {
        Ok(user) => match user {
            Some(_) => {
                info!(
                    "Registration requested for user {} who already exists",
                    &payload.email
                );
                return Err(StatusCode::BAD_REQUEST);
            }
            None => (),
        },
        Err(e) => {
            error!("Failure finding user: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }

    // Verify that password meets minimum requirements
    match utils::verify_password(&payload.password) {
        true => (),
        false => return Err(StatusCode::BAD_REQUEST),
    }

    // Verify that email is valid
    if !EmailAddress::is_valid(&payload.email) {
        info!(
            "Bad email provided in registration request: {}",
            &payload.email
        );
        return Err(StatusCode::BAD_REQUEST);
    }

    let (hash, salt) = match utils::argon_create_hash_and_salt(&payload.password) {
        Ok((hash, salt)) => (hash, salt),
        Err(e) => {
            error!("Failure hashing password: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let session_id = utils::gen_session_id();
    let user = data::User {
        email: payload.email.clone(),
        hash,
        salt,
        session_id: session_id.clone(),
        info: None,
    };

    match data::insert_user(&state.db, user).await {
        Ok(()) => (),
        Err(e) => {
            error!("Failure inserting user: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
    Ok(Json(LoginResponse {
        valid: true,
        session_id,
    }))
}

pub async fn login_user(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<UserRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let user = match data::find_user_by_email(&state.db, &payload.email).await {
        Ok(user) => match user {
            Some(user) => user,
            None => {
                info!("User not found  {}", &payload.email);
                return Err(StatusCode::BAD_REQUEST);
            }
        },
        Err(e) => {
            error!("Failure finding user: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    match utils::argon_check_password_matches(&payload.password, &user.hash, &user.salt) {
        Ok(check) => {
            if !check {
                info!("Password hash for user {} does not match", &payload.email);
                return Err(StatusCode::BAD_REQUEST);
            }
        }
        Err(e) => {
            error!("Failure checking hashed password: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let session_id = utils::gen_session_id();
    match data::update_user_session_id(&state.db, &payload.email, &session_id).await {
        Ok(_) => (),
        Err(e) => {
            error!("Failed to update user {} session ID: {}", &payload.email, e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
    Ok(Json(LoginResponse {
        valid: true,
        session_id,
    }))
}
