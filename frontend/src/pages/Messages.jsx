import {useState} from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@mantine/core';

export default function Messages() {
  const [message, setMessage] = useState('');


  return (
    <div className="flex mt-14 h-screen">
      <Navbar />
      <div className="w-64 fixed h-full bg-green-500 p-4 overflow-auto">
        
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
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}