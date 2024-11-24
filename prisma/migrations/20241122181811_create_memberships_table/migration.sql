-- CreateTable
CREATE TABLE "memberships" (
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "end_name" VARCHAR(100) NOT NULL,
    "profile_image" VARCHAR(255),

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("email")
);
