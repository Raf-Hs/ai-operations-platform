from langchain_core.tools import tool

from app.database import get_connection


@tool
def get_sales() -> dict:
    """Get current sales metrics from the PostgreSQL database."""

    with get_connection() as conn:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    COUNT(*) AS orders,
                    COALESCE(SUM(amount), 0) AS revenue,
                    COALESCE(AVG(amount), 0) AS average_order_value
                FROM sales
                WHERE sale_date >= DATE_TRUNC('month', CURRENT_DATE);
                """
            )

            result = cursor.fetchone()

    return {
        "period": "current_month",
        "orders": result["orders"],
        "revenue": float(result["revenue"]),
        "average_order_value": float(
            result["average_order_value"]
        ),
    }