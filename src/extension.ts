/*
	METHOD 1: Query the start and end characters for block comments for the language, and
	then check if the selection falls within those characters. This is not ideal because
	the vscode API does not provide a way to query the start and end characters.

	It is possible with this workaround:
	- https://github.com/microsoft/vscode/issues/2871#issuecomment-338364014

	Relevant issues:
	- https://github.com/microsoft/vscode/issues/109919
	- https://github.com/microsoft/vscode/issues/2871
*/

/*
	METHOD 2: Directly determine the scope at the cursor position. This is also not ideal
	because the vscode API does not provide a way to do this. We opt for this method because
	it is more reliable than method 1.

	It is possible with this workaround:
	- https://marketplace.visualstudio.com/items?itemName=draivin.hscopes

	Relevant issues:
	- https://github.com/microsoft/vscode-anycode/issues/15
	- https://github.com/microsoft/vscode/issues/580
*/

import * as vscode from "vscode";

import { type HScopesAPI } from "./hscopes";

const getHScopesAPI = async (): Promise<HScopesAPI> => {
	const hscopes = vscode.extensions.getExtension("draivin.hscopes");

	if (!hscopes) {
		throw new Error(
			"HyperScopes is not installed. Get it here: https://marketplace.visualstudio.com/items?itemName=draivin.hscopes"
		);
	} else if (!hscopes.isActive) {
		await hscopes.activate();
	}

	return hscopes.exports;
};

const blockCommentScopes = ["string.quoted.multi.python"];

const blockCommentPredicate = (scope: string) =>
	scope.includes("comment.block") || blockCommentScopes.includes(scope);

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		"smart-comments.toggleComment",
		() => {
			const editor = vscode.window.activeTextEditor;

			const selection = editor?.selection;
			const document = editor?.document;

			if (!selection || !document) {
				return;
			}

			if (!selection.isEmpty) {
				vscode.commands.executeCommand("editor.action.blockComment");
				return;
			}

			getHScopesAPI()
				.then((hscopesApi) => {
					const scope = hscopesApi.getScopeAt(
						document,
						selection.active
					);

					const command =
						scope && !!scope.scopes.find(blockCommentPredicate)
							? "editor.action.blockComment"
							: "editor.action.commentLine";

					vscode.commands.executeCommand(command);

					console.log(scope);
				})
				.catch((error) =>
					vscode.window.showErrorMessage(error.message)
				);
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
