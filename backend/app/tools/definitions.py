sales_tool = {
    "name": "get_sales",
    "description": (
        "Get the current sales metrics, including revenue, "
        "orders, average order value and revenue change."
    ),
    "parameters": {
        "type": "object",
        "properties": {},
    },
}


customer_tool = {
    "name": "get_customer",
    "description": (
        "Get information about a customer using their customer ID."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "customer_id": {
                "type": "string",
                "description": "The customer ID.",
            }
        },
        "required": ["customer_id"],
    },
}


inventory_tool = {
    "name": "get_inventory",
    "description": (
        "Get the current inventory and stock levels."
    ),
    "parameters": {
        "type": "object",
        "properties": {},
    },
}