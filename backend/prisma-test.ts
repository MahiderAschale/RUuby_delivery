// prisma-test.ts

import prisma from "./src/config/database.js";

async function test() {
  await prisma.$transaction(async (tx:any) => {
    await tx.payment.findFirst();
    await tx.order.findFirst();
    await tx.delivery.findFirst();
    await tx.address.findFirst();
    await tx.cart.findFirst();
    await tx.orderItem.findFirst();
  });
}