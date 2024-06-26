/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
// npx prisma db seed
// Change the userAdmin with your email and name it whatever you want

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {}

main()
  .then(async () => {
    console.log('Seeding done.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
