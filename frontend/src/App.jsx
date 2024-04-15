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
import Report from './pages/Report';
<<<<<<< HEAD

import { io } from 'socket.io-client';
=======
import Help from './pages/Help';
>>>>>>> 37d3a725054ca1df1ab8633a311cd91e05b9615b

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
          <Route path="/messages" element={<Messages socket={socket} />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/report" element={<Report />} />
<<<<<<< HEAD
=======
          <Route path="/help" element={<Help />} />
>>>>>>> 37d3a725054ca1df1ab8633a311cd91e05b9615b
        </Routes>
      </BrowserRouter>
    );
  } else {
    return <Login />;
  }
}
