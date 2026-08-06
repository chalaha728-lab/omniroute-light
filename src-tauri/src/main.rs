// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use std::thread;
use tauri::Manager;
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;

struct SidecarState(Arc<Mutex<Option<CommandChild>>>);

fn main() {
    let sidecar_state = Arc::new(Mutex::new(None));

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(SidecarState(sidecar_state))
        .setup(|app| {
            let app_handle = app.handle().clone();
            // Spawn sidecar asynchronously in background thread so the window opens INSTANTLY (< 100ms)
            thread::spawn(move || {
                if let Ok(sidecar_command) = app_handle.shell().sidecar("omniroute-core") {
                    if let Ok((_rx, child)) = sidecar_command.spawn() {
                        if let Some(state) = app_handle.try_state::<SidecarState>() {
                            if let Ok(mut lock) = state.0.lock() {
                                *lock = Some(child);
                                println!("[OmniRoute Light] Go sidecar process started in background.");
                            }
                        }
                    }
                }
            });
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
