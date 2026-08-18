import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from langgraph.prebuilt import ToolNode
from langgraph.graph import END

from app.agent.state import AgentState

from app.tools.sales import get_sales
from app.tools.customers import get_customer
from app.tools.inventory import get_inventory
from app.tools.documents import search_documents_tool


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    temperature=0,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)


tools = [
    get_sales,
    get_customer,
    get_inventory,
    search_documents_tool,
]


llm_with_tools = llm.bind_tools(tools)

tool_node = ToolNode(tools)


def call_model(
    state: AgentState,
) -> dict:

    system_message = SystemMessage(
        content="""
You are an AI operations assistant.

You have access to multiple tools containing different
types of business information.

Available tools:

- get_sales: retrieves sales and revenue information.
- get_customer: retrieves customer information.
- get_inventory: retrieves inventory information.
- search_documents_tool: searches company documents,
  policies and operational manuals.

Rules:

1. Never invent business data.

2. Use the appropriate tool whenever factual business
   information is required.

3. A user question may contain multiple independent
   requests.

4. If the question contains multiple requests, use ALL
   tools necessary to answer every part of the question.

5. Do not assume that one tool contains information
   belonging to another tool.

6. After receiving tool results, determine whether
   another tool is necessary before producing the final
   answer.

7. Once all required information has been retrieved,
   provide one clear answer combining the results.

Example:

User:
"How much did we sell this month and what is the
refund policy above $10,000?"

You should retrieve:

- sales information using get_sales
- refund policy using search_documents_tool

Then combine both results into the final answer.
"""
    )

    response = llm_with_tools.invoke(
        [
            system_message,
            *state["messages"],
        ]
    )
    if getattr(response, "tool_calls", None):
        print("\nTOOLS REQUESTED:")

        for tool_call in response.tool_calls:
            print(
                f"- {tool_call['name']}: "
                f"{tool_call.get('args', {})}"
            )

    else:
        print("\nFINAL RESPONSE")
    return {
        "messages": [response]
    }


def should_continue(
    state: AgentState,
):

    last_message = state["messages"][-1]

    if getattr(last_message, "tool_calls", None):
        return "tools"

    return END