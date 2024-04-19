import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, TextInput, Avatar } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

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
  const { id } = useParams();
  // const [user, setUser] = useState({
  //   rating: 0,
  //   name: '',
  //   pronouns: '',
  //   profilePictureFile: '',
  // });
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
  });
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

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
        }));
        console.log('User inside fetchUser', user);
        setPosts(res.data.posts);
        console.log('res.data', res.data);
        console.log('res.data.posts', res.data.posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser().then(() => fetchReviews().then(() => setLoading(false)));
  }, [refresh]);

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

  return (
    <div>
      <Navbar />
      <div className="flex mt-14 w-full bg-orange-200 p-3 justify-around">
        <div className="flex ">
          {user && user.rating && (
            <div className="flex items-center">
              <StarRating rating={user.rating} setRating={() => {}} />
              <div className="text-2xl ml-2">
                {user.rating.toFixed(1)} ({reviews.length} reviews)
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-5">
          <Avatar
            src={
              user &&
              `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${
                user.profilePictureFile
              }`
            }
            size="xl"
            radius="xl"
            alt={user && user.name}
          />
          <div className="text-4xl">{user && user.name}</div>
          <div className="text-2xl mt-2 font-mono">{user && user.pronouns}</div>
        </div>
      </div>
      <div className="overflow-x-auto whitespace-nowrap">
        <h1 className="text-4xl text-white p-5">All Posts</h1>
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
