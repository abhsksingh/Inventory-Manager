from uuid import UUID
from decimal import Decimal
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.order import OrderCreate, OrderResponse


class OrderService:

    @staticmethod
    async def create(db: AsyncSession, data: OrderCreate) -> Order:
        customer_result = await db.execute(
            select(Customer).where(Customer.id == data.customer_id)
        )
        customer = customer_result.scalar_one_or_none()
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"detail": "Customer not found", "code": "NOT_FOUND"},
            )

        total_amount = Decimal("0.00")
        order_items = []

        for item in data.items:
            product_result = await db.execute(
                select(Product).where(Product.id == item.product_id).with_for_update()
            )
            product = product_result.scalar_one_or_none()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={"detail": f"Product with id {item.product_id} not found", "code": "PRODUCT_NOT_FOUND"},
                )

            if product.stock_qty < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail={
                        "detail": f"Insufficient stock for '{product.name}'. Available: {product.stock_qty}, requested: {item.quantity}",
                        "code": "INSUFFICIENT_STOCK",
                    },
                )

            product.stock_qty -= item.quantity
            unit_price = product.price
            line_total = unit_price * Decimal(str(item.quantity))
            total_amount += line_total

            order_items.append(
                OrderItem(
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=unit_price,
                )
            )

        order = Order(
            customer_id=data.customer_id,
            total_amount=total_amount,
            items=order_items,
        )
        db.add(order)
        await db.flush()
        return order

    @staticmethod
    async def get_all(
        db: AsyncSession, page: int = 1, limit: int = 20
    ) -> tuple[list[Order], int]:
        query = (
            select(Order)
            .options(
                selectinload(Order.customer),
                selectinload(Order.items).selectinload(OrderItem.product),
            )
            .order_by(Order.created_at.desc())
        )
        count_query = select(func.count(Order.id))
        total = (await db.execute(count_query)).scalar() or 0
        offset = (page - 1) * limit
        result = await db.execute(query.offset(offset).limit(limit))
        orders = list(result.scalars().unique().all())
        return orders, total

    @staticmethod
    async def get_by_id(db: AsyncSession, order_id: UUID) -> Order:
        result = await db.execute(
            select(Order)
            .options(
                selectinload(Order.customer),
                selectinload(Order.items).selectinload(OrderItem.product),
            )
            .where(Order.id == order_id)
        )
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"detail": "Order not found", "code": "NOT_FOUND"},
            )
        return order

    @staticmethod
    async def delete(db: AsyncSession, order_id: UUID) -> None:
        result = await db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id)
        )
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"detail": "Order not found", "code": "NOT_FOUND"},
            )

        for item in order.items:
            product_result = await db.execute(
                select(Product).where(Product.id == item.product_id).with_for_update()
            )
            product = product_result.scalar_one_or_none()
            if product:
                product.stock_qty += item.quantity

        await db.delete(order)
        await db.flush()
