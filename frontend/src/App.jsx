import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MakePost from './pages/MakePost';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './pages/Login';
import LoginRedirect from './pages/LoginRedirect';

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
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <div>
        {/* <h1 className="text-4xl text-center mt-20">Not authenticated</h1> */}
        <Login /> 
      </div>
    );
  }
}
