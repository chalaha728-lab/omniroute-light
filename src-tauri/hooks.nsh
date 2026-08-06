!macro NSIS_HOOK_PREINSTALL
  nsExec::ExecToStack 'taskkill /F /IM omniroute-core.exe /T'
!macroend