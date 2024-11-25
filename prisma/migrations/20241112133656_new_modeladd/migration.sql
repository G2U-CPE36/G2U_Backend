-- CreateTable
CREATE TABLE "Favorite" (
    "favoriteId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "favoriteItem" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("favoriteId")
);

-- CreateTable
CREATE TABLE "UserLog" (
    "userLogId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "editType" INTEGER NOT NULL,
    "editValue" INTEGER NOT NULL,

    CONSTRAINT "UserLog_pkey" PRIMARY KEY ("userLogId")
);

-- CreateTable
CREATE TABLE "AuctionLog" (
    "auctionLogId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "bidPrice" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionLog_pkey" PRIMARY KEY ("auctionLogId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Auction" (
    "auctionId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "startPrice" INTEGER NOT NULL,
    "minimumBid" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("auctionId")
);

-- CreateTable
CREATE TABLE "OpenOrder" (
    "openOrderId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "productDescription" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,

    CONSTRAINT "OpenOrder_pkey" PRIMARY KEY ("openOrderId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "productDescription" TEXT NOT NULL,
    "productImage" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "UserAddress" (
    "addressId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subDistrict" TEXT,
    "postcode" INTEGER NOT NULL,
    "address" TEXT,
    "note" TEXT,
    "receiverName" TEXT NOT NULL,
    "phone" BIGINT NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "detail" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "WalletLog" (
    "walletLogId" SERIAL NOT NULL,
    "walletId" INTEGER NOT NULL,
    "transactionType" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "WalletLog_pkey" PRIMARY KEY ("walletLogId")
);

-- CreateTable
CREATE TABLE "UserPayment" (
    "paymentId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "paymentType" INTEGER NOT NULL,
    "data1" TEXT,
    "data2" TEXT,
    "data3" TEXT,

    CONSTRAINT "UserPayment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "UserWallet" (
    "walletId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentValue" INTEGER NOT NULL,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("walletId")
);

-- CreateTable
CREATE TABLE "Verification" (
    "verificationId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "citizenId" BIGINT NOT NULL,
    "verificationStatus" INTEGER NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("verificationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLog" ADD CONSTRAINT "UserLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionLog" ADD CONSTRAINT "AuctionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionLog" ADD CONSTRAINT "AuctionLog_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("auctionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenOrder" ADD CONSTRAINT "OpenOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletLog" ADD CONSTRAINT "WalletLog_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "UserWallet"("walletId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayment" ADD CONSTRAINT "UserPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
