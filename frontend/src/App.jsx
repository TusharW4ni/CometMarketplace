import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import MakePost from './pages/MakePost';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './pages/Login';
import LoginRedirect from './pages/LoginRedirect';
import ItemPage from './pages/ItemPage';
import PublicProfile from './pages/PublicProfile'; 

import { io } from 'socket.io-client';

export default function App() {
  const { isAuthenticated } = useAuth0();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    console.log('Creating socket connection...');
    const socket = io(`${import.meta.env.VITE_APP_SOCKET_BASE_URL}`);
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);
  if (isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-redirect" element={<LoginRedirect />} />
          <Route path="/make-post" element={<MakePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages socket={socket}/>} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/public-profile/:id" element={<PublicProfile />} />


        </Routes>
      </BrowserRouter>
    );
  } else {
    return <Login />;
  }
}

