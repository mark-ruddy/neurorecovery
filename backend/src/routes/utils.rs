use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2,
};
use std::error::Error;

pub fn hash_password(password: &str) -> Result<String, Box<dyn Error>> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let hashed_password = match argon2.hash_password(password.as_bytes(), &salt) {
        Ok(hashed_password) => hashed_password.to_string(),
        Err(_) => return Err("failed to hash password".into()),
    };
    Ok(hashed_password)
}
