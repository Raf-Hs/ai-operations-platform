from app.tools.registry import execute_tool


print("SALES")
print(
    execute_tool(
        "get_sales",
        {},
    )
)


print("\nCUSTOMER")
print(
    execute_tool(
        "get_customer",
        {
            "customer_id": "C001"
        },
    )
)


print("\nINVENTORY")
print(
    execute_tool(
        "get_inventory",
        {},
    )
)