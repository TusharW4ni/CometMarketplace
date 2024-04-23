import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function MyPosts() {
  const { user } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [currUser, setCurrUser] = useState({});
  const [userID, setUserID] = useState('');
  const [postID, setPostID] = useState('');
  const [UandP, setUnP] = useState({
    userid: '',
    postid: '',
  });

  // const edit_post = async (html_image) => {
  //   const id = html_image.getElementAttribute('id')

  //   const userRes = await axios.post(
  //     `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/edit-post/${id}`,
  //     { email: user.email },
  //   );
  // }

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

        console.log(postsRes.data);
        setUserID(userRes.data.id);
        setPosts(postsRes.data.posts);
      } catch (error) {
        console.log('error in getUser', error);
      }
    };
    getUserAndPosts();
  }, []);

  const handleRemove = async (index) => {
    console.log('uid: ', userID, 'pid:', index);
    setPostID(index);

    setUnP({ userid: userID, postid: index });
    try {
      console.log('uid: ', userID, 'pid:', index);
      const removePostResponse = await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/remove-post/`,
        { userId: userID, postId: index },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 p-5 gap-10">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded shadow-lg p-6 bg-orange-200 flex"
            >
              <Carousel withIndicators loop style={{ height: 250, width: 250 }}>
                {post.photos.map((photo) => (
                  <Carousel.Slide
                    key={photo}
                    //style={{height:250, width:250}}
                    //style={{height:250, width:250}}
                  >
                    <Image
                      id={`${post.id}`}
                      src={`${
                        import.meta.env.VITE_APP_EXPRESS_BASE_URL
                      }/${photo}`}
                      alt={post.title}
                      style={{ height: 250, width: 250 }}
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
              <div className="px-6 py-0">
                <div className=" font-bold p-1 justify-left flex text-xl mb-2">
                  {post.title}
                </div>

                <div className="text-black-700 p-1  justify-left flex text-base text-xl">
                  ${Number(post.price).toLocaleString('en-US')}
                </div>

                <p className="text-gray-800 text-base flex justify-left mt-2 p-1">
                  {post.desc}
                </p>

                <div
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <a href={`http://localhost:5173/edit-post/${post.id}`}>
                    <button
                      style={{
                        width: 75,
                        backgroundColor: 'darkorange',
                        height: 30,
                        borderRadius: 5,
                        marginTop: 100,
                      }}
                    >
                      Edit
                    </button>
                  </a>

                  <a
                    onClick={() => handleRemove(post.id)}
                    href={`http://localhost:5173/my-posts`}
                  >
                    <button
                      style={{
                        width: 75,
                        backgroundColor: 'darkorange',
                        height: 30,
                        borderRadius: 5,
                        marginHorizontal: 6,
                        marginTop: 100,
                        marginLeft: 10,
                      }}
                    >
                      Remove
                    </button>
                  </a>
                </div>
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

//onClick={handleSubmit}
/*

*/
