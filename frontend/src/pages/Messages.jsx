import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@mantine/core';
import PropTypes from 'prop-types';

Messages.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
  }),
};
export default function Messages({ socket }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        setMessages((messages) => [...messages, msg]);
      });
    }

    return () => {
      if (socket) {
        socket.off('chat message');
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <div className="flex mt-14 h-screen">
      <Navbar />
      <div className="w-64 fixed h-full bg-green-500 p-4 overflow-auto"></div>
    </div>
  );
}
