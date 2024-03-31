import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

export default function Home() {
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
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/get-posts/${
            userRes.data.id
          }`,
        );
        // const postsRes = await axios.get(
        //   `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getAllPosts`,
        // );
        console.log(postsRes.data)
        setPosts(postsRes.data.posts);
      } catch (error) {
        console.log('error in getUser', error);
      }
    };
    getUserAndPosts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.length > 0 ? (
          posts.map((post) => (
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
                <div className="font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2">
                  {post.title}
                </div>
                <div className="text-gray-700 bg-orange-300 p-1 rounded-full justify-center flex text-base">
                  ${Number(post.price).toLocaleString('en-US')}
                </div>
                <p className="text-gray-700 text-base flex justify-center mt-2">
                  {post.desc}
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
  );
}
