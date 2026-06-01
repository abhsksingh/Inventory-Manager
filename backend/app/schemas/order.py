from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal

from app.schemas.product import ProductResponse


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: UUID
    items: List[OrderItemCreate] = Field(..., min_length=1)


class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    customer_name: str
    status: str
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse]

    model_config = {"from_attributes": True}


class DashboardSummary(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    total_revenue: float
    low_stock_products: List[ProductResponse]

    model_config = {"from_attributes": True}
