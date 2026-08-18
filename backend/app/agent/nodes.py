import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from langgraph.prebuilt import ToolNode
from langgraph.graph import END

from app.agent.state import AgentState

from app.tools.sales import get_sales
from app.tools.customers import get_customer
from app.tools.inventory import get_inventory


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    temperature=0,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)


tools = [
    get_sales,
    get_customer,
    get_inventory,
]


llm_with_tools = llm.bind_tools(tools)

tool_node = ToolNode(tools)


def call_model(
    state: AgentState,
) -> dict:

    system_message = SystemMessage(
        content=(
            "You are an AI operations assistant. "
            "Use tools whenever factual business data "
            "is required. Never invent business data."
        )
    )

    response = llm_with_tools.invoke(
        [
            system_message,
            *state["messages"],
        ]
    )

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