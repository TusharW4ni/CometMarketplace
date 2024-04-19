import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Carousel } from '@mantine/carousel';
import { Image, Avatar, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import PublicProfile from './PublicProfile';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import BookmarkSlashIcon from '../assets/icons/BookmarkSlashIcon';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [currUser, setCurrUser] = useState({});
  useEffect(() => {
    const getUserAndPosts = async () => {
      try {
        const userRes = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        setCurrUser(userRes.data);
        const postsRes = await axios.get(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getAllPosts`,
        );
        console.log('postsRes.data.posts', postsRes.data);
        setPosts(postsRes.data);
      } catch (error) {
        console.log('error in getUser', error);
      }
    };
    getUserAndPosts();
  }, []);

  const handleBookmarkClick = async (postId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/addToWishList`,
        {
          userId: currUser.id,
          postId: postId,
        },
      );
      console.log('Successfully added to wishlist');
    } catch (error) {
      console.log('error in handleBookmarkClick', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-20">
        <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="rounded overflow-hidden shadow-lg p-6 bg-orange-200"
              >
                <ActionIcon
                  className="relative top-0 right-0 m-2 hover:cursor-pointer"
                  onClick={() => handleBookmarkClick(post.id)}
                >
                  <BookmarkIcon />
                </ActionIcon>
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
                  <p
                    className="flex flex-col bg-orange-300 mt-3 p-4 rounded-lg justify-center items-center hover:underline hover:cursor-pointer hover:bg-orange-500"
                    onClick={() => {
                      navigate(`/profile/${post.user.id}`);
                    }}
                  >
                    <div className="">{post.user.email}</div>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center h-screen w-screen justify-center">
              <h1 className="text-2xl text-white">No posts available</h1>
            </div>
          )}
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
