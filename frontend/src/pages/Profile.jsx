import React, { useState } from 'react'; 
import Navbar from '../components/Navbar';
import { Button, TextInput } from '@mantine/core'; 
import { useAuth0 } from '@auth0/auth0-react';

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

export default function Profile() {
  const { logout } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Rating submitted:', rating, comment);
    closeModal();
  };

  return (
    <div>
      <Navbar />
      <div className="flex bg-green-800 mt-14 justify-end p-3">
        <Button color="red" onClick={() => logout()}>
          Logout
        </Button>
      </div>
      
      <Button
        onClick={openModal}
        style={{
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          padding: '10px 22px',
          color: "white"
        }}
        color='space gray'  
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

      <div style={{ padding: '13px' }}>
      
        <h1>User Profile</h1>
      </div>
    </div>
  );
}

