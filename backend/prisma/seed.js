const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User 1',
      posts: {
        create: [
          {
            title: 'Post 1',
            content: 'Content of Post 1',
            published: true,
          },
          {
            title: 'Post 2',
            content: 'Content of Post 2',
            published: false,
          },
        ],
      },
      profile: {
        create: {
          bio: 'Bio of User 1',
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'User 2',
      posts: {
        create: [
          {
            title: 'Post 3',
            content: 'Content of Post 3',
            published: true,
          },
        ],
      },
      profile: {
        create: {
          bio: 'Bio of User 2',
        },
      },
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
