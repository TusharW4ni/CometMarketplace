const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  getUser: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  newUser: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email: email,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  newPost: async (req, res) => {
    const {title, price, description, photos} = req.body;
    console.log(photos);
  }
};
