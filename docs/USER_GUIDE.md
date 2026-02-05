# ReasonFlow VSCode Extension - User Guide

This guide will help you get started with the ReasonFlow VSCode extension for developing AI workflow orchestration applications.

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Creating Workflows](#creating-workflows)
4. [Using Code Snippets](#using-code-snippets)
5. [Validation and IntelliSense](#validation-and-intellisense)
6. [Workflow Examples](#workflow-examples)
7. [Best Practices](#best-practices)

## Installation

### From VSIX (Local Installation)

1. Download the `reasonflow-0.0.1.vsix` file
2. Open VSCode
3. Go to Extensions view (Ctrl+Shift+X)
4. Click the `...` menu at the top right
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file

### From VSCode Marketplace (Coming Soon)

Search for "ReasonFlow" in the Extensions marketplace and click Install.

## Getting Started

### What is ReasonFlow?

ReasonFlow is a workflow orchestration framework for LLM applications with built-in RAG support, agent management, and multi-modal processing capabilities. This extension helps you create, edit, and validate ReasonFlow workflows.

### File Types

The extension supports two file types:
- `.reasonflow.json` - JSON workflow configuration files
- `.reasonflow` - Alternative extension for workflow files

## Creating Workflows

### Using the Command Palette

1. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
2. Type "ReasonFlow: Create New Workflow"
3. Select a template:
   - **Basic Workflow** - Simple single-task workflow
   - **Multi-Task Workflow** - Workflow with task dependencies
   - **RAG Workflow** - Workflow with vector database integration
   - **Python Workflow** - Python-based workflow using WorkflowBuilder

### Manual Creation

Create a new file with `.reasonflow.json` extension and start typing. The extension will provide IntelliSense suggestions.

## Using Code Snippets

### JSON Snippets

Type any of these prefixes to insert a snippet:

- `rf-workflow` - Complete workflow structure
- `rf-task-llm` - LLM task
- `rf-task-rag` - RAG/data retrieval task
- `rf-task-custom` - Custom task
- `rf-task-deps` - Task with dependencies
- `rf-dependencies` - Task dependencies array
- `rf-input-schema` - Input schema definition
- `rf-workflow-complete` - Full multi-task workflow

### Python Snippets

In Python files, use these snippets:

- `rf-python-workflow` - Complete Python workflow
- `rf-python-rag` - RAG integration setup

### Snippet Navigation

After inserting a snippet:
- Press `Tab` to move to the next placeholder
- Press `Shift+Tab` to move to the previous placeholder
- Type to replace placeholder text

## Validation and IntelliSense

### Real-time Validation

The extension validates workflows against the JSON schema in real-time:
- Red squiggly lines indicate validation errors
- Hover over errors to see details

### Manual Validation

1. Open a `.reasonflow.json` or `.reasonflow` file
2. Open Command Palette
3. Run "ReasonFlow: Validate Workflow"
4. View validation results

### IntelliSense Features

- **Auto-completion**: Type to see available properties
- **Hover Documentation**: Hover over properties for descriptions
- **Property Suggestions**: Get suggestions for task types, providers, etc.
- **Template Variable Highlighting**: `{{task-id.output}}` syntax is highlighted

## Workflow Examples

### Example 1: Simple LLM Analysis

```json
{
  "name": "SimpleAnalysis",
  "version": "1.0.0",
  "tasks": {
    "analyze": {
      "type": "llm",
      "config": {
        "params": {
          "prompt": "Analyze the following: {{input.text}}",
          "model": "gpt-4o",
          "provider": "openai",
          "temperature": 0.7
        }
      }
    }
  }
}
```

### Example 2: RAG-based Document QA

```json
{
  "name": "DocumentQA",
  "version": "1.0.0",
  "tasks": {
    "retrieve": {
      "type": "data_retrieval",
      "config": {
        "agent_config": {
          "db_path": "docs.index",
          "db_type": "faiss",
          "embedding_model": "all-MiniLM-L6-v2"
        },
        "params": {
          "query": "{{input.question}}",
          "top_k": 5
        }
      }
    },
    "answer": {
      "type": "llm",
      "config": {
        "params": {
          "prompt": "Answer based on: {{retrieve.output}}",
          "model": "gpt-4o",
          "provider": "openai"
        }
      }
    }
  },
  "dependencies": [
    { "from": "retrieve", "to": "answer" }
  ]
}
```

### Example 3: Multi-Stage Pipeline

```json
{
  "name": "Pipeline",
  "version": "1.0.0",
  "tasks": {
    "stage1": {
      "type": "data_retrieval",
      "config": {
        "agent_config": {
          "db_path": "data.index",
          "db_type": "faiss"
        },
        "params": { "query": "data", "top_k": 10 }
      }
    },
    "stage2": {
      "type": "llm",
      "config": {
        "params": {
          "prompt": "Extract: {{stage1.output}}",
          "model": "gpt-4o",
          "provider": "openai"
        }
      }
    },
    "stage3": {
      "type": "llm",
      "config": {
        "params": {
          "prompt": "Summarize: {{stage2.output}}",
          "model": "gpt-4o",
          "provider": "openai"
        }
      }
    }
  },
  "dependencies": [
    { "from": "stage1", "to": "stage2" },
    { "from": "stage2", "to": "stage3" }
  ]
}
```

## Best Practices

### Workflow Design

1. **Use Descriptive Task Names**: Use kebab-case names like `retrieve-data`, `analyze-results`
2. **Define Dependencies Clearly**: Use the `dependencies` array to specify execution order
3. **Template Variables**: Reference previous task outputs with `{{task-id.output}}`
4. **Version Your Workflows**: Always include a version number

### Configuration

1. **Choose Appropriate Models**: Use smaller models for simple tasks, larger for complex reasoning
2. **Set Reasonable Limits**: Use `max_tokens` to control output length
3. **Optimize Temperature**: Lower (0.1-0.3) for factual, higher (0.7-0.9) for creative
4. **Use GPU When Available**: Set `use_gpu: true` for RAG tasks with large databases

### RAG Integration

1. **Select Right Embedding Model**: 
   - `all-MiniLM-L6-v2` - Fast, good for most tasks
   - `all-mpnet-base-v2` - Better quality, slower
2. **Tune top_k**: Start with 5-10, adjust based on results
3. **Choose Vector DB**: FAISS for local, Pinecone/Milvus for production

### Python Workflows

1. **Use Environment Variables**: Store API keys in `.env` files
2. **Initialize Shared Memory**: Pass `shared_memory` to all components
3. **Handle Errors**: Implement try-catch for workflow execution
4. **Log Results**: Track workflow execution and results

## Troubleshooting

### Common Issues

**Issue**: Extension not activating
- **Solution**: Check that VSCode is version 1.109.0 or higher

**Issue**: Schema validation not working
- **Solution**: Ensure file has `.reasonflow.json` or `.reasonflow` extension

**Issue**: Snippets not appearing
- **Solution**: Check that language mode is set to "ReasonFlow" or "JSON"

**Issue**: Template variables not highlighted
- **Solution**: Use double curly braces: `{{task-id.output}}`

## Additional Resources

- [ReasonFlow Documentation](https://github.com/dylanturn/reason-flow)
- [Example Workflows](../examples/)
- [Extension Repository](https://github.com/dylanturn/reasonflow-vscode)
- [Report Issues](https://github.com/dylanturn/reasonflow-vscode/issues)

## Support

For help and support:
- File issues on [GitHub](https://github.com/dylanturn/reasonflow-vscode/issues)
- Check existing issues for solutions
- Contribute improvements via pull requests

---

Happy workflow building! 🚀
