import {
  Button,
  TextInput,
  Avatar,
  Select,
  Tooltip,
  Textarea,
  Image,
  ActionIcon,
  Menu,
  rem,
  Modal,
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { User, useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Tabs } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { Navigate, useNavigate } from 'react-router-dom';
import TrashIcon from '../assets/icons/TrashIcon';
import EditIcon from '../assets/icons/EditIcon';
import CheckIcon from '../assets/icons/CheckIcon';
import CrossIcon from '../assets/icons/CrossIcon';
import { useHover, useDisclosure } from '@mantine/hooks';
import BookmarkFilledIcon from '../assets/icons/BookmarkFilledIcon';
import MenuIcon from '../assets/icons/MenuIcon';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormData from 'form-data';

export function UpdateProfile({ refresh, setRefresh }) {
  const { hovered, ref } = useHover();
  const { user } = useAuth0();
  const auth0ProfilePicture = user ? user.picture : null;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [formData, setFormData] = useState({
    profilePicture: auth0ProfilePicture,
    name: '',
    email: '',
    pronouns: '',
    bio: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        setLocalUser(response.data);
        console.log('localUser', response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          pronouns: response.data.pronouns,
          bio: response.data.bio,
          profilePicture: response.data.profilePicture || auth0ProfilePicture,
        });
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
    if (user) {
      fetchUserDetails();
    }
    setShowConfirmation(false);
  }, [refresh]);

  const onUpdate = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/updateProfile`,
        { ...formData, id: localUser.id },
      );
    } catch (error) {
      console.error('Failed to update user:', error);
    }
    if (fileData) {
      try {
        await axios.post(
          `${
            import.meta.env.VITE_APP_EXPRESS_BASE_URL
          }/api/user/updateProfile/updateProfilePicture`,
          fileData,
          {
            params: {
              userId: localUser.id,
            },
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } catch (error) {
        console.error('Failed to update profile picture:', error);
      }
    }
    setShowConfirmation(true);
    setTimeout(() => {
      setRefresh(refresh + 1);
      setFormData({
        name: '',
        email: '',
        pronouns: '',
        bio: '',
        profilePicture: '',
      });
    }, 1000);
  };

  const handleImgUpload = (event) => {
    const file = event.target.files[0];
    const newFileData = new FormData();
    newFileData.append('file', file);
    setFileData(newFileData);

    const fileURL = URL.createObjectURL(file);
    setFormData({ ...formData, profilePicture: fileURL });
  };

  return (
    <div className="flex flex-col h-screen space-y-10 justify-center items-center">
      {/* confirmation */}
      {showConfirmation && (
        <div>
          <p className="bg-orange-500 rounded-full text-white p-2 mt-4">
            Profile Updated!
          </p>
        </div>
      )}
      <div className="flex flex-col bg-gray-200 w-1/3 h-3/4 space-y-10 justify-center items-center p-10 rounded-lg border-4 border-orange-500 overflow-auto">
        {/* profile picture */}
        <div
          onClick={() => {
            document.getElementById('imageUpload').click();
          }}
        >
          <Tooltip label="Change Profile Picture" position="bottom">
            <Avatar
              size="xl"
              className="hover:cursor-pointer hover:border-4 hover:border-orange-500"
              src={
                formData.profilePicture.includes('blob')
                  ? formData.profilePicture
                  : formData.profilePicture.includes('gravatar')
                  ? formData.profilePicture
                  : formData.profilePicture === undefined
                  ? auth0ProfilePicture
                  : `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${
                      localUser.profilePictureFile
                    }`
              }
            />
          </Tooltip>
          <input
            id="imageUpload"
            type="file"
            onChange={handleImgUpload}
            style={{ display: 'none' }}
          />
        </div>
        {/* profile form */}
        <form
          className="w-2/4 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            onUpdate();
          }}
        >
          <TextInput
            ref={ref}
            label="Name"
            value={formData.name}
            onChange={(event) =>
              setFormData({
                ...formData,
                name: event.currentTarget.value,
              })
            }
          />
          <Tooltip label="Cannot Change Email" position="left">
            <TextInput label="Email" disabled value={formData.email} />
          </Tooltip>
          <TextInput
            label="Pronouns"
            value={formData.pronouns}
            onChange={(event) =>
              setFormData({
                ...formData,
                pronouns: event.currentTarget.value,
              })
            }
          />
          <Textarea
            label="Bio"
            resize="vertical"
            value={formData.bio}
            onChange={(event) =>
              setFormData({
                ...formData,
                bio: event.currentTarget.value,
              })
            }
          />
          <div className="flex w-full justify-center">
            <Button type="submit" color="orange" onClick={onUpdate}>
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MyPosts() {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [editClicked, setEditClicked] = useState(false);
  const [whoClickedEdit, setWhoClickedEdit] = useState(0);
  const [editFormData, setEditFormData] = useState({
    title: '',
    desc: '',
    price: '',
  });
  const [defaultFormData, setDefaultFormData] = useState({
    title: '',
    desc: '',
    price: '',
  });
  const [cancleEdit, setCancleEdit] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { user } = useAuth0();
  const [localUser, setLocalUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState({});
  const [price, setPrice] = useState(0);
  const [tempPhotos, setTempPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        setLocalUser(response.data);
        console.log('localUser', response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
    if (user) {
      fetchUserDetails();
    }
  }, [refresh]);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_APP_EXPRESS_BASE_URL
          }/api/user/getPostsForUser/${localUser.id}`,
        );
        setMyPosts(res.data);
        console.log('myPosts', res.data);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      }
    };
    if (localUser) {
      getUserPosts();
    }
  }, [localUser, refresh]);

  const handlePriceChange = (event) => {
    // Remove all non-digit characters
    let rawValue = event.target.value.replace(/\D/g, '');

    if (rawValue !== '' ? rawValue > 100000 : false) {
      toast.error('Price cannot exceed $100,000', {
        position: 'top-center',
      });
      rawValue = '100000';
    }

    setEditFormData({ ...editFormData, price: rawValue });

    // Convert to a number and format with commas
    const formattedValue =
      rawValue !== '' ? Number(rawValue).toLocaleString('en-US') : '';

    setPrice(formattedValue);
  };

  const handleSubmit = async () => {
    if (
      editFormData.desc === '' ||
      editFormData.price === '' ||
      editFormData.title === ''
    ) {
      toast.error('Please fill out all fields', {
        position: 'top-center',
      });
    }
    console.log('updating editFormData', editFormData);
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/post/updatePost`,
        {
          ...editFormData,
          postId: selectedPost.id,
        },
      );
    } catch (error) {
      console.error('Failed to update post:', error);
    }

    let formDataObj = new FormData();
    // console.log("files in edit post", files)
    files.forEach((file) => {
      formDataObj.append('files', file);
    });
    console.log('this is the fileDataObj from handleSumbit', formDataObj);
    try {
      // console.log('Try Catch block for updating post images');
      await axios.post(
        `${
          import.meta.env.VITE_APP_EXPRESS_BASE_URL
        }/api/user/updatePostImages/`,
        formDataObj,
        {
          params: {
            userId: localUser.id,
            postId: selectedPost.id,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Successfully updated post images');
    } catch (error) {
      console.error('Failed to update post images:', error);
    }
    setFiles([]);
    setPreviewUrls([]);
    setEditFormData({ title: '', desc: '', price: '' });
    setRefresh(refresh + 1);
    close();
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, uploadedFiles]);

    // Create URLs representing the files
    const urls = uploadedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  useEffect(() => {
    console.log('editFormData', editFormData);
  }, [editFormData]);

  return (
    <>
      <ToastContainer />
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setFiles([]);
          setPreviewUrls([]);
          setEditFormData({ title: '', desc: '', price: '' });
          setRefresh(refresh + 1);
        }}
        size="auto"
        centered
        title="Edit Post"
      >
        <div className="flex space-x-10">
          <div className="flex flex-col">
            <div>
              <Button component="label" htmlFor="fileUpload">
                Upload Photos
              </Button>
              <input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt="" width={100} height={100} />
                  <button
                    className="absolute top-0 right-0 bg-gray-500 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => {
                      const newPreviewUrls = previewUrls.filter(
                        (_, i) => i !== index,
                      );
                      setPreviewUrls(newPreviewUrls);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="title" className="">
              Title
            </label>
            <input
              type="text"
              className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              value={editFormData.title}
            />
            <label htmlFor="price" className="">
              Price
            </label>
            <input
              type="text"
              value={`$ ${price}`}
              onChange={handlePriceChange}
              className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <label htmlFor="description" className="">
              Description
            </label>
            <textarea
              className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={editFormData.desc}
              onChange={(e) =>
                setEditFormData({ ...editFormData, desc: e.target.value })
              }
            />
            <Button color="orange" onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </div>
      </Modal>
      <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-20 pl-36">
        {myPosts && myPosts.length > 0 ? (
          myPosts.map((post) => (
            <div
              key={post.id}
              className="rounded overflow-hidden shadow-lg p-6 bg-orange-200 relative"
            >
              <div className="mb-1">
                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="transparent" color="black">
                      <MenuIcon />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={
                        <IconEdit style={{ width: rem(14), height: rem(14) }} />
                      }
                      onClick={() => {
                        open();
                        const foundPost = myPosts.find((p) => p.id === post.id);
                        setSelectedPost(foundPost);
                        setEditFormData({
                          title: foundPost.title,
                          desc: foundPost.desc,
                          price: foundPost.price,
                        });
                        setPrice(foundPost.price.toLocaleString('en-US'));
                      }}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconTrash
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      onClick={() => {}}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
              <Carousel withIndicators>
                {post.photos.map((photo) => (
                  <Carousel.Slide key={photo}>
                    <Image
                      src={`${
                        import.meta.env.VITE_APP_EXPRESS_BASE_URL
                      }/${photo}`}
                      alt={post.title}
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
              <div className="px-6 py-4">
                <div className="flex space-x-5">
                  <div
                    className=" flex-grow font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2 hover:cursor-pointer hover:text-blue-300 hover:underline"
                    onClick={() => {
                      navigate(`/item/${post.id}`);
                    }}
                  >
                    {post.title}
                  </div>

                  <div className="  items-center text-gray-700 bg-orange-300 rounded-full justify-center flex p-2">
                    <>${Number(post.price).toLocaleString('en-US')}</>
                  </div>
                </div>
                <div className="text-gray-700 text-base flex justify-center mt-2 bg-orange-300 p-2 rounded-lg">
                  {post.desc}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <h1 className="text-2xl text-white">No posts available</h1>
          </div>
        )}
      </div>
    </>
  );
}

export function WishList({ refresh, setRefresh }) {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchLocalUser = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        console.log('user data from wish list', res.data);
        setLocalUser(res.data);
        return res.data;
      } catch (error) {
        console.log('error in getting user in WishList()', error);
      }
    };

    const fetchWishList = async (userId) => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_APP_EXPRESS_BASE_URL
          }/api/user/getWishList/${userId}`,
        );
        console.log('wish list', res.data);
        setList(res.data);
      } catch (error) {
        console.log('error getting wish list', error);
      }
    };

    if (user) {
      fetchLocalUser().then((userData) => fetchWishList(userData.id));
    }
  }, [refresh]);

  const handleBookmarkSlashClick = async ({ post }) => {
    console.log('post', post);
    console.log('postId', post.id);
    console.log('userId', post.user.id);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_APP_EXPRESS_BASE_URL
        }/api/user/removeFromWishList`,
        {
          userId: localUser.id,
          postId: post.id,
        },
      );
      setRefresh(refresh + 1);
    } catch (error) {
      console.log('error in handleBookmarkSlashClick()', error);
    }
  };

  return (
    <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-20 pl-36">
      {list && list.length > 0 ? (
        list.map((post) => (
          <div
            key={post.id}
            className="rounded overflow-hidden shadow-lg p-6 bg-orange-200"
          >
            <Carousel withIndicators loop>
              {post.post.photos &&
                post.post.photos.map((photo) => (
                  <Carousel.Slide key={photo}>
                    <Image
                      src={`${
                        import.meta.env.VITE_APP_EXPRESS_BASE_URL
                      }/${photo}`}
                      alt={post.post.title}
                    />
                  </Carousel.Slide>
                ))}
            </Carousel>
            <div className="px-6 py-4">
              <div className="flex space-x-5">
                <ActionIcon
                  color="red"
                  className="relative top-0 right-0 m-2 hover:cursor-pointer"
                  onClick={() => handleBookmarkSlashClick(post)}
                >
                  <BookmarkFilledIcon />
                </ActionIcon>
                <div
                  className=" flex-grow font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2 hover:cursor-pointer hover:text-blue-300 hover:underline"
                  onClick={() => {
                    navigate(`/item/${post.post.id}`);
                  }}
                >
                  {post.post.title}
                </div>
                <div className="  items-center text-gray-700 bg-orange-300 rounded-full justify-center flex p-2">
                  ${Number(post.post.price).toLocaleString('en-US')}
                </div>
              </div>
              <div className="text-gray-700 text-base flex justify-center mt-2 bg-orange-300 p-2 rounded-lg">
                {post.post.desc}
              </div>
              <div
                className="flex flex-col bg-orange-300 mt-3 p-4 rounded-lg justify-center items-center hover:underline hover:cursor-pointer hover:bg-orange-500"
                onClick={() => {
                  navigate(`/profile/${post.post.user.id}`);
                }}
              >
                <div className="">{post.post.user.email}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <h1 className="text-2xl text-white">No items in Your Wish List</h1>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { logout, user } = useAuth0();
  const [refresh, setRefresh] = useState(0);

  return (
    <div>
      <Navbar refresh={refresh} />
      <div className="">
        <Tabs
          defaultValue="update-profile"
          color="orange"
          orientation="vertical"
          variant="pills"
          radius="xl"
        >
          <div className="flex fixed flex-col h-screen bg-emerald-700 justify-between items-center p-2 ">
            <div className="flex flex-col h-full  justify-center">
              <Tabs.List>
                <Tabs.Tab value="update-profile">Profile</Tabs.Tab>
                <Tabs.Tab value="my-posts">My Posts</Tabs.Tab>
                <Tabs.Tab value="wish-list">Wish List</Tabs.Tab>
              </Tabs.List>
            </div>
            <div className="mb-3">
              <Button color="red" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          </div>
          <Tabs.Panel value="update-profile">
            <UpdateProfile refresh={refresh} setRefresh={setRefresh} />
          </Tabs.Panel>
          <Tabs.Panel value="my-posts">
            <MyPosts />
          </Tabs.Panel>
          <Tabs.Panel value="wish-list">
            <WishList refresh={refresh} setRefresh={setRefresh} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
