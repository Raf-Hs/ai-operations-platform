from langchain_core.tools import tool

from app.database import get_connection


@tool
def get_inventory() -> dict:
    """Get current inventory levels from PostgreSQL."""

    with get_connection() as conn:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    product_name,
                    category,
                    stock,
                    minimum_stock,
                    price
                FROM inventory
                ORDER BY product_name;
                """
            )

            products = cursor.fetchall()

    return {
        "products": [
            {
                "id": product["id"],
                "product_name": product["product_name"],
                "category": product["category"],
                "stock": product["stock"],
                "minimum_stock": product["minimum_stock"],
                "price": float(product["price"]),
            }
            for product in products
        ]
    }