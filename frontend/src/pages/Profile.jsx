import {
  Button,
  TextInput,
  Avatar,
  Select,
  Tooltip,
  Textarea,
  Image,
  ActionIcon,
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
import { useHover } from '@mantine/hooks';
import BookmarkFilledIcon from '../assets/icons/BookmarkFilledIcon';
import { ToastContainer, toast } from 'react-toastify';
import BookmarkFilledSlashIcon from '../assets/icons/BookmarkFilledSlashIcon';

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
  const [originalFormData, setOriginalFormData] = useState({
    profilePicture: auth0ProfilePicture,
    name: '',
    email: '',
    pronouns: '',
    bio: '',
  });
  const [showCancelButton, setShowCancelButton] = useState(false);

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
        setOriginalFormData({
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

  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(originalFormData)) {
      setShowCancelButton(true);
    } else {
      setShowCancelButton(false);
    }
  }, [formData]);

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
    // toast.success('Profile Updated!', {
    //   position: 'top-center',
    // });
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
    <>
      <ToastContainer />
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
            <div className="relative">
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
              <div className="absolute bottom-0 right-0 rounded-full bg-white p-1 border-2 border-orange-500">
                <EditIcon />
              </div>
            </div>
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
            <div className="flex w-full justify-center space-x-10">
              {showCancelButton && (
                <Button color="red" onClick={() => setRefresh(refresh + 1)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" color="orange" onClick={onUpdate}>
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export function MyPosts() {
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

  useEffect(() => {
    const postToEdit = myPosts.find((post) => post.id === whoClickedEdit);
    if (postToEdit) {
      setEditFormData({
        title: postToEdit.title,
        desc: postToEdit.desc,
        price: postToEdit.price,
      });
      setDefaultFormData({
        title: postToEdit.title,
        desc: postToEdit.desc,
        price: postToEdit.price,
      });
    }
  }, [whoClickedEdit]);

  return (
    <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-20 pl-36">
      {myPosts && myPosts.length > 0 ? (
        myPosts.map((post) => (
          <div
            key={post.id}
            className="rounded overflow-hidden shadow-lg p-6 bg-orange-200"
          >
            {/* {editClicked ? (
              <div className="fixed z-10 bg-white m-2 p-2 rounded-full hover:cursor-pointer ">
                <EditIcon />
              </div>
            ) : null} */}
            <Carousel withIndicators loop>
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
                {
                  <div
                    className=" flex-grow font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2 hover:cursor-pointer hover:text-blue-300 hover:underline"
                    onClick={() => {
                      if (!editClicked || whoClickedEdit !== post.id) {
                        navigate(`/item/${post.id}`);
                      }
                    }}
                  >
                    {editClicked && whoClickedEdit === post.id ? (
                      <div>
                        <TextInput
                          size="sm"
                          value={editFormData.title}
                          onChange={(event) => {
                            setEditFormData({
                              ...editFormData,
                              title: event.currentTarget.value,
                            });
                          }}
                        />
                      </div>
                    ) : (
                      post.title
                    )}
                  </div>
                }
                <div className="  items-center text-gray-700 bg-orange-300 rounded-full justify-center flex p-2">
                  {editClicked && whoClickedEdit === post.id ? (
                    <div>
                      <TextInput
                        size="sm"
                        value={editFormData.price}
                        onChange={(event) => {
                          setEditFormData({
                            ...editFormData,
                            price: event.currentTarget.value,
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <>${Number(post.price).toLocaleString('en-US')}</>
                  )}
                </div>
              </div>
              <div className="text-gray-700 text-base flex justify-center mt-2 bg-orange-300 p-2 rounded-lg">
                {editClicked && whoClickedEdit === post.id ? (
                  <div>
                    <Textarea
                      size="sm"
                      value={editFormData.desc}
                      resize="vertical"
                      onChange={(event) => {
                        setEditFormData({
                          ...editFormData,
                          desc: event.currentTarget.value,
                        });
                      }}
                    />
                  </div>
                ) : (
                  post.desc
                )}
              </div>
            </div>
            <div className="flex justify-between w-full ">
              <Button
                color="red"
                onClick={() => {
                  axios.patch(
                    `${
                      import.meta.env.VITE_APP_EXPRESS_BASE_URL
                    }/api/post/archivePost`,
                    { postId: post.id },
                  );
                  setRefresh(refresh + 1);
                }}
              >
                <TrashIcon />
              </Button>
              {editClicked && whoClickedEdit === post.id ? (
                <Button
                  color="blue"
                  onClick={() => {
                    setEditClicked(false);
                    setWhoClickedEdit(0);
                    setEditFormData(defaultFormData);
                  }}
                >
                  <CrossIcon />
                </Button>
              ) : null}
              <Button
                color="green"
                onClick={async () => {
                  if (!editClicked) {
                    setEditClicked(true);
                    setWhoClickedEdit(post.id);
                  } else {
                    await axios.patch(
                      `${
                        import.meta.env.VITE_APP_EXPRESS_BASE_URL
                      }/api/post/updatePost`,
                      {
                        postId: post.id,
                        title: editFormData.title,
                        desc: editFormData.desc,
                        price: editFormData.price,
                      },
                    );
                    setRefresh(refresh + 1);
                    setEditClicked(false);
                    setWhoClickedEdit(0);
                    setEditFormData(defaultFormData);
                  }
                }}
              >
                {editClicked && whoClickedEdit === post.id ? (
                  <CheckIcon />
                ) : (
                  <EditIcon />
                )}
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <h1 className="text-2xl text-white">No posts available</h1>
        </div>
      )}
    </div>
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
                  color=""
                  className="relative top-0 right-0 m-2 hover:cursor-pointer"
                  onClick={() => handleBookmarkSlashClick(post)}
                >
                  <BookmarkFilledSlashIcon />
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
