from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


class CustomerService:

    @staticmethod
    async def create(db: AsyncSession, data: CustomerCreate) -> Customer:
        existing = await db.execute(select(Customer).where(Customer.email == data.email))
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"detail": f"Customer with email '{data.email}' already exists", "code": "EMAIL_CONFLICT"},
            )
        customer = Customer(**data.model_dump())
        db.add(customer)
        await db.flush()
        return customer

    @staticmethod
    async def get_all(
        db: AsyncSession, page: int = 1, limit: int = 20
    ) -> tuple[list[Customer], int]:
        query = select(Customer).order_by(Customer.created_at.desc())
        count_query = select(func.count(Customer.id))
        total = (await db.execute(count_query)).scalar() or 0
        offset = (page - 1) * limit
        result = await db.execute(query.offset(offset).limit(limit))
        customers = list(result.scalars().all())
        return customers, total

    @staticmethod
    async def get_by_id(db: AsyncSession, customer_id: UUID) -> Customer:
        result = await db.execute(select(Customer).where(Customer.id == customer_id))
        customer = result.scalar_one_or_none()
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"detail": "Customer not found", "code": "NOT_FOUND"},
            )
        return customer

    @staticmethod
    async def delete(db: AsyncSession, customer_id: UUID) -> None:
        customer = await CustomerService.get_by_id(db, customer_id)
        await db.delete(customer)
        await db.flush()
