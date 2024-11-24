-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "service_code" VARCHAR(100),
    "invoice_number" VARCHAR(100) NOT NULL,
    "transaction_type" VARCHAR(100) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "current_balance" INTEGER NOT NULL DEFAULT 0,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_on" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_invoice_number_key" ON "transactions"("invoice_number");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_email_fkey" FOREIGN KEY ("email") REFERENCES "memberships"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_service_code_fkey" FOREIGN KEY ("service_code") REFERENCES "services"("service_code") ON DELETE SET NULL ON UPDATE CASCADE;
