// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const pako = require('pako');
const utf8bytes = require('utf8-bytes');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function encode64(data: any) {
    let r = "";
    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 === data.length) {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
        } else if (i + 1 === data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
        } else {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1),
                data.charCodeAt(i + 2));
        }
    }
    return r;
}

function append3bytes(b1: number, b2: number, b3: number) {
    let c1 = b1 >> 2;
    let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    let c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    let c4 = b3 & 0x3F;
    let r = "";
    r += encode6bit(c1 & 0x3F);
    r += encode6bit(c2 & 0x3F);
    r += encode6bit(c3 & 0x3F);
    r += encode6bit(c4 & 0x3F);
    return r;
}

function encode6bit(b: number) {
    if (b < 10) {
        return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
        return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
        return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b === 0) {
        return '-';
    }
    if (b === 1) {
        return '_';
    }
    return '?';
}

function getPlantUMLText() {
    let textContent = '';
    if (vscode.workspace.workspaceFolders) {
        const currentWindow = vscode.window.activeTextEditor;
        if (currentWindow) {
            textContent = currentWindow.document.getText();
        }
    }
    return textContent;
}
function getURL(data: string) {
    let codedText = '';
    let url = '';
    //Encode the text in utf-8
    data = utf8bytes(data);
    let deflated = pako.deflate(data, { level: 9, to: 'string', raw: true });
    codedText = encode64(deflated);
    url = "http://www.plantuml.com/plantuml/img/" + codedText;
    return url;
}
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "plantumlpreviewer" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.pumlpreviewer', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        const panel = vscode.window.createWebviewPanel(
            'pumlpreviewer', // Identifies the type of the webview. Used internally
            'Plantuml previewer', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in.
            {
                enableScripts: true
            } // Webview options. More on these later.
        );
        panel.webview.html = showPreview();
    });

    context.subscriptions.push(disposable);
}

function showPreview() {
    let plantUMLText = getPlantUMLText();
    let url = getURL(plantUMLText);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plantuml preview</title>
</head>
<body>
<div id="tracelinks">

</div>
    <img src=${url} alt="UML diagram" width="100%" />
</body>
</html>`;
}
// this method is called when your extension is deactivated
export function deactivate() { }
