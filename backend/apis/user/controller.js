const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUser = async (req, res) => {
  const { email } = req.body;
  console.log("this is user's email", email);
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        posts: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log('error in /api/getUser', error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log('error in /api/getUserById', error);
    res.status(500).json({ error: error.message });
  }
};

const newUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
      },
    });
    res.status(200).json(user);
    // return;
  } catch (error) {
    console.log('error in /api/newUser', error);
    res.status(500).json({ error: error.message });
  }
};

const newPost = async (req, res) => {
  console.log('this is req.body', req.body);
  const { title, desc, price, userId } = req.body;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  console.log('user', user);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  try {
    const post = await prisma.post.create({
      data: {
        title: title,
        desc: desc,
        price: parseInt(price),
        userId: parseInt(userId),
      },
    });
    return res.status(200).json({ postId: post.id });
  } catch (error) {
    console.log('error in /api/user/new-post', error);
    return res.status(500).json({ error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId, postId } = req.query;
    const dir = `uploads/${userId}/${postId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const handleUpload = async (req, res) => {
  const { userId, postId } = req.query;
  try {
    const photosFolder = `uploads/${userId}/${postId}`;
    await prisma.post.update({
      where: {
        id: parseInt(postId),
      },
      data: {
        photosFolder,
      },
    });
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log('error in /api/user/add-images-to-new-post', error);
    return res.status(500).json({ error: error.message });
  }
};

const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { posts: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add photos to each post
    for (let post of user.posts) {
      const dir = post.photosFolder;
      if (fs.existsSync(dir)) {
        post.photos = fs.readdirSync(dir).map((file) => `${dir}/${file}`);
      } else {
        post.photos = [];
      }
    }

    res.status(200).json(user);
  } catch (error) {
    console.log('error in /api/user/get-posts/:userId', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
    });

    for (let post of posts) {
      const dir = post.photosFolder;
      if (fs.existsSync(dir)) {
        post.photos = fs.readdirSync(dir).map((file) => `${dir}/${file}`);
      } else {
        post.photos = [];
      }
    }
    
    res.status(200).json(posts);
  } catch (error) {
    console.log('error in /api/getAllPosts', error);
    res.status(500).json({ error: error.message });
  }
};

const addRoutes = (router) => {
  router.post('/api/getUser', getUser);
  router.get('/api/getUserById/:id', getUserById);
  router.post('/api/newUser', newUser);
  router.post('/api/user/new-post', newPost);
  router.post(
    '/api/user/add-images-to-new-post',
    upload.array('files'),
    handleUpload,
  );
  router.get('/api/user/get-posts/:userId', getUserPosts);
  router.get('/api/getAllPosts', getAllPosts);
  router.get('/api/getPostNameFromId/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).json(post);
    } catch (error) {
      console.log('error in /api/getPostNameFromId/:id', error);
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = {
  addRoutes,
};
