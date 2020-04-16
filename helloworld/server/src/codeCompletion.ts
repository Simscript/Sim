import {
	createConnection,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams
} from 'vscode-languageserver';

import * as fs from 'fs-extra';
import * as path from 'path';


let completionItems : Array<CompletionItem> = new Array<CompletionItem>();
completionItems.push({
	label: 'double',
	kind: CompletionItemKind.Class,
	data: 3,
	detail: '类型说明',
	documentation: 'double类'
})

fs.readFile("./completionResources/completionTarget.txt", "utf8", function (err: any, data: any) {
    if (err) {
        return console.error(err);
	}
	let readLineResult: string[] = data.split("\n");

    for (let i: number = 0; i < readLineResult.length; i++) {
        let line = readLineResult[i];
        if (line && line.length > 0) {
            let params: string[] =line.split("`");
			let readLabel:string = params[0];
			let readDetail:string = params[1];
			let readDocument:string = params[2];
			completionItems.push({
				label:readLabel,
				kind:CompletionItemKind.Text,
				data:i,
				detail:readDetail,
				documentation:readDocument
			})
        }
    }
});

export function myOnCompletion(connection:any)
{
    connection.onCompletion(
	    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		    return completionItems;
	    }
    );
};

export function myCompletionResolve(connection:any){
    connection.onCompletionResolve();
}