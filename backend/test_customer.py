from app.tools.customers import get_customer


result = get_customer.invoke(
    {
        "customer_id": "C001"
    }
)

print(result)