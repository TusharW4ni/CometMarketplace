import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/cmlogo.png';
import './LoginRedirect.css';
import axios from 'axios';

export default function LoginRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          if (!getUser) {
            newUser()
          }
          navigate('/');
        } else {
          navigate('/login');
        }
      }
    }, 3000);
  }, [isLoading, isAuthenticated, navigate]);

  const getUser = async () => {
    let gotUser;
    try {
      gotUser = await axios.get('/api/getUser', { email: user.email });
    } catch (error) {
      console.error(error);
    }
    return gotUser ? true : false;
  };

  const newUser = async() => {
    try {
      await axios.post('/api/newUser', { email: user.email });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col space-y-10 justify-center items-center shadow-lg border-2 border-gray-200 p-4 rounded-lg">
        <img src={logo} className="logo" draggable="false" />
      </div>
    </div>
  );
}
