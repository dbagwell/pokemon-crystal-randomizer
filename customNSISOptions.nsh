!include nsDialogs.nsh

Var Dialog
Var CreateDesktopShortcutCheckbox
Var CreateDesktopShortcutCheckboxState
Var CreateStartShortcutCheckbox
Var CreateStartShortcutCheckboxState

Page custom shortcutsPage leaveShortcutsPage

Function shortcutsPage
  nsDialogs::Create 1018
  Pop $Dialog
  
  ${If} $Dialog == error
    Abort
  ${EndIf}
  
  ${NSD_CreateCheckbox} 10 10 100% 12u "Create Desktop Shortcut"
  Pop $CreateDesktopShortcutCheckbox
  
  ${NSD_CreateCheckbox} 10 30 100% 12u "Add To Start Menu"
  Pop $CreateStartShortcutCheckbox
  
  nsDialogs::Show        
FunctionEnd

Function leaveShortcutsPage
  ${NSD_GetState} $CreateDesktopShortcutCheckbox $CreateDesktopShortcutCheckboxState
  ${NSD_GetState} $CreateStartShortcutCheckbox $CreateStartShortcutCheckboxState
FunctionEnd

!macro CustomInstall
  ${If} $CreateDesktopShortcutCheckboxState == ${BST_CHECKED}
    CreateShortCut "$DESKTOP\Pokemon Crystal Randomizer.lnk" "$INSTDIR\Pokemon Crystal Randomizer.exe" ""
  ${EndIf}
  
  ${If} $CreateStartShortcutCheckboxState == ${BST_CHECKED}
    CreateShortCut "$SMPROGRAMS\Pokemon Crystal Randomizer.lnk" "$INSTDIR\Pokemon Crystal Randomizer.exe" "" "$INSTDIR\Pokemon Crystal Randomizer.exe" 0
  ${EndIf}
!macroend

!macro CustomUnInstall
  delete "$DESKTOP\Pokemon Crystal Randomizer.lnk"
  delete "$SMPROGRAMS\Pokemon Crystal Randomizer.lnk"
!macroend