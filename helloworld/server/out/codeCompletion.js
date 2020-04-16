"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const fs = require("fs-extra");
let completionItems = new Array();
completionItems.push({
    label: 'double',
    kind: vscode_languageserver_1.CompletionItemKind.Class,
    data: 3,
    detail: '类型说明',
    documentation: 'double类'
});
fs.readFile("./completionResources/completionTarget.txt", "utf8", function (err, data) {
    if (err) {
        return console.error(err);
    }
    let readLineResult = data.split("\n");
    for (let i = 0; i < readLineResult.length; i++) {
        let line = readLineResult[i];
        if (line && line.length > 0) {
            let params = line.split("`");
            let readLabel = params[0];
            let readDetail = params[1];
            let readDocument = params[2];
            completionItems.push({
                label: readLabel,
                kind: vscode_languageserver_1.CompletionItemKind.Text,
                data: i,
                detail: readDetail,
                documentation: readDocument
            });
        }
    }
});
function myOnCompletion(connection) {
    connection.onCompletion((_textDocumentPosition) => {
        // The pass parameter contains the position of the text document in
        // which code complete got requested. For the example we ignore this
        // info and always provide the same completion items.
        return completionItems;
    });
}
exports.myOnCompletion = myOnCompletion;
;
function myCompletionResolve(connection) {
    connection.onCompletionResolve();
}
exports.myCompletionResolve = myCompletionResolve;
//# sourceMappingURL=codeCompletion.js.map