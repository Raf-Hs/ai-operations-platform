from langgraph.graph import StateGraph

from app.agent.state import AgentState
from app.agent.nodes import (
    call_model,
    tool_node,
    should_continue,
)


graph = StateGraph(AgentState)


graph.add_node(
    "agent",
    call_model,
)

graph.add_node(
    "tools",
    tool_node,
)


graph.set_entry_point("agent")


graph.add_conditional_edges(
    "agent",
    should_continue,
)


graph.add_edge(
    "tools",
    "agent",
)


agent_graph = graph.compile()