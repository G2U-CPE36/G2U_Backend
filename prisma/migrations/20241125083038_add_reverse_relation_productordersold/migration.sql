-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERY', 'DELIVER', 'CANCELLED');

-- DropIndex
DROP INDEX "UserAddress_userId_isDefault_key";

-- CreateTable
CREATE TABLE "ProductOrder" (
    "orderId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "addressId" INTEGER NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveryDate" TIMESTAMP(3),
    "paymentStatus" TEXT,

    CONSTRAINT "ProductOrder_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "_Seller" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Seller_AB_unique" ON "_Seller"("A", "B");

-- CreateIndex
CREATE INDEX "_Seller_B_index" ON "_Seller"("B");

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "UserAddress"("addressId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Seller" ADD CONSTRAINT "_Seller_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Seller" ADD CONSTRAINT "_Seller_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductOrder"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
