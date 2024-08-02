'use strict';
import * as vscode from 'vscode';

export function activate(context)
{
	/**
	 * window.alert():
	 */

	// Register a command to call window.alert()
	vscode.commands.registerCommand('hello-world.alert', () => {
		vscode.commands.executeCommand('hello-world.internal.alert', 'Hello world!');
	});

	/**
	 * window.prompt():
	 */

	// Set up a PTY for output
	const writeEmitter = new vscode.EventEmitter();
	const pty = {
		onDidWrite: writeEmitter.event,
		handleInput: () => void 0, // NOOP
		open:  () => void 0, // NOOP
		close: () => void 0, // NOOP	
	};

	// Create a terminal
	const terminal = vscode.window.createTerminal({name: "Prompt input", pty});

	// Register a command to call window.prompt()
	vscode.commands.registerCommand('hello-world.prompt', async () => {
		// await user input and print it to the terminal
		const userInput = await vscode.commands.executeCommand('hello-world.internal.prompt', 'Type some text:');
		writeEmitter.fire(`${userInput}\r\n`),
		terminal.show();
	});
}
