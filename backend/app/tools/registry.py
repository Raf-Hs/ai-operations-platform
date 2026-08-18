from app.tools.sales import get_sales
from app.tools.customers import get_customer
from app.tools.inventory import get_inventory
from app.tools.documents import search_documents_tool

TOOLS = {
    "get_sales": get_sales,
    "get_customer": get_customer,
    "get_inventory": get_inventory,
    "search_documents": search_documents_tool,
}


def execute_tool(
    name: str,
    arguments: dict,
) -> dict:

    tool = TOOLS.get(name)

    if not tool:
        return {
            "error": f"Unknown tool: {name}"
        }

    return tool.invoke(arguments)