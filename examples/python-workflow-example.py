from reasonflow.orchestrator.workflow_builder import WorkflowBuilder
from reasonflow.integrations.llm_integrations import LLMIntegration
from reasonflow.integrations.rag_integrations import RAGIntegration
from reasonflow.tasks.task_manager import TaskManager
import os

def main():
    """Example Python workflow using ReasonFlow WorkflowBuilder"""
    
    # Initialize components
    task_manager = TaskManager()
    workflow_builder = WorkflowBuilder(task_manager=task_manager)
    
    # Create LLM agents
    llm_analyzer = LLMIntegration(
        provider="openai",
        model="gpt-4o",
        api_key=os.getenv("OPENAI_API_KEY")
    )
    
    llm_summarizer = LLMIntegration(
        provider="groq",
        model="llama-3.1-8b-instant",
        api_key=os.getenv("GROQ_API_KEY")
    )
    
    # Initialize RAG
    rag = RAGIntegration(
        db_path="knowledge_base.index",
        db_type="faiss",
        embedding_model="all-MiniLM-L6-v2"
    )
    
    # Define workflow
    workflow_config = {
        "name": "KnowledgeAnalysis",
        "description": "Analyze knowledge base and generate insights",
        "tasks": {
            "retrieve-knowledge": {
                "type": "data_retrieval",
                "config": {
                    "agent_config": {
                        "db_path": "knowledge_base.index",
                        "db_type": "faiss",
                        "embedding_provider": "sentence_transformers",
                        "embedding_model": "all-MiniLM-L6-v2"
                    },
                    "params": {
                        "query": "Retrieve relevant knowledge",
                        "top_k": 10
                    }
                }
            },
            "analyze-knowledge": {
                "type": "llm",
                "config": {
                    "agent": llm_analyzer,
                    "params": {
                        "prompt": "Analyze the following knowledge: {{retrieve-knowledge.output}}"
                    }
                }
            },
            "summarize": {
                "type": "llm",
                "config": {
                    "agent": llm_summarizer,
                    "params": {
                        "prompt": "Summarize these insights: {{analyze-knowledge.output}}"
                    }
                }
            }
        },
        "dependencies": [
            {"from": "retrieve-knowledge", "to": "analyze-knowledge"},
            {"from": "analyze-knowledge", "to": "summarize"}
        ]
    }
    
    # Create and execute workflow
    workflow_id = workflow_builder.create_workflow(workflow_config)
    print(f"Workflow created with ID: {workflow_id}")
    
    results = workflow_builder.execute_workflow(workflow_id)
    
    print("\n=== Workflow Results ===")
    for task_id, result in results.items():
        print(f"\n{task_id}:")
        print(result)

if __name__ == "__main__":
    main()
