# ReasonFlow VSCode Extension

The official VSCode extension for developing [ReasonFlow](https://github.com/dylanturn/reason-flow) workflows.

## Features

### Language Support
- **Syntax highlighting** for `.reasonflow` and `.reasonflow.json` files
- **JSON Schema validation** with IntelliSense support for workflow configurations
- **Code snippets** for common ReasonFlow patterns

### Commands
- **Create New Workflow** - Generate workflow templates from predefined patterns
- **Validate Workflow** - Validate workflow configuration structure and dependencies

### Code Snippets

The extension provides rich code snippets for both JSON and Python workflows:

#### JSON Snippets
- `rf-workflow` - Basic workflow structure
- `rf-task-llm` - LLM task configuration
- `rf-task-rag` - RAG/data retrieval task
- `rf-task-custom` - Custom task
- `rf-task-deps` - Task with template variable references
- `rf-dependencies` - Task dependencies
- `rf-input-schema` - Workflow input schema
- `rf-workflow-complete` - Complete multi-task workflow

#### Python Snippets
- `rf-python-workflow` - Python workflow using WorkflowBuilder
- `rf-python-rag` - RAG integration in Python

### IntelliSense & Validation

The extension provides full IntelliSense support for workflow files, including:
- Auto-completion for task types, providers, and configuration options
- Real-time validation against the ReasonFlow workflow schema
- Hover documentation for workflow properties

## Usage

### Creating a New Workflow

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "ReasonFlow: Create New Workflow"
3. Select a workflow template:
   - **Basic Workflow** - Simple workflow with one task
   - **Multi-Task Workflow** - Workflow with multiple dependent tasks
   - **RAG Workflow** - Workflow with RAG integration
   - **Python Workflow** - Python-based workflow using WorkflowBuilder
4. Enter a file name (must end with `.reasonflow.json` or `.reasonflow`)

### Using Code Snippets

In any JSON file or `.reasonflow` file:
1. Start typing `rf-` to see available snippets
2. Select a snippet from the auto-completion menu
3. Press `Tab` to navigate through snippet placeholders

### Validating Workflows

1. Open a `.reasonflow.json` or `.reasonflow` file
2. Open the Command Palette
3. Run "ReasonFlow: Validate Workflow"
4. Check for validation errors or success message

## Workflow Schema

ReasonFlow workflows are defined using a structured JSON schema with the following main components:

### Basic Structure

```json
{
  "name": "MyWorkflow",
  "description": "Workflow description",
  "version": "1.0.0",
  "tasks": {
    "task-id": {
      "type": "llm | data_retrieval | custom | rag | api | agent",
      "config": {
        // Task-specific configuration
      }
    }
  },
  "dependencies": [
    { "from": "source-task", "to": "target-task" }
  ]
}
```

### Task Types

- **llm** - LLM-based tasks using OpenAI, Groq, Ollama, Anthropic, or other providers
- **data_retrieval** - RAG tasks using vector databases (FAISS, Pinecone, Milvus, etc.)
- **custom** - Custom Python function tasks
- **rag** - Retrieval-augmented generation tasks
- **api** - API connector tasks
- **agent** - Custom agent tasks

### Template Variables

Use `{{task-id.output}}` in prompts to reference outputs from previous tasks:

```json
{
  "tasks": {
    "analyze": {
      "type": "llm",
      "config": {
        "params": {
          "prompt": "Analyze this data: {{retrieve-data.output}}"
        }
      }
    }
  }
}
```

## Examples

### Simple LLM Workflow

```json
{
  "name": "SimpleAnalysis",
  "version": "1.0.0",
  "tasks": {
    "analyze": {
      "type": "llm",
      "config": {
        "params": {
          "prompt": "Analyze the following text...",
          "model": "gpt-4o",
          "provider": "openai"
        }
      }
    }
  }
}
```

### Multi-Task RAG Workflow

```json
{
  "name": "DocumentAnalysis",
  "version": "1.0.0",
  "tasks": {
    "retrieve": {
      "type": "data_retrieval",
      "config": {
        "agent_config": {
          "db_path": "vector_db.index",
          "db_type": "faiss",
          "embedding_model": "all-MiniLM-L6-v2"
        },
        "params": {
          "query": "Find relevant information",
          "top_k": 5
        }
      }
    },
    "analyze": {
      "type": "llm",
      "config": {
        "params": {
          "prompt": "Analyze: {{retrieve.output}}",
          "model": "gpt-4o",
          "provider": "openai"
        }
      }
    }
  },
  "dependencies": [
    { "from": "retrieve", "to": "analyze" }
  ]
}
```

## Requirements

- Visual Studio Code version 1.109.0 or higher
- For Python workflows: Python 3.10+ and ReasonFlow package (`pip install reasonflow`)

## Extension Settings

This extension does not add any VS Code settings in the current version.

## Known Issues

None at this time. Please report issues on the [GitHub repository](https://github.com/dylanturn/reasonflow-vscode/issues).

## Release Notes

### 0.0.1

Initial release of ReasonFlow VSCode extension:
- Language support for `.reasonflow` and `.reasonflow.json` files
- JSON Schema validation with IntelliSense
- Code snippets for common patterns
- Workflow creation and validation commands

## Contributing

Contributions are welcome! Please see the [repository](https://github.com/dylanturn/reasonflow-vscode) for more information.

## License

MIT License - See LICENSE file for details.

## Links

- [ReasonFlow Documentation](https://github.com/dylanturn/reason-flow)
- [Extension Repository](https://github.com/dylanturn/reasonflow-vscode)
- [Report Issues](https://github.com/dylanturn/reasonflow-vscode/issues)

