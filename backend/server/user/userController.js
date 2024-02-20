const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = {
  getAllUsers: async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  }
}