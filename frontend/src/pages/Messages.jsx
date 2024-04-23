import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@mantine/core';
import PropTypes from 'prop-types';
import SendIcon from '../assets/icons/SendIcon';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

Messages.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
  }),
};
export default function Messages({ socket, localUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on('chat message', (data) => {
      setMessages((list) => [...list, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (message !== '' && socket) {
      const messageWithName = {
        text: message,
        name: localUser && localUser.name,
        time: new Date()
          .toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
          .toUpperCase(),
      };
      console.log('messageWithName', messageWithName);
      await socket.emit('chat message', messageWithName);
      setMessages((messages) => [...messages, messageWithName]);
      setMessage('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-1/2 p-16 h-screen justify-center items-center">
        <div className="relative bg-white w-1/2 h-3/4 rounded-t-lg overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 m-3 ${
                localUser.name === msg.name ? `bg-blue-300` : 'bg-gray-300'
              } rounded-lg`}
              ref={messagesEndRef}
            >
              {/* {msg.name}: {msg.text}
              <span className="text-sm text-gray-500 flex justify-end">
                {msg.time}
              </span> */}
              <div className="flex justify-between items-center">
                <span className="overflow-auto">
                  {msg.name}: {msg.text}
                </span>
                <span className="text-sm text-gray-500 w-1/4 flex justify-end">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className=" w-1/2 bottom-0 p-5 bg-gray-500 rounded-b-lg">
          <form>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 rounded-lg hover:border-2 hover:border-orange-300 focus:outline-none focus:border-2 focus:border-orange-500"
              />
              <Button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="rounded-lg"
                rightSection={<SendIcon />}
                color="orange"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
