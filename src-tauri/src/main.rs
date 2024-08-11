#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod config;
use tauri::Manager;

#[tauri::command]
fn address_command() -> String {
    config::GLOBAL_CONFIG.lock().unwrap().address.clone().to_string().into()
}

#[tauri::command]
fn guest_command() -> String {
    config::GLOBAL_CONFIG.lock().unwrap().guest.clone().to_string().into()
}

#[tauri::command]
fn change_device_settings_command(address: String, guest: String) {
    let mut config = config::GLOBAL_CONFIG.lock().unwrap();
    config.address = address;
    config.guest = guest;
    config::save_config(&config);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            address_command,
            guest_command,
            change_device_settings_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
