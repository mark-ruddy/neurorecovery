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
pub struct AuthenticatedRequest {
    pub email: String,
    pub session_id: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct LoginResponse {
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
    };

    match data::insert_user(&state.db, user).await {
        Ok(()) => (),
        Err(e) => {
            error!("Failure inserting user: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
    Ok(Json(LoginResponse { session_id }))
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
    Ok(Json(LoginResponse { session_id }))
}

pub async fn post_patient_form(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<data::PatientForm>,
) -> Result<(), StatusCode> {
    match utils::check_authenticated_request(&state.db, &payload.session_id, &payload.email).await {
        Ok(_) => (),
        Err(e) => return Err(e),
    };

    // Delete any existing user info as it will be overwritten
    match data::delete_user_info_if_existing(&state.db, &payload.email).await {
        Ok(()) => (),
        Err(e) => {
            error!("Failure deleting existing user data: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }

    match data::insert_patient_form(&state.db, payload).await {
        Ok(()) => (),
        Err(e) => {
            error!("Failure inserting patient form: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
    Ok(())
}

pub async fn post_therapist_form(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<data::TherapistForm>,
) -> Result<(), StatusCode> {
    match utils::check_authenticated_request(&state.db, &payload.session_id, &payload.email).await {
        Ok(_) => (),
        Err(e) => return Err(e),
    };

    // Delete any existing user info as it will be overwritten
    match data::delete_user_info_if_existing(&state.db, &payload.email).await {
        Ok(()) => (),
        Err(e) => {
            error!("Failure deleting existing user data: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }

    match data::insert_therapist_form(&state.db, payload).await {
        Ok(()) => (),
        Err(e) => {
            error!("Failure inserting therapist form: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
    Ok(())
}

pub async fn get_patient_form(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<AuthenticatedRequest>,
) -> Result<Json<data::PatientForm>, StatusCode> {
    match utils::check_authenticated_request(&state.db, &payload.session_id, &payload.email).await {
        Ok(_) => (),
        Err(e) => return Err(e),
    };

    let form = match data::get_patient_form(&state.db, &payload.email).await {
        Ok(form) => match form {
            Some(form) => form,
            None => {
                info!("Requested for patient form that doesn't exist");
                return Err(StatusCode::BAD_REQUEST);
            }
        },
        Err(e) => {
            error!("Failure finding patient form: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };
    Ok(Json(form))
}

pub async fn get_therapist_form(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<AuthenticatedRequest>,
) -> Result<Json<data::TherapistForm>, StatusCode> {
    match utils::check_authenticated_request(&state.db, &payload.session_id, &payload.email).await {
        Ok(_) => (),
        Err(e) => return Err(e),
    };

    let form = match data::get_therapist_form(&state.db, &payload.email).await {
        Ok(form) => match form {
            Some(form) => form,
            None => {
                info!("Requested for therapist form that doesn't exist");
                return Err(StatusCode::BAD_REQUEST);
            }
        },
        Err(e) => {
            error!("Failure finding therapist form: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };
    Ok(Json(form))
}

pub async fn get_user_type(
    Extension(state): Extension<Arc<State>>,
    Json(payload): Json<AuthenticatedRequest>,
) -> Result<String, StatusCode> {
    match utils::check_authenticated_request(&state.db, &payload.session_id, &payload.email).await {
        Ok(user) => user,
        Err(e) => return Err(e),
    };

    match data::get_user_type(&state.db, &payload.email).await {
        Ok(user_type) => Ok(user_type),
        Err(e) => {
            error!("Failure identifying user type: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }
}
