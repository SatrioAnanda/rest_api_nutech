import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.banner.createMany({
    data: [
      {
        banner_name: "Banner 1",
        banner_image:
          "https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 2",
        banner_image:
          "https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 3",
        banner_image:
          "https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 4",
        banner_image:
          "https://minio.nutech-integrasi.com/take-home-test/banner/Banner-4.png",
        description: "Lerem Ipsum Dolor sit amet",
      },
      {
        banner_name: "Banner 5",
        banner_image:
          "https://minio.nutech-integrasi.com/take-home-test/banner/Banner-5.png",
        description: "Lerem Ipsum Dolor sit amet",
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        service_code: "PAJAK",
        service_name: "Pajak PBB",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/PBB.png",
        service_tarif: 40000,
      },
      {
        service_code: "PLN",
        service_name: "Listrik",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Listrik.png",
        service_tarif: 10000,
      },
      {
        service_code: "PDAM",
        service_name: "PDAM Berlangganan",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/PDAM.png",
        service_tarif: 40000,
      },
      {
        service_code: "PULSA",
        service_name: "Pulsa",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Pulsa.png",
        service_tarif: 40000,
      },
      {
        service_code: "PGN",
        service_name: "PGN Berlangganan",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/PGN.png",
        service_tarif: 50000,
      },
      {
        service_code: "MUSIK",
        service_name: "Musik Berlangganan",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Musik.png",
        service_tarif: 50000,
      },
      {
        service_code: "TV",
        service_name: "TV Berlangganan",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Televisi.png",
        service_tarif: 50000,
      },
      {
        service_code: "PAKET_DATA",
        service_name: "Paket Data",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Paket-Data.png",
        service_tarif: 50000,
      },
      {
        service_code: "VOUCHER_GAME",
        service_name: "Voucher Game",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Game.png",
        service_tarif: 100000,
      },
      {
        service_code: "VOUCHER_MAKANAN",
        service_name: "Voucher Makanan",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Voucher-Makanan.png",
        service_tarif: 100000,
      },
      {
        service_code: "QURBAN",
        service_name: "Qurban",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Qurban.png",
        service_tarif: 200000,
      },
      {
        service_code: "ZAKAT",
        service_name: "Zakat",
        service_icon:
          "https://minio.nutech-integrasi.com/take-home-test/services/Zakat.png",
        service_tarif: 300000,
      },
    ],
  });

  console.log("Seeding selesai!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
