# Work tool

## Main goal

Create web applications on github pages for any text operations.

## Main sections

- Working with text
- Working with json
- Text comparison
- Encoding with gunzip+base64
- Curl to Python converter 

### Deprecated

- Check English text with chat-gpt
- Quiz with chat-gpt with saving

## Features

### Beauty

- Dark theme
- Changing width of active zone
- Saving to local storage
- Small animations
- Shortcuts for most buttons [works incorrect for now]
- Save router state (If you move to "/" you will be redirect to previous page)
- Auto focus mode on diff page

### Tech

- CI/CD with actions
- Firestore for quiz
- Adaptive to mobile
- Github pages
- Using `monaco-editor` for json and diff

## How to build to github pages manually

ng build --base-href "https://bogomazdmitry.github.io/work-tool/"

npx angular-cli-ghpages --dir=dist/angular-work-tool

https://bogomazdmitry.github.io/work-tool/
