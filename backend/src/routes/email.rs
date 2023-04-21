use super::EmailRequest;
use base64::{engine::general_purpose, Engine as _};
use log::info;
use rusoto_core::Region;
use rusoto_ses::{RawMessage, SendRawEmailRequest, Ses, SesClient};

const SENDING_EMAIL: &str = "neurorecoveryapp@protonmail.com";

pub async fn send_email(email_request: &EmailRequest) -> Result<(), Box<dyn std::error::Error>> {
    info!(
        "Generating email to send to: {} and {}",
        email_request.email, email_request.receiver_email
    );
    let ses = SesClient::new(Region::EuNorth1);
    let body = format!(
        "Hello,\n\nYou have been invited to a meeting by {}. Please find the attached ICS file to add the event to your calendar.\n\nBest regards,\n{}",
        email_request.email,
        email_request.email
    );

    let message = format!(
        "To: {}\r\nFrom: {}\r\nSubject: NeuroRecovery Meeting\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"--=_NextPart\"\r\n\r\n----=_NextPart\r\nContent-Type: text/plain\r\nContent-Transfer-Encoding: 7bit\r\n\r\n{}\r\n\r\n----=_NextPart\r\nContent-Type: text/calendar; charset=UTF-8; method=REQUEST\r\nContent-Transfer-Encoding: 7bit\r\nContent-Disposition: attachment; filename=\"meeting.ics\"\r\n\r\n{}\r\n\r\n----=_NextPart--",
        email_request.receiver_email,
        SENDING_EMAIL,
        body,
        email_request.ics_text
    );

    let send_request = SendRawEmailRequest {
        raw_message: RawMessage {
            data: general_purpose::STANDARD
                .encode(message.into_bytes())
                .into(),
        },
        ..Default::default()
    };
    ses.send_raw_email(send_request).await?;
    info!(
        "Email sent to: {} and {}",
        email_request.email, email_request.receiver_email
    );
    Ok(())
}
