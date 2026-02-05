// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('ReasonFlow extension is now active!');

	// Command: Create New Workflow
	const createWorkflow = vscode.commands.registerCommand('reasonflow.createWorkflow', async () => {
		const workflowTypes = [
			{ label: 'Basic Workflow', description: 'Simple workflow with one task' },
			{ label: 'Multi-Task Workflow', description: 'Workflow with multiple dependent tasks' },
			{ label: 'RAG Workflow', description: 'Workflow with RAG integration' },
			{ label: 'Python Workflow', description: 'Python-based workflow using WorkflowBuilder' }
		];

		const selected = await vscode.window.showQuickPick(workflowTypes, {
			placeHolder: 'Select a workflow template'
		});

		if (!selected) {
			return;
		}

		const fileName = await vscode.window.showInputBox({
			prompt: 'Enter workflow file name',
			value: 'workflow.reasonflow.json',
			validateInput: (value) => {
				if (!value) {
					return 'File name cannot be empty';
				}
				if (!value.endsWith('.reasonflow.json') && !value.endsWith('.reasonflow')) {
					return 'File name must end with .reasonflow.json or .reasonflow';
				}
				return null;
			}
		});

		if (!fileName) {
			return;
		}

		let template = '';
		if (selected.label === 'Basic Workflow') {
			template = JSON.stringify({
				"name": "MyWorkflow",
				"description": "A basic ReasonFlow workflow",
				"version": "1.0.0",
				"tasks": {
					"task1": {
						"type": "llm",
						"config": {
							"params": {
								"prompt": "Your prompt here",
								"model": "gpt-4o",
								"provider": "openai"
							}
						}
					}
				}
			}, null, 2);
		} else if (selected.label === 'Multi-Task Workflow') {
			template = JSON.stringify({
				"name": "MultiTaskWorkflow",
				"description": "Workflow with multiple dependent tasks",
				"version": "1.0.0",
				"tasks": {
					"retrieve-data": {
						"type": "data_retrieval",
						"config": {
							"agent_config": {
								"db_path": "vector_db.index",
								"db_type": "faiss",
								"embedding_provider": "sentence_transformers",
								"embedding_model": "all-MiniLM-L6-v2"
							},
							"params": {
								"query": "Retrieve relevant data",
								"top_k": 5
							}
						}
					},
					"process-data": {
						"type": "llm",
						"config": {
							"params": {
								"prompt": "Process this data: {{retrieve-data.output}}",
								"model": "gpt-4o",
								"provider": "openai"
							}
						}
					},
					"summarize": {
						"type": "llm",
						"config": {
							"params": {
								"prompt": "Summarize: {{process-data.output}}",
								"model": "gpt-4o",
								"provider": "openai"
							}
						}
					}
				},
				"dependencies": [
					{ "from": "retrieve-data", "to": "process-data" },
					{ "from": "process-data", "to": "summarize" }
				]
			}, null, 2);
		} else if (selected.label === 'RAG Workflow') {
			template = JSON.stringify({
				"name": "RAGWorkflow",
				"description": "Workflow with RAG integration",
				"version": "1.0.0",
				"tasks": {
					"ingest-document": {
						"type": "data_retrieval",
						"config": {
							"agent_config": {
								"db_path": "vector_db.index",
								"db_type": "faiss",
								"embedding_provider": "sentence_transformers",
								"embedding_model": "all-MiniLM-L6-v2",
								"use_gpu": false
							},
							"params": {
								"query": "Retrieve document information",
								"top_k": 10
							}
						}
					},
					"analyze-document": {
						"type": "llm",
						"config": {
							"params": {
								"prompt": "Analyze the following document content: {{ingest-document.output}}",
								"model": "gpt-4o",
								"provider": "openai",
								"temperature": 0.7,
								"max_tokens": 1000
							}
						}
					}
				},
				"dependencies": [
					{ "from": "ingest-document", "to": "analyze-document" }
				]
			}, null, 2);
		} else {
			// Python workflow
			template = `from reasonflow.orchestrator.workflow_builder import WorkflowBuilder
from reasonflow.integrations.llm_integrations import LLMIntegration
from reasonflow.tasks.task_manager import TaskManager
import os

# Initialize components
task_manager = TaskManager()
workflow_builder = WorkflowBuilder(task_manager=task_manager)

# Create LLM agent
llm = LLMIntegration(
    provider="openai",
    model="gpt-4o",
    api_key=os.getenv("OPENAI_API_KEY")
)

# Define workflow
workflow_config = {
    "tasks": {
        "task1": {
            "type": "llm",
            "config": {
                "agent": llm,
                "params": {
                    "prompt": "Your prompt here"
                }
            }
        }
    }
}

# Create and execute workflow
workflow_id = workflow_builder.create_workflow(workflow_config)
results = workflow_builder.execute_workflow(workflow_id)
print(results)
`;
		}

		// Create new document
		const doc = await vscode.workspace.openTextDocument({
			content: template,
			language: selected.label === 'Python Workflow' ? 'python' : 'reasonflow'
		});

		await vscode.window.showTextDocument(doc);
		vscode.window.showInformationMessage(`Created new ${selected.label}`);
	});

	// Command: Validate Workflow
	const validateWorkflow = vscode.commands.registerCommand('reasonflow.validateWorkflow', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor');
			return;
		}

		const document = editor.document;
		if (!document.fileName.endsWith('.reasonflow.json') && !document.fileName.endsWith('.reasonflow')) {
			vscode.window.showErrorMessage('Current file is not a ReasonFlow workflow file');
			return;
		}

		try {
			const content = document.getText();
			const workflow = JSON.parse(content);

			// Basic validation
			const errors: string[] = [];
			if (!workflow.tasks) {
				errors.push('Missing required field: tasks');
			}

			if (workflow.tasks && typeof workflow.tasks === 'object') {
				for (const [taskId, task] of Object.entries(workflow.tasks)) {
					const taskObj = task as any;
					if (!taskObj.type) {
						errors.push(`Task '${taskId}' is missing required field: type`);
					}
					if (!taskObj.config) {
						errors.push(`Task '${taskId}' is missing required field: config`);
					}
				}
			}

			// Validate dependencies
			if (workflow.dependencies && Array.isArray(workflow.dependencies)) {
				for (const dep of workflow.dependencies) {
					if (!workflow.tasks[dep.from]) {
						errors.push(`Dependency references non-existent task: ${dep.from}`);
					}
					if (!workflow.tasks[dep.to]) {
						errors.push(`Dependency references non-existent task: ${dep.to}`);
					}
				}
			}

			if (errors.length > 0) {
				vscode.window.showErrorMessage(`Workflow validation failed:\n${errors.join('\n')}`);
			} else {
				vscode.window.showInformationMessage('Workflow is valid! ✓');
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Invalid JSON: ${error}`);
		}
	});

	context.subscriptions.push(createWorkflow, validateWorkflow);
}

// This method is called when your extension is deactivated
export function deactivate() {}

