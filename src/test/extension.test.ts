import * as assert from 'assert';
import * as vscode from 'vscode';

suite('ReasonFlow Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start ReasonFlow extension tests.');

	test('Extension should be present', () => {
		const extension = vscode.extensions.getExtension('dylanturn.reasonflow');
		assert.ok(extension, 'Extension should be found');
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('dylanturn.reasonflow');
		if (extension) {
			await extension.activate();
			assert.ok(extension.isActive, 'Extension should be active');
		}
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(
			commands.includes('reasonflow.createWorkflow'),
			'createWorkflow command should be registered'
		);
		assert.ok(
			commands.includes('reasonflow.validateWorkflow'),
			'validateWorkflow command should be registered'
		);
	});

	test('Language should be registered', () => {
		const languages = vscode.languages.getLanguages();
		languages.then((langs) => {
			assert.ok(
				langs.includes('reasonflow'),
				'ReasonFlow language should be registered'
			);
		});
	});
});

