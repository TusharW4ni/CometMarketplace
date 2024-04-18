import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, TextInput } from '@mantine/core';

const StarRating = ({ rating, setRating }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} onClick={() => setRating(index)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
          {rating >= index ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

function Modal({ onClose, rating, setRating, comment, setComment, handleSubmit }) {
  return (
    <div style={{
      position: 'fixed',
      zIndex: 1,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fefefe',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%',
        borderRadius: '5px'
      }}>
        <span style={{
          color: '#aaa',
          float: 'right',
          fontSize: '28px',
          fontWeight: 'bold',
        }} onClick={onClose}>&times;</span>
        <h2>Rate the Seller</h2>
        <form onSubmit={handleSubmit}>
          <StarRating rating={rating} setRating={setRating} />
          <TextInput
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
            placeholder="Enter any additional commentary"
            style={{ marginBottom: '10px' }}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUserById/${id}`);
        setUser(userRes.data);
        const postsRes = await axios.get(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/get-posts/${id}`);
        setPosts(postsRes.data.posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndPosts();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Rating submitted:', rating, comment);
    closeModal();
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <div style={{ margin: '20px', padding: '40px', fontSize: '24px', textAlign: 'center' }}>
        <h1>{user.email}</h1>
      </div>

      <div style={{ margin: '20px', padding: '30px' }}>
        <h2>USER POSTS</h2>
        {posts.map(post => (
          <div key={post.id} style={{ marginBottom: '20px' }}>
            <strong>{post.title}</strong> - {post.desc}
            <div style={{ display: 'flex', overflowX: 'auto', padding: '10px', gap: '10px' }}>
              {post.photos && post.photos.map(photo => (
                <img key={photo} src={`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${photo}`} alt={post.title} style={{ maxWidth: '150px', height: 'auto' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={openModal}
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          padding: '10px 22px',
          color: "white",
          backgroundColor: 'gray'
        }}
      >
        RATE SELLER
      </Button>
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          handleSubmit={handleSubmit}
        />
      )}

      <div style={{ margin: '20px', padding: '30px' }}>
        <h2>USER FEEDBACK</h2>
        <p>Feedback for the user will be displayed here.</p>
      </div>
    </div>
  );
}