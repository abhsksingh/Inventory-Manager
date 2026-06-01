from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from app.database import get_db
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/api/v1/customers", tags=["customers"])


@router.post("", response_model=CustomerResponse, status_code=201)
async def create_customer(data: CustomerCreate, db: AsyncSession = Depends(get_db)):
    return await CustomerService.create(db, data)


@router.get("", response_model=dict)
async def list_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    customers, total = await CustomerService.get_all(db, page, limit)
    return {
        "data": [CustomerResponse.model_validate(c) for c in customers],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: UUID, db: AsyncSession = Depends(get_db)):
    return await CustomerService.get_by_id(db, customer_id)


@router.delete("/{customer_id}", status_code=204)
async def delete_customer(customer_id: UUID, db: AsyncSession = Depends(get_db)):
    await CustomerService.delete(db, customer_id)
