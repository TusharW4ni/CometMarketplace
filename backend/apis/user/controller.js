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
    console.log("User Info: ", user);
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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const { userId, postId } = req.query;
//     const dir = `uploads/${userId}/${postId}`;
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     // cb(null, file.originalname);
//     cb(null, uuidv4() + path.extname(file.originalname));
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;
    const { userId, postId } = req.query;
    
    if (postId) {
      dir = `uploads/posts/${userId}/${postId}`;
    } else {
      dir = `uploads/profiles/${userId}`;
    }
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { postId } = req.query;
    let filename;

    if (postId) {
      // Generate a unique filename for post images
      filename = uuidv4() + path.extname(file.originalname);
    } else {
      // Use a fixed filename for profile pictures to overwrite the old one
      filename = `profile${path.extname(file.originalname)}`;
    }
    
    cb(null, filename);
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
  console.log(req.params);
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

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  console.log('this is req.body', req.body);
  const { displayName, username, pronouns, bio} = req.body;

  console.log("displayName: ", displayName);
  try {
    const update = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: displayName,
        username: username,
        pronouns: pronouns,
        bio: bio,
      },
    });
    console.log(update);
    res.status(200).json(update);
  } catch (error) {
    console.log('error in /api/user/update-profile/:id', error);
    
    if (error.code == 'P2002'){
      res.status(409).json({ error: error });
    }else{
      res.status(500).json({ error: error });
    }
  }
};

const handleProfilePictureUpload = async (req, res) => {
  const { userId } = req.params;
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const profilePicturePath = req.file.path;

  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { profilePicture: profilePicturePath },
    });

    res.send({ message: 'Profile picture updated successfully!' });
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    res.status(500).send({ error: 'Failed to update profile picture.' });
  }
};



const addRoutes = (router) => {
  router.post('/api/user/update-profile/:id', updateUserProfile);
  router.post('/api/getUser', getUser);
  router.get('/api/getUserById/:id', getUserById);
  router.post('/api/newUser', newUser);
  router.post('/api/user/new-post', newPost);
  router.post(
    '/api/user/add-images-to-new-post',
    upload.array('files'),
    handleUpload,
  );
  router.post(
    '/api/user/upload-profile-picture/:userId',
    upload.single('profilePicture'),
    handleProfilePictureUpload);
  router.get('/api/user/get-posts/:userId', getUserPosts);
  router.get('/api/getAllPosts', getAllPosts);
};

module.exports = {
  addRoutes,
};
