#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_shell::ShellExt;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let sidecar_command = app.shell().sidecar("omniroute-core").unwrap();
            let (_rx, _child) = sidecar_command.spawn().expect("Failed to spawn Go proxy sidecar");
            println!("[OmniRoute Light] Go sidecar process started successfully.");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
