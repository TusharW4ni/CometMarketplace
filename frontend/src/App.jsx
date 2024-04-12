import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MakePost from './pages/MakePost';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './pages/Login';
import LoginRedirect from './pages/LoginRedirect';
import ItemPage from './pages/ItemPage';
import { io } from 'socket.io-client';

// console.log('Creating socket connection...'); // Add this line
// const socket = io(`${import.meta.env.VITE_APP_SOCKET_BASE_URL}`);

export default function App() {
  const { isAuthenticated } = useAuth0();
  if (isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-redirect" element={<LoginRedirect />} />
          <Route path="/make-post" element={<MakePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/item/:id" element={<ItemPage />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return <Login />;
  }
}
