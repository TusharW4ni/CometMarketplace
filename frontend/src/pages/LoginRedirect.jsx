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
    const doEffect = async () => {
      if (!isLoading) {
        if (isAuthenticated) {
          if (!(await getUser())) {
            await newUser();
          }
          navigate('/');
        } else {
          navigate('/login');
        }
      }
    };
    doEffect();
  }, [isLoading]);

  const getUser = async () => {
    let gotUser;
    try {
      gotUser = await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
        { email: user.email },
      );
    } catch (error) {
      console.error(error);
    }
    return gotUser === undefined ? false : true;
  };

  const newUser = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/newUser`,
        { email: user.email },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col border-2 border-orange-500 bg-zinc-700 p-6 rounded-lg logo">
          <img src={logo} className="logo" draggable="false" />
      </div>
    </div>
  );
}
