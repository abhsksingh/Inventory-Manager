from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:

    @staticmethod
    async def create(db: AsyncSession, data: ProductCreate) -> Product:
        existing = await db.execute(select(Product).where(Product.sku == data.sku))
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"detail": f"Product with SKU '{data.sku}' already exists", "code": "SKU_CONFLICT"},
            )
        product = Product(**data.model_dump())
        db.add(product)
        await db.flush()
        return product

    @staticmethod
    async def get_all(
        db: AsyncSession, page: int = 1, limit: int = 20, search: str = ""
    ) -> tuple[list[Product], int]:
        query = select(Product).order_by(Product.created_at.desc())
        count_query = select(func.count(Product.id))

        if search:
            pattern = f"%{search}%"
            query = query.where(
                Product.name.ilike(pattern) | Product.sku.ilike(pattern)
            )
            count_query = count_query.where(
                Product.name.ilike(pattern) | Product.sku.ilike(pattern)
            )

        total = (await db.execute(count_query)).scalar() or 0
        offset = (page - 1) * limit
        result = await db.execute(query.offset(offset).limit(limit))
        products = list(result.scalars().all())
        return products, total

    @staticmethod
    async def get_by_id(db: AsyncSession, product_id: UUID) -> Product:
        result = await db.execute(select(Product).where(Product.id == product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"detail": "Product not found", "code": "NOT_FOUND"},
            )
        return product

    @staticmethod
    async def update(db: AsyncSession, product_id: UUID, data: ProductUpdate) -> Product:
        product = await ProductService.get_by_id(db, product_id)

        update_data = data.model_dump(exclude_unset=True)

        if "sku" in update_data and update_data["sku"] != product.sku:
            existing = await db.execute(
                select(Product).where(
                    Product.sku == update_data["sku"], Product.id != product_id
                )
            )
            if existing.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={"detail": f"Product with SKU '{update_data['sku']}' already exists", "code": "SKU_CONFLICT"},
                )

        for key, value in update_data.items():
            setattr(product, key, value)
        await db.flush()
        return product

    @staticmethod
    async def delete(db: AsyncSession, product_id: UUID) -> None:
        product = await ProductService.get_by_id(db, product_id)
        await db.delete(product)
        await db.flush()
