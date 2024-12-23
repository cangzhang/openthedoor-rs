#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]

use std::collections::HashMap;

use axum::debug_handler;
use loco_rs::prelude::*;
use serde_json::Value;

use crate::models::{
    _entities::{doors, users},
    doors::{NewDoorParam, NewDoorRequest},
};

#[debug_handler]
pub async fn my_doors(auth: auth::JWT, State(ctx): State<AppContext>) -> Result<Response> {
    let user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    let list = doors::Model::find_all_by_user_pid(&ctx.db, user.pid).await?;
    format::json(list)
}

#[debug_handler]
pub async fn create(
    auth: auth::JWT,
    State(ctx): State<AppContext>,
    Json(params): Json<NewDoorRequest>,
) -> Result<Response> {
    let user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    let item = doors::Model::add_for_user(
        &ctx.db,
        &NewDoorParam {
            door_id: params.door_id,
            control_type: params.control_type,
            door_id_str: params.door_id_str,
            community_id: params.community_id,
            door_type: params.door_type,
            user_pid: user.pid,
        },
    )
    .await?;
    format::json(item)
}

#[debug_handler]
pub async fn open_door(
    auth: auth::JWT,
    State(ctx): State<AppContext>,
    Path(id): Path<i32>,
) -> Result<Response> {
    let user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    let door = doors::Model::find_door_for_user(&ctx.db, id, user.pid).await?;
    if door.is_none() {
        return Err(Error::NotFound);
    }

    let door = door.unwrap();
    let client = reqwest::Client::new();
    if let Some(token) = door.token {
        let mut form = HashMap::new();
        form.insert("doorId", door.door_id);
        form.insert("controlType", door.control_type.to_string());
        form.insert("doorIdStr", door.door_id_str);
        form.insert("communityId", door.community_id.to_string());
        form.insert("doorType", door.door_type.to_string());

        let body = client
            .post("https://octlife.octlife.cn/consumer/mall-applets-management/entrance/openDor")
            .header("openId", "oNS3D4leafgQeW3I-JOmvXAnbivk")
            .header("token", token)
            .json(&form)
            .send()
            .await
            .expect("failed to get response")
            .json::<Value>()
            .await
            .expect("failed to parse json");
        format::json(body)
    } else {
        Err(Error::BadRequest("door token missing".to_string()))
    }
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/doors/")
        .add("/", post(create))
        .add("/open/:id", post(open_door))
        .add("/", get(my_doors))
}
