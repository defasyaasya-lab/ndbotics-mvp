const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {
      shopName: process.env.SHOP_NAME || "NDBotics",
      supplierWa: process.env.SUPPLIER_WA || "6285346567107",
      bankName: process.env.BANK_NAME || "BRI",
      bankAccount: process.env.BANK_ACCOUNT || "694201029298534",
      bankHolder: process.env.BANK_HOLDER || "M NABIL KHAIRI IKHSAN",
      invoicePref: "INV"
    },
    create: {
      id: "singleton",
      shopName: process.env.SHOP_NAME || "NDBotics",
      supplierWa: process.env.SUPPLIER_WA || "6285346567107",
      bankName: process.env.BANK_NAME || "BRI",
      bankAccount: process.env.BANK_ACCOUNT || "694201029298534",
      bankHolder: process.env.BANK_HOLDER || "M NABIL KHAIRI IKHSAN",
      invoicePref: "INV"
    }
  });
  console.log("Seeded Setting singleton.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
