use loco_rs::schema::table_auto_tz;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                table_auto_tz(Doors::Table)
                    .col(pk_auto(Doors::Id))
                    .col(string(Doors::DoorId))
                    .col(integer(Doors::ControlType))
                    .col(string(Doors::DoorIdStr))
                    .col(integer(Doors::CommunityId))
                    .col(integer(Doors::DoorType))
                    .col(string(Doors::Token))
                    .col(uuid_null(Doors::UserPid))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Doors::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Doors {
    Table,
    Id,
    DoorId,
    ControlType,
    DoorIdStr,
    CommunityId,
    DoorType,
    Token,
    UserPid,
}

