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
      <div className="w-64 fixed h-full bg-green-500 p-4 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-blue-200 rounded-lg mb-2">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex ml-64 flex-col justify-between p-4 flex-grow">
        <div className="overflow-auto">
          <div className="p-2 bg-blue-200 rounded-lg mb-2">Hello</div>
          <div className="p-2 bg-blue-200 rounded-lg mb-2">How are you?</div>
          <div className="p-2 bg-green-200 rounded-lg mb-2">
            Im good, thanks!
          </div>
        </div>
        <div className="h-12 bg-gray-200 p-8 flex items-center fixed bottom-0 mb-5 w-1/2 ml-52 rounded-lg">
          <input
            type="text"
            className="flex-grow rounded-lg p-2 mr-2"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
