-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "banner_name" VARCHAR(100) NOT NULL,
    "banner_image" VARCHAR(100),
    "description" TEXT,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "service_code" VARCHAR(100) NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,
    "service_icon" VARCHAR(100),
    "service_tarif" INTEGER NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_service_code_key" ON "services"("service_code");
