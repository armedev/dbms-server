import { PrismaClient } from "@prisma/client";
// import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// const salt = 10;

async function main() {
  //   await prisma.user.deleteMany({
  //     where: {
  //       id: {
  //         gt: 0,
  //       },
  //     },
  //   });
  //   const hashedPass = await bcrypt.hash("admin123", salt);
  //   const user = await prisma.user.create({
  //     data: {
  //       email: "admin@admin.com",
  //       name: "ADMIN",
  //       admin: true,
  //       passwordHash: hashedPass,
  //     },
  //   });
  //   const users = await prisma.user.findMany({ take: 10 });
  // await prisma.user.update({
  //   data: {
  //     admin: true,
  //   },
  //   where: {
  //     id: 1,
  //   },
  // });
  await prisma.collection.update({
    where: { id: 3 },
    data: {
      owner: { connect: { id: 32 } },
    },
  });
  //   await prisma.category.createMany({
  //     data: [
  //       {
  //         name: "Sport",
  //       },
  //       {
  //         name: "Electric",
  //       },
  //       {
  //         name: "Hyper Sport",
  //       },
  //       {
  //         name: "Economy",
  //       },
  //     ],
  //   });
  //   const mods = await prisma.mods.findMany({ where: {} });
  //   console.log(mods);

  //   const collection = await prisma.collection.create({
  //     data: {
  //       name: "Supra",
  //       photos: [
  //         "https://images.unsplash.com/photo-1563197527-b5677321c356",
  //         "https://images.unsplash.com/photo-1623340351699-ef1d2ed28f4d",
  //       ],
  //       price: 35000000,
  //       color: "Black",
  //       model: 2015,
  //       categories: { connect: { name: "Sport" } },
  //       //   category: "Sport",
  //       bhp: "220 BHP",
  //       torque: "368 lb-ft TORQ",
  //       brand: "TOYOTA",
  //       cc: 1998,
  //       primaryPic:
  //         "https://images.unsplash.com/photo-1595953453746-1f08382c04c0",
  //       mods: {
  //         connect: [
  //           { name: "Exhaust" },
  //           { name: "Turbo" },
  //           { name: "Intake" },
  //           { name: "Carbon Fibre Body" },
  //           { name: "Alloy Wheels" },
  //           { name: "Head Port" },
  //           { name: "Short Shifter" },
  //         ],
  //       },
  //     },
  //   });
  //   console.log(collection);
  //   const hashedPass = await bcrypt.hash("test123", salt);

  //   const user = await prisma.user.create({
  //     data: {
  //       email: "test@gasmonkey.com",
  //       passwordHash: hashedPass,
  //       admin: false,
  //       name: "TEST",
  //       orders: {
  //         create: {
  //           price: 30000000,
  //           toCollection: { connect: { id: 3 } },
  //         },
  //       },
  //     },
  //   });
  const users = await prisma.user.findMany();
  console.log("users: ", users);
  const collections = await prisma.collection.findMany();
  console.log("collections: ", collections);
  const orders = await prisma.orders.findMany();
  console.log("orders: ", orders);
  const category = await prisma.category.findMany();
  console.log("category: ", category);
  const mods = await prisma.mods.findMany();
  console.log("mod: ", mods);
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
