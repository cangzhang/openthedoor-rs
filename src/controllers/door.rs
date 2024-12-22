#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]

use axum::debug_handler;
use loco_rs::prelude::*;

use crate::models::{_entities::{doors, users}, doors::{NewDoorParam, NewDoorRequest}};

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
    let item = doors::Model::add_for_user(&ctx.db, &NewDoorParam {
        door_id: params.door_id,
        control_type: params.control_type,
        door_id_str: params.door_id_str,
        community_id: params.community_id,
        door_type: params.door_type,
        user_pid: user.pid,
    }).await?;
    format::json(item)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/doors/")
        .add("/", post(create))
        .add("/", get(my_doors))
}
