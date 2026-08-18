from langchain_core.tools import tool

from app.database import get_connection


@tool
def get_customer(customer_id: str) -> dict:
    """Get customer information from PostgreSQL using the customer ID."""

    with get_connection() as conn:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    status,
                    total_orders,
                    total_spent,
                    last_order
                FROM customers
                WHERE id = %s;
                """,
                (customer_id,),
            )

            customer = cursor.fetchone()

    if not customer:
        return {
            "error": "Customer not found"
        }

    return {
        "id": customer["id"],
        "name": customer["name"],
        "status": customer["status"],
        "total_orders": customer["total_orders"],
        "total_spent": float(customer["total_spent"]),
        "last_order": str(customer["last_order"]),
    }