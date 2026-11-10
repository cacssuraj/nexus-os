use rusqlite::Connection;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let database = std::env::args_os().nth(1).ok_or("Provide an explicit NEXUS database path")?;
    let connection = Connection::open(database)?;
    connection.execute_batch(
        "BEGIN IMMEDIATE;
         CREATE TABLE IF NOT EXISTS preferences (
             key TEXT PRIMARY KEY NOT NULL,
             value TEXT NOT NULL
         );
         PRAGMA user_version = 1;
         COMMIT;",
    )?;
    println!("NEXUS SQLite foundation initialized");
    Ok(())
}
