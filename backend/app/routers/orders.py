from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.database import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(data: OrderCreate, db: AsyncSession = Depends(get_db)):
    order = await OrderService.create(db, data)
    return await OrderService.get_by_id(db, order.id)


@router.get("", response_model=dict)
async def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    orders, total = await OrderService.get_all(db, page, limit)
    return {
        "data": [OrderResponse.model_validate(o) for o in orders],
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: UUID, db: AsyncSession = Depends(get_db)):
    return await OrderService.get_by_id(db, order_id)


@router.delete("/{order_id}", status_code=204)
async def delete_order(order_id: UUID, db: AsyncSession = Depends(get_db)):
    await OrderService.delete(db, order_id)
