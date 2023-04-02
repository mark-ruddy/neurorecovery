use futures::{StreamExt, TryStreamExt};
use log::info;
use mongodb::{
    bson::doc, bson::Document, options::ClientOptions, options::CreateCollectionOptions,
    options::Credential, Client, Database,
};
use serde::{Deserialize, Serialize};
use std::error::Error;

const COLLECTIONS: [&str; 4] = [
    "users",
    "patient_forms",
    "therapist_forms",
    "therapist_patients",
];

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct User {
    pub email: String,
    pub hash: String,
    pub salt: String,
    pub session_id: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct PatientForm {
    pub full_name: String,
    pub stroke_date: String,
    pub injury_side: String,
    pub additional_info: String,
    pub email: String,
    pub session_id: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct TherapistForm {
    pub full_name: String,
    pub num_patients: String,
    pub expected_weekly_appointments: String,
    pub additional_info: String,
    pub email: String,
    pub session_id: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct TherapistPatients {
    pub patients: Vec<String>,
    pub email: String,
    pub session_id: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct ExerciseSession {
    pub kind: String,
    pub datetime: String,
    pub total_time_taken_secs: String,
    pub num_exercises_completed: String,
    pub email: String,
    pub session_id: String,
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

pub async fn create_collections(db: &Database) {
    for coll_name in COLLECTIONS.iter() {
        match db
            .create_collection(coll_name, CreateCollectionOptions::builder().build())
            .await
        {
            Ok(_) => info!("Collection created: {}", coll_name),
            Err(e) => info!(
                "Collection {} not created, may already exist: {}",
                coll_name, e
            ),
        }
    }
}

#[allow(dead_code)]
pub async fn drop_collections(db: &Database) -> Result<(), Box<dyn Error>> {
    for coll_name in COLLECTIONS.iter() {
        let coll = db.collection::<Document>(coll_name);
        coll.drop(None).await?;
    }
    Ok(())
}

// USER
pub async fn insert_user(db: &Database, user: User) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    coll.insert_one(user, None).await?;
    Ok(())
}

#[allow(dead_code)]
pub async fn delete_user(db: &Database, email: &str) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    let filter = doc! { "email": email };
    coll.delete_one(filter, None).await?;
    Ok(())
}

#[allow(dead_code)]
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

pub async fn find_patients_by_email_substring(
    db: &Database,
    email: &str,
) -> Result<Option<Vec<User>>, Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    let filter = doc! { "email": { "$regex": format!(".*{}.*", email) } };
    let mut cursor = coll.find(filter, None).await?;

    let mut patients = vec![];
    while let Some(user) = cursor.try_next().await? {
        if get_user_type(db, &user.email).await? == "Patient" {
            patients.push(user);
        }
    }
    if patients.len() == 0 {
        return Ok(None);
    }
    Ok(Some(patients))
}

pub async fn find_user_by_email(
    db: &Database,
    email: &str,
) -> Result<Option<User>, Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    let filter = doc! { "email": email };
    let user = match coll.find_one(filter, None).await? {
        Some(user) => user,
        None => return Ok(None),
    };
    Ok(Some(user))
}

pub async fn find_user_by_session_id(
    db: &Database,
    session_id: &str,
) -> Result<Option<User>, Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    let filter = doc! { "session_id": session_id };
    let user = match coll.find_one(filter, None).await? {
        Some(user) => user,
        None => return Ok(None),
    };
    Ok(Some(user))
}

pub async fn update_user_session_id(
    db: &Database,
    email: &str,
    session_id: &str,
) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<User>("users");
    let session_id_doc = doc! { "$set": { "session_id": &session_id } };
    let filter = doc! { "email": email };
    coll.update_one(filter, session_id_doc, None).await?;
    Ok(())
}

// USER DATA FORMS
pub async fn delete_user_info_if_existing(
    db: &Database,
    email: &str,
) -> Result<(), Box<dyn Error>> {
    let therapist_coll = db.collection::<TherapistForm>("therapist_forms");
    let patient_coll = db.collection::<PatientForm>("patient_forms");
    let filter = doc! { "email": email };

    therapist_coll.delete_one(filter.clone(), None).await?;
    patient_coll.delete_one(filter, None).await?;
    Ok(())
}

pub async fn get_user_type(db: &Database, email: &str) -> Result<String, Box<dyn Error>> {
    let therapist_coll = db.collection::<TherapistForm>("therapist_forms");
    let patient_coll = db.collection::<PatientForm>("patient_forms");
    let filter = doc! { "email": email };

    match therapist_coll.find_one(filter.clone(), None).await? {
        Some(_) => return Ok("Therapist".to_string()),
        None => (),
    };

    match patient_coll.find_one(filter, None).await? {
        Some(_) => return Ok("Patient".to_string()),
        None => (),
    };
    Ok("".to_string())
}

pub async fn get_patient_form(
    db: &Database,
    email: &str,
) -> Result<Option<PatientForm>, Box<dyn Error>> {
    let coll = db.collection::<PatientForm>("patient_forms");
    let filter = doc! { "email": email };
    match coll.find_one(filter.clone(), None).await? {
        Some(patient_form) => Ok(Some(patient_form)),
        None => Ok(None),
    }
}

pub async fn get_therapist_form(
    db: &Database,
    email: &str,
) -> Result<Option<TherapistForm>, Box<dyn Error>> {
    let coll = db.collection::<TherapistForm>("therapist_forms");
    let filter = doc! { "email": email };
    match coll.find_one(filter.clone(), None).await? {
        Some(therapist_form) => Ok(Some(therapist_form)),
        None => Ok(None),
    }
}

// THERAPIST'S PATIENTS
#[allow(dead_code)]
pub async fn insert_therapist_patients(
    db: &Database,
    therapist_patients: TherapistPatients,
) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<TherapistPatients>("therapist_patients");
    coll.insert_one(therapist_patients, None).await?;
    Ok(())
}

pub async fn add_therapist_patient(db: &Database, email: &str) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<TherapistPatients>("therapist_patients");
    let filter = doc! { "email": email };
    let update = doc! { "$push": { "patients": email } };
    coll.update_one(filter, update, None).await?;
    Ok(())
}

pub async fn get_therapist_patients(
    db: &Database,
    email: &str,
) -> Result<Option<TherapistPatients>, Box<dyn Error>> {
    let coll = db.collection::<TherapistPatients>("therapist_patients");
    let filter = doc! { "email": email };
    match coll.find_one(filter.clone(), None).await? {
        Some(therapist_patients) => Ok(Some(therapist_patients)),
        None => Ok(None),
    }
}

pub async fn get_exercise_sessions(
    db: &Database,
    email: &str,
) -> Result<Option<Vec<ExerciseSession>>, Box<dyn Error>> {
    let coll = db.collection::<ExerciseSession>("exercise_sessions");
    let filter = doc! { "email": email };
    let mut cursor = coll.find(filter.clone(), None).await?;
    let mut exercise_sessions = vec![];
    while let Some(exercise_session) = cursor.next().await {
        exercise_sessions.push(exercise_session?);
    }
    if exercise_sessions.len() == 0 {
        return Ok(None);
    }
    Ok(Some(exercise_sessions))
}

pub async fn insert_patient_form(
    db: &Database,
    patient_form: PatientForm,
) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<PatientForm>("patient_forms");
    coll.insert_one(patient_form, None).await?;
    Ok(())
}

pub async fn insert_therapist_form(
    db: &Database,
    therapist_form: TherapistForm,
) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<TherapistForm>("therapist_forms");
    coll.insert_one(therapist_form, None).await?;
    Ok(())
}

pub async fn insert_exercise_session(
    db: &Database,
    exercise_session: ExerciseSession,
) -> Result<(), Box<dyn Error>> {
    let coll = db.collection::<ExerciseSession>("exercise_sessions");
    coll.insert_one(exercise_session, None).await?;
    Ok(())
}
