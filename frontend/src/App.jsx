import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import MakePost from './pages/MakePost';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import { useAuth0 } from '@auth0/auth0-react';
import LoginRedirect from './pages/LoginRedirect';
import EditPost from './pages/EditPost';
import MyPosts from './pages/MyPosts';
import NotAuthorized from './pages/NotAuthorized';
import ItemPage from './pages/ItemPage';
import { io } from 'socket.io-client';
import PublicProfile from './pages/PublicProfile';
import Report from './pages/Report';
import Search from './pages/Search';
import axios from 'axios';

import { SearchContext } from './SearchContext';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user } = useAuth0();
  const [socket, setSocket] = useState(null);
  const [localUser, setLocalUser] = useState({});

  useEffect(() => {
    const newSocket = io.connect(`${import.meta.env.VITE_APP_SOCKET_BASE_URL}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        console.log('res', res.data);
        setLocalUser(res.data);
      } catch (error) {
        console.log('error in getting user', error);
      }
    };
    if (user) {
      fetchUser();
    }
  }, [user]);

  if (isAuthenticated) {
    return (
      <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/login-redirect" element={<LoginRedirect />} />
            <Route path="/make-post" element={<MakePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route
              path="/messages"
              element={<Messages socket={socket} localUser={localUser} />}
            />
            <Route path="/item/:id" element={<ItemPage />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/edit-post/:postID" element={<EditPost />} />
            <Route path="/report" element={<Report />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </BrowserRouter>
      </SearchContext.Provider>
    );
  } else {
    return <NotAuthorized />;
  }
}
