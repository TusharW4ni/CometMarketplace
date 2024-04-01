import React, { useState } from 'react'; 
import Navbar from '../components/Navbar';
import { Button, TextInput } from '@mantine/core'; 
import { useAuth0 } from '@auth0/auth0-react';

export default function Profile() {
  const { logout } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  function Modal({ onClose }) {
    const [rating, setRating] = useState(''); 

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Rating submitted:', rating); 
      onClose(); 
    };

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
            <TextInput
              value={rating}
              onChange={(e) => setRating(e.currentTarget.value)}
              placeholder="Enter any additional commentary"
              style={{ marginBottom: '10px' }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex bg-green-800 justify-end p-3">
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
      {isModalOpen && <Modal onClose={closeModal} />}

      Profile
    </div>
  );
}
