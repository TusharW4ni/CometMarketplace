import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Carousel } from '@mantine/carousel';
import { Image, Avatar, ActionIcon, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import PublicProfile from './PublicProfile';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import ReportPostIcon from '../assets/icons/ReportPostIcon';
import BookmarkFilledIcon from '../assets/icons/BookmarkFilledIcon';
import MessagesIcon from '../assets/icons/MessagesIcon';

export default function Home({ socket }) {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [currUser, setCurrUser] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const getUserAndPosts = async () => {
      try {
        const userRes = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );

        setStatus(userRes.data.status === 'ONLINE');
        console.log('userRes.data', userRes.data);
        setCurrUser(userRes.data);
        const postsRes = await axios.get(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getAllPosts`,
        );
        // console.log('postsRes.data', postsRes.data);
        // console.log("postsRes.data.user", postsRes.data.user)
        // console.log('befor eurl');
        // const url = `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${
        //   postsRes.data.user.profilePictureFile
        // }`;
        // console.log('asdfadfa url', url);
        // setProfilePicture(postsRes.data.user.profilePictureFile ? url : null);
        // console.log(
        //   'postsRes.data.user',
        //   postsRes.data.user.profilePictureFile,
        // );
        setPosts(postsRes.data);
      } catch (error) {
        console.log('error in getUser', error);
      }
    };
    if (user) {
      getUserAndPosts();
    }
  }, [refresh]);

  const handleBookmarkClick = async (postId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/addToWishList`,
        {
          userId: currUser.id,
          postId: postId,
        },
      );
      setRefresh(!refresh);
      console.log('Successfully added to wishlist');
    } catch (error) {
      console.log('error in handleBookmarkClick', error);
    }
  };

  return (
    <>
      <Navbar socket={socket} />
      <div className="mt-20">
        <div className="flex justify-center text-2xl text-white uppercase font-mono">
          Marketplace
        </div>
        <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="rounded overflow-hidden shadow-lg p-6 bg-orange-200"
              >
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
                    {post.userId !== currUser.id ? (
                      post.WishList.some(
                        (user) => user.userId === currUser.id,
                      ) ? (
                        <ActionIcon
                          className="absolute top-0 right-0 m-2 hover:cursor-pointer"
                          onClick={() => handleBookmarkClick(post.id)}
                          variant="transparent"
                        >
                          {/* <div className="bg-red-500"> */}
                          <BookmarkFilledIcon />
                          {/* </div> */}
                        </ActionIcon>
                      ) : (
                        <ActionIcon
                          className="absolute top-0 right-0 m-2 hover:cursor-pointer"
                          onClick={() => handleBookmarkClick(post.id)}
                          variant="transparent"
                        >
                          <BookmarkIcon />
                        </ActionIcon>
                      )
                    ) : null}
                    <div
                      className=" flex-grow font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2 hover:cursor-pointer hover:text-blue-300 hover:underline"
                      onClick={() => {
                        navigate(`/item/${post.id}`);
                      }}
                    >
                      {post.title}
                    </div>
                    <div className="  items-center text-gray-700 bg-orange-300 rounded-full justify-center flex p-2">
                      ${Number(post.price).toLocaleString('en-US')}
                    </div>
                  </div>
                  <p className="text-gray-700 text-base flex justify-center mt-2 bg-orange-300 p-2 rounded-lg">
                    {post.desc}
                  </p>
                  {/* <div className="flex"> */}
                    <div
                      className="flex flex-col bg-orange-300 mt-3 p-4 rounded-lg justify-center items-center hover:underline hover:cursor-pointer hover:bg-orange-500"
                      onClick={() => {
                        navigate(`/profile/${post.user.id}`);
                      }}
                    >
                      {/* <div className="">{post.user.email}</div> */}
                      <div className="flex items-center space-x-3 w-full justify-center relative">
                        <div className="relative flex space-x-2 items-center">
                          <span>
                            <Avatar
                              size="lg"
                              src={
                                post.user.profilePictureFile
                                  ? `${
                                      import.meta.env.VITE_APP_EXPRESS_BASE_URL
                                    }/${post.user.profilePictureFile}`
                                  : null
                              }
                            />
                          </span>

                          {/* <div
                          className={`absolute bottom-0 right-0 rounded-full px-2 ${
                            status ? 'bg-green-500' : 'bg-gray-300'
                          } border-2 border-white text-gray text-xs`}
                        >
                          *
                        </div> */}
                          <span>{post.user.name}</span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="">
                      <ActionIcon
                        size="lg"
                        color="orange"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleMessageClick
                        }}
                        // loading={messageLoading}
                      >
                        <MessagesIcon />
                      </ActionIcon>
                    </div> */}
                  {/* </div> */}
                </div>
              </div>
            ))
          ) : (
            <div className="">
              <h1 className="text-2xl text-white">No posts available</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
