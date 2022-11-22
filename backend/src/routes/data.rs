use futures::TryStreamExt;
use mongodb::{
    bson::doc, bson::Document, options::ClientOptions, options::CreateCollectionOptions,
    options::Credential, Client, Database,
};
use serde::{Deserialize, Serialize};
use std::error::Error;

const COLLECTIONS: [&str; 1] = ["users"];

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct UserInfo {
    pub user_type: String,
    pub age: u8,
    pub gender: String,
    pub injury_description: Option<String>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct User {
    pub email: String,
    pub hashed_password: String,
    pub info: Option<UserInfo>,
}

pub async fn init_mongo_client(
    conn_url: &str,
    app_name: &str,
    username: &str,
    password: &str,
) -> Result<Client, Box<dyn Error>> {
    let mongodb_creds = Credential::builder()
        .username(username.to_string())
        .password(password.to_string())
        .build();
    let mut client_options = ClientOptions::parse(conn_url).await?;
    client_options.app_name = Some(app_name.to_string());
    client_options.credential = Some(mongodb_creds);
    Ok(Client::with_options(client_options)?)
}

pub async fn create_collections(db: &Database) -> Result<(), Box<dyn Error>> {
    for coll_name in COLLECTIONS.iter() {
        db.create_collection(coll_name, CreateCollectionOptions::builder().build())
            .await?;
    }
    Ok(())
}

#[allow(dead_code)]
pub async fn drop_collections(db: &Database) -> Result<(), Box<dyn Error>> {
    for coll_name in COLLECTIONS.iter() {
        let coll = db.collection::<Document>(coll_name);
        coll.drop(None).await?;
    }
    Ok(())
}

pub async fn insert_user(db: &Database, user: User) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    coll.insert_one(user, None).await?;
    Ok(())
}

pub async fn delete_user(db: &Database, user: User) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    // is this filter needed??
    let filter = doc! { "user": user.email };
    coll.delete_one(filter, None).await?;
    Ok(())
}

pub async fn find_users_by_email(
    db: &Database,
    email: &str,
) -> Result<Option<Vec<User>>, Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    let filter = doc! { "email": email };
    let mut cursor = coll.find(filter, None).await?;

    let mut users = vec![];
    while let Some(user) = cursor.try_next().await? {
        users.push(user);
    }
    if users.len() == 0 {
        return Ok(None);
    }
    Ok(Some(users))
}

pub async fn find_user_by_email(
    db: &Database,
    email: &str,
) -> Result<Option<User>, Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    let filter = doc! { "email": email };
    let user = match coll.find_one(filter, None).await? {
        Some(user) => user,
        None => return Err(format!("No user for email {} found", email).into()),
    };
    Ok(Some(user))
}
