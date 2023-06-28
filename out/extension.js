"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ts = __importStar(require("typescript"));
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.destructureVariable', () => {
        insertSnippet('destr');
    }), vscode.commands.registerCommand('extension.destructureArgument', () => {
        insertSnippet('destra');
    }));
}
exports.activate = activate;
function insertSnippet(snippetName) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // Aucun éditeur ouvert
    }
    const document = editor.document;
    const cursorPosition = editor.selection.active;
    const sourceFile = ts.createSourceFile(document.fileName, document.getText(), ts.ScriptTarget.Latest, true);
    const offset = document.offsetAt(cursorPosition);
    const node = findNodeAtOffset(sourceFile, offset);
    if (!node) {
        vscode.window.showInformationMessage('Invalid location for this snippet');
        return;
    }
    if ((!isNodeInFunctionParameter(node))) {
        editor.insertSnippet(new vscode.SnippetString('const { $2 } = ${1:$TM_SELECTED_TEXT}'));
    }
    else {
        editor.insertSnippet(new vscode.SnippetString('{ $1 }'));
    }
}
function findNodeAtOffset(node, offset) {
    if (offset >= node.getStart() && offset < node.getEnd()) {
        return ts.forEachChild(node, (c) => findNodeAtOffset(c, offset)) || node;
    }
}
function isNodeInFunctionArgument(node) {
    while (node) {
        if (ts.isCallExpression(node) &&
            node.arguments.some((arg) => arg.getStart() <= node.getStart() && arg.getEnd() > node.getEnd())) {
            return true;
        }
        node = node.parent;
    }
    return false;
}
function isNodeInFunctionParameter(node) {
    while (node) {
        if (ts.isParameter(node)) {
            return true;
        }
        node = node.parent;
    }
    return false;
}
