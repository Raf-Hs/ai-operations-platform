from app.database import get_connection


with get_connection() as conn:

    with conn.cursor() as cursor:

        cursor.execute(
            """
            SELECT
                COUNT(*) AS orders,
                COALESCE(SUM(amount), 0) AS revenue
            FROM sales;
            """
        )

        result = cursor.fetchone()

        print(result)