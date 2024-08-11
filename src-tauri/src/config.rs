use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub address: String,
    pub guest: String,
}

lazy_static! {
    pub static ref GLOBAL_CONFIG: Mutex<Config> = Mutex::new(load_config());
}

fn load_config() -> Config {
    let config_data = fs::read_to_string("hardware-data.json")
        .expect("Failed to read config file");

    serde_json::from_str(&config_data)
        .expect("Failed to parse config file")
}

pub fn save_config(config: &Config) {
    let config_data = serde_json::to_string_pretty(config)
        .expect("Failed to serialize config");

    fs::write("hardware-data.json", config_data)
        .expect("Failed to write config file");
}
