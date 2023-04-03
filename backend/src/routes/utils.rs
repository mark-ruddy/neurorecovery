use http::StatusCode;
use log::{error, info};
use mongodb::Database;

pub async fn check_authenticated_request(
    db: &Database,
    session_id: &str,
    email: &str,
) -> Result<super::data::User, StatusCode> {
    let user = match super::data::find_user_by_session_id(db, session_id).await {
        Ok(user) => match user {
            Some(user) => user,
            None => {
                info!("Requested with invalid session_id");
                return Err(StatusCode::BAD_REQUEST);
            }
        },
        Err(e) => {
            error!("Failure finding user: {}", e);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    if user.email != email.clone() {
        info!(
            "Authentication request with non-matching email: {} != {}",
            user.email, email
        );
        return Err(StatusCode::BAD_REQUEST);
    }
    Ok(user)
}
