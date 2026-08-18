from app.database import get_connection


def init_database():

    with get_connection() as conn:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS sales (
                    id SERIAL PRIMARY KEY,
                    sale_date DATE NOT NULL,
                    amount NUMERIC(12, 2) NOT NULL
                );
                """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS customers (
                    id VARCHAR(20) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    total_orders INTEGER NOT NULL DEFAULT 0,
                    total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0,
                    last_order DATE
                );
                """
            )

            cursor.execute(
                """
                INSERT INTO customers (
                    id,
                    name,
                    status,
                    total_orders,
                    total_spent,
                    last_order
                )
                VALUES
                    (
                        'C001',
                        'Empresa Demo',
                        'active',
                        24,
                        185000,
                        '2026-08-12'
                    ),
                    (
                        'C002',
                        'Cliente Corporativo',
                        'inactive',
                        8,
                        42000,
                        '2026-05-18'
                    )
                ON CONFLICT (id) DO NOTHING;
                """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS inventory (
                    id SERIAL PRIMARY KEY,
                    product_name VARCHAR(255) NOT NULL,
                    category VARCHAR(100) NOT NULL,
                    stock INTEGER NOT NULL,
                    minimum_stock INTEGER NOT NULL,
                    price NUMERIC(12, 2) NOT NULL
                );
                """
            )

            cursor.execute(
                """
                INSERT INTO inventory (
                    product_name,
                    category,
                    stock,
                    minimum_stock,
                    price
                )
                VALUES
                    (
                        'Laptop Pro 14',
                        'Computers',
                        15,
                        5,
                        28000
                    ),
                    (
                        'Monitor 27',
                        'Displays',
                        8,
                        10,
                        7500
                    ),
                    (
                        'Teclado Mecánico',
                        'Accessories',
                        25,
                        8,
                        1800
                    ),
                    (
                        'Mouse Pro',
                        'Accessories',
                        4,
                        10,
                        1200
                    )
                ON CONFLICT DO NOTHING;
                """
            )

        conn.commit()


if __name__ == "__main__":
    init_database()

    print(
        "Database initialized successfully."
    )