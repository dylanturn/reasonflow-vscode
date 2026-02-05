# Change Log

All notable changes to the ReasonFlow VSCode extension.

## [0.0.1] - 2026-02-05

### Added
- Initial release of ReasonFlow VSCode extension
- Language support for `.reasonflow` and `.reasonflow.json` files
- JSON Schema validation with IntelliSense for workflow configurations
- Comprehensive code snippets for:
  - Basic workflow structures
  - LLM tasks
  - RAG/data retrieval tasks
  - Custom tasks
  - Task dependencies
  - Input schemas
  - Python workflows
- Commands:
  - `ReasonFlow: Create New Workflow` - Generate workflow from templates
  - `ReasonFlow: Validate Workflow` - Validate workflow structure
- Syntax highlighting with template variable support (`{{task-id.output}}`)
- Example workflow files demonstrating common patterns
- Support for multiple LLM providers (OpenAI, Groq, Ollama, Anthropic)
- Support for multiple vector databases (FAISS, Pinecone, Milvus, Qdrant, Weaviate)

### Workflow Templates
- Basic Workflow - Simple single-task workflow
- Multi-Task Workflow - Workflow with dependencies
- RAG Workflow - Workflow with vector database integration
- Python Workflow - Python-based workflow using WorkflowBuilder

### Schema Features
- Task type definitions (llm, data_retrieval, custom, rag, api, agent)
- Configuration validation for LLM providers and parameters
- Vector database configuration validation
- Dependency validation
- Input schema definitions
