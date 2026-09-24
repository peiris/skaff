Output demo/skaff.mp4

Set Shell zsh
Set FontSize 15
Set Width 1200
Set Height 900
Set Padding 24
Set WindowBar Colorful
Set WindowBarSize 44
Set BorderRadius 12
Set Margin 48
Set MarginFill "#11111b"
Set Theme "Catppuccin Mocha"
Set TypingSpeed 60ms
Set WaitTimeout 15m
Env PATH "/Users/khpeiris/.nvm/versions/node/v26.9.0/bin:/opt/homebrew/bin:/usr/bin:/bin"

Hide
Type "cd ~/Documents/projects && npx -y create-skaff@latest --dry-run"
Enter
Wait+Screen /Project name/
Escape
Sleep 500ms
Type "clear"
Enter
Sleep 500ms
Show

Type "npx create-skaff@latest my-app"
Sleep 800ms
Enter

Wait+Screen /Project name/
Sleep 1.5s
Enter

Wait+Screen /Package manager/
Sleep 1.2s
Enter

Wait+Screen /Icon library/
Sleep 1.2s
Enter

Wait+Screen /Font/
Sleep 1s
Down
Sleep 400ms
Enter

Wait+Screen /What to set up/
Sleep 1.5s
Enter

Wait+Screen /shadcn\/ui preset/
Sleep 1.2s
Enter

Wait+Screen /Scaffold into/
Sleep 1.5s
Enter

Wait+Screen /Enter or q to exit/
Sleep 6s
Enter
Sleep 1s
