use super::_entities::doors::{self, ActiveModel, Entity};
use loco_rs::model::ModelResult;
use sea_orm::entity::prelude::*;
use sea_orm::{ActiveValue, TransactionTrait};
use serde::{Deserialize, Serialize};

pub type Doors = Entity;

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    // extend activemodel below (keep comment for generators)

    async fn before_save<C>(self, _db: &C, insert: bool) -> std::result::Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if !insert && self.updated_at.is_unchanged() {
            let mut this = self;
            this.updated_at = sea_orm::ActiveValue::Set(chrono::Utc::now().into());
            Ok(this)
        } else {
            Ok(self)
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct NewDoorRequest {
    pub door_id: String,
    pub control_type: i32,
    pub door_id_str: String,
    pub community_id: i32,
    pub door_type: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct NewDoorParam {
    pub door_id: String,
    pub control_type: i32,
    pub door_id_str: String,
    pub community_id: i32,
    pub door_type: i32,
    pub user_pid: Uuid,
}

impl super::_entities::doors::Model {
    pub async fn find_all_by_user_pid(
        db: &DatabaseConnection,
        user_pid: Uuid,
    ) -> ModelResult<Vec<Self>> {
        let query = doors::Entity::find().filter(doors::Column::UserPid.eq(user_pid));
        let list = query.all(db).await?;
        Ok(list)
    }

    pub async fn add_for_user(db: &DatabaseConnection, params: &NewDoorParam) -> ModelResult<Self> {
        let txn = db.begin().await?;
        let row = doors::ActiveModel {
            door_id: ActiveValue::set(params.door_id.to_string()),
            control_type: ActiveValue::set(params.control_type),
            door_id_str: ActiveValue::set(params.door_id_str.to_string()),
            community_id: ActiveValue::set(params.community_id),
            door_type: ActiveValue::set(params.door_type),
            user_pid: ActiveValue::set(params.user_pid),
            ..Default::default()
        }
        .insert(&txn)
        .await?;
        txn.commit().await?;
        Ok(row)
    }
}
