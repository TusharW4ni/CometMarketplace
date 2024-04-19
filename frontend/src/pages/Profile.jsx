import {
  Button,
  TextInput,
  Avatar,
  Select,
  Tooltip,
  Textarea,
  Image,
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Tabs } from '@mantine/core';

import { Carousel } from '@mantine/carousel';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import TrashIcon from '../assets/icons/TrashIcon';
import EditIcon from '../assets/icons/EditIcon';
import CheckIcon from '../assets/icons/CheckIcon';
import CrossIcon from '../assets/icons/CrossIcon';

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth0();
  const auth0ProfilePicture = user ? user.picture : null;
  const [localUser, setLocalUser] = useState(null);
  const [formData, setFormData] = useState({
    profilePicture: auth0ProfilePicture,
    name: '',
    email: '',
    pronouns: '',
    bio: '',
  });
  const [fileData, setFileData] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  useEffect(() => {
    console.log('editFormData', editFormData);
  }, [editFormData]);

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
        window.location.reload();
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
    <div>
      <Navbar />
      <Tabs
        defaultValue="my-posts"
        color="orange"
        orientation="vertical"
        variant="pills"
      >
        <div className="flex fixed flex-col h-screen bg-green-800 pt-16 justify-between items-center">
          <Tabs.List>
            <Tabs.Tab value="my-posts">My Posts</Tabs.Tab>
            <Tabs.Tab value="update-profile">Update Profile</Tabs.Tab>
          </Tabs.List>
          <div className="mb-3">
            <Button color="red" size="sm" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
        <Tabs.Panel value="my-posts">
          <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-20 pl-36">
            {myPosts && myPosts.length > 0 ? (
              myPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded overflow-hidden shadow-lg p-6 bg-orange-200"
                >
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
                    <p className="text-gray-700 text-base flex justify-center mt-2 bg-orange-300 p-2 rounded-lg">
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
                    </p>
                  </div>
                  <div className="flex justify-between w-full ">
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
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h1 className="text-2xl text-white">No posts available</h1>
              </div>
            )}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="update-profile">
          <div className="flex flex-col h-screen space-y-10 justify-center items-center">
            {showConfirmation && (
              <div>
                <p className="bg-orange-500 rounded-full text-white p-2">
                  Profile Updated!
                </p>
              </div>
            )}
            <div
              onClick={() => {
                document.getElementById('imageUpload').click();
              }}
            >
              <Avatar
                size="lg"
                className="hover:cursor-pointer"
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
              <input
                id="imageUpload"
                type="file"
                onChange={handleImgUpload}
                style={{ display: 'none' }}
              />
            </div>
            <form
              className="w-2/4 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                onUpdate();
              }}
            >
              <TextInput
                label="Name"
                styles={{ label: { color: 'white' } }}
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.currentTarget.value,
                  })
                }
              />
              <Tooltip label="Cannot Change Email" position="left">
                <TextInput
                  label="Email"
                  styles={{ label: { color: 'white' } }}
                  disabled
                  value={formData.email}
                />
              </Tooltip>
              <TextInput
                label="Pronouns"
                styles={{ label: { color: 'white' } }}
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
                styles={{ label: { color: 'white' } }}
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
                <Button type="submit" onClick={onUpdate}>
                  Update
                </Button>
              </div>
            </form>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
