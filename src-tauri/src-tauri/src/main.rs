// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::Manager;
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;

struct SidecarState(Mutex<Option<CommandChild>>);

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(SidecarState(Mutex::new(None)))
        .setup(|app| {
            let sidecar_command = app.shell().sidecar("omniroute-core").unwrap();
            if let Ok((_rx, child)) = sidecar_command.spawn() {
                let state = app.state::<SidecarState>();
                *state.0.lock().unwrap() = Some(child);
                println!("[OmniRoute Light] Go sidecar process started successfully.");
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| match event {
            tauri::RunEvent::ExitRequested { .. } | tauri::RunEvent::Exit => {
                if let Some(state) = app_handle.try_state::<SidecarState>() {
                    if let Ok(mut lock) = state.0.lock() {
                        if let Some(child) = lock.take() {
                            let _ = child.kill();
                            println!("[OmniRoute Light] Terminated Go sidecar process on exit.");
                        }
                    }
                }
            }
            _ => {}
        });
}
