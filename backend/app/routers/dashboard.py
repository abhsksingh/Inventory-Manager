from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.schemas.order import DashboardSummary
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def get_summary(db: AsyncSession = Depends(get_db)):
    total_products = (await db.execute(select(func.count(Product.id)))).scalar() or 0
    total_customers = (await db.execute(select(func.count(Customer.id)))).scalar() or 0
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar() or 0

    revenue_result = await db.execute(
        select(func.coalesce(func.sum(Order.total_amount), 0)).where(
            Order.status != "cancelled"
        )
    )
    total_revenue = float(revenue_result.scalar() or 0)

    low_stock_result = await db.execute(
        select(Product).where(Product.stock_qty < 10).order_by(Product.stock_qty.asc())
    )
    low_stock_products = [
        ProductResponse.model_validate(p) for p in low_stock_result.scalars().all()
    ]

    return DashboardSummary(
        total_products=total_products,
        total_customers=total_customers,
        total_orders=total_orders,
        total_revenue=total_revenue,
        low_stock_products=low_stock_products,
    )
