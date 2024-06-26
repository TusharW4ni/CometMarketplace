import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, TextInput, Avatar } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const StarRating = ({ rating, setRating }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          onClick={() => setRating(index)}
          style={{ cursor: 'pointer', fontSize: '1.5rem' }}
        >
          {rating >= index ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default function PublicProfile() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { id } = useParams();
  const [localUser, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_APP_EXPRESS_BASE_URL
          }/api/user/getAllReviews/${id}`,
        );
        const avg = await axios.get(
          `${
            import.meta.env.VITE_APP_EXPRESS_BASE_URL
          }/api/user/getAverageRating/${id}`,
        );
        setReviews(res.data);
        setUser((prevUser) => ({ ...prevUser, rating: avg.data.average }));
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUserById/${id}`,
        );
        console.log('res.data', res.data);
        setUser((prevUser) => ({
          ...prevUser,
          name: res.data.name,
          pronouns: res.data.pronouns,
          profilePictureFile: res.data.profilePictureFile,
          email: res.data.email,
        }));
        console.log('User inside fetchUser', localUser);
        setPosts(res.data.posts);
        console.log('res.data', res.data);
        console.log('res.data.posts', res.data.posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser().then(() => fetchReviews().then(() => setLoading(false)));
  }, [refresh]);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_APP_EXPRESS_BASE_URL
          }/api/user/getStatus/${id}`,
        );
        console.log('status res.data', res.data);
        setStatus(res.data.status === 'ONLINE');
      } catch (error) {
        console.error(error);
      }
    };
    getStatus();
  }, []);

  const submitReview = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/addAReview`,
        {
          rating: reviewData.rating,
          comment: reviewData.comment,
          userId: id,
        },
      );
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessageClick = async () => {
    setMessageLoading(true);
    try {
      const loggedinUser = await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
        {
          email: user.email,
        },
      );
      console.log('loggedinUser', loggedinUser.data);
      const chatlist = await axios.get(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/getChatList/${
          loggedinUser.data.id
        }`,
      );
      console.log('chatlist', chatlist.data);
      const chat = chatlist.data.find(
        (chat) =>
          (chat.user1Id === parseInt(id) &&
            chat.user2Id === parseInt(loggedinUser.data.id)) ||
          (chat.user1Id === parseInt(loggedinUser.data.id) &&
            chat.user2Id === parseInt(id)),
      );
      console.log('after finding chat ');
      console.log('chat', chat);
      if (chat) {
        setMessageLoading(false);
        navigate(`/messages`);
      } else {
        console.log('in chat else block');
        const newChat = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/createChat/`,
          {
            users: [loggedinUser.data.id, id],
          },
        );
        setMessageLoading(false);
        navigate(`/messages`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex mt-14 w-full bg-orange-200 p-3 justify-around">
        <div className="flex ">
          {localUser && localUser.rating && (
            <div className="flex items-center">
              <StarRating rating={localUser.rating} setRating={() => {}} />
              <div className="text-2xl ml-2">
                {localUser.rating.toFixed(1)} ({reviews.length} reviews)
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-5">
          <div className="relative">
            <Avatar
              src={
                localUser &&
                `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${
                  localUser.profilePictureFile
                }`
              }
              size="xl"
              radius="xl"
              alt={localUser && localUser.name}
            />
            <div
              className={`absolute bottom-0 right-0 rounded-full px-2 ${
                status ? 'bg-green-500' : 'bg-gray-300'
              } border-2 border-white text-gray text-xs`}
            >
              *
            </div>
          </div>
          <div className="text-4xl">{localUser && localUser.name}</div>
          <div className="text-2xl mt-2 font-mono">
            {localUser && localUser.pronouns}
          </div>
        </div>
        {user.email === localUser.email ? null : (
          <>
            {console.log('user', user.email)}
            {console.log('localUser', localUser.email)}
            <div className="flex items-center ">
              <Button
                color="orange"
                onClick={handleMessageClick}
                loading={messageLoading}
              >
                Message
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="overflow-x-auto whitespace-nowrap">
        <h1 className="text-4xl text-white p-5">
          {localUser && localUser.name}'s Posts
        </h1>
        <div className="inline-grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="rounded overflow-hidden shadow-lg p-6 bg-orange-200 inline-block"
              >
                <Carousel withIndicators loop>
                  {post.photos.map((photo) => (
                    <Carousel.Slide key={photo}>
                      <img
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
                      className="flex-grow font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2 hover:cursor-pointer hover:text-blue-300 hover:underline"
                      onClick={() => {
                        navigate(`/item/${post.id}`);
                      }}
                    >
                      {post.title}
                    </div>
                    <div className="  items-center text-gray-700 bg-orange-300 rounded-full justify-center flex p-2">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(post.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No posts</div>
          )}
        </div>
      </div>
      <div className="flex w-full bg-orange-200 p-3">
        <form
          className="flex flex-col items-center bg-orange-400 p-5 rounded-lg shadow-lg w-1/2 h-1/2 "
          onSubmit={(e) => {
            e.preventDefault();
            if (reviewData.rating === 0) return alert('Please select a rating');
            submitReview();
            setReviewData({ rating: 0, comment: '' });
          }}
        >
          <h1 className="text-3xl">Leave a review</h1>
          <StarRating
            rating={reviewData.rating}
            setRating={(rating) =>
              setReviewData({ ...reviewData, rating: rating })
            }
          />
          <TextInput
            value={reviewData.comment}
            onChange={(e) =>
              setReviewData({ ...reviewData, comment: e.target.value })
            }
            placeholder="Leave a comment"
          />
          <Button className="mt-3" type="submit">
            Submit
          </Button>
        </form>
        <div className="flex flex-col items-center bg-orange-200  rounded-lg shadow-lg w-full">
          <h1 className="text-3xl">Reviews</h1>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex flex-col p-3 w-full">
                <div className="bg-orange-400 rounded-lg p-3">
                  <StarRating rating={review.rating} setRating={() => {}} />
                  <div>{review.comment}</div>
                </div>
              </div>
            ))
          ) : (
            <div>No reviews</div>
          )}
        </div>
      </div>
    </div>
  );
}
