import logo from '../assets/cmlogo.png';
import MessagesIcon from '../assets/icons/MessagesIcon';
import SellIcon from '../assets/icons/SellIcon';
import { ActionIcon, Input, Avatar, Tooltip } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        // setProfilePicUrl(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${response.data.profilePicture}`);
        response.data.profilePicture.includes('gravatar')
          ? setProfilePicUrl(response.data.profilePicture)
          : setProfilePicUrl(
              `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${
                response.data.profilePictureFile
              }`,
            );
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  return (
    <div className="flex fixed top-0 z-50 w-full p-2 bg-emerald-700 justify-between items-center">
      {/* Logo */}
      <Tooltip label="Home" position="bottom" openDelay={700}>
        <img
          src={logo}
          style={{ width: 45, borderRadius: '10%' }}
          alt="CometMarketplace Logo"
          onClick={() => navigate('/')}
          className="hover:cursor-pointer"
          draggable="false"
        />
      </Tooltip>
      {/* Make a post button */}
      <Tooltip label="Make a post" position="bottom" openDelay={700}>
        <ActionIcon
          variant="filled"
          size="xl"
          color="orange"
          onClick={() => navigate('/make-post')}
        >
          <SellIcon />
        </ActionIcon>
      </Tooltip>
      {/* Search Bar */}
      <div className="w-1/2">
        <Input size="md" placeholder="Search" />
      </div>
      {/* Messages Button */}
      <Tooltip label="Messages" position="bottom" openDelay={700}>
        <ActionIcon
          variant="filled"
          size="xl"
          color="orange"
          onClick={() => navigate('/messages')}
        >
          <MessagesIcon />
        </ActionIcon>
      </Tooltip>
      {/* Profile Button */}
      <Tooltip label="Profile" position="bottom" openDelay={700}>
        <Avatar
          radius="xl"
          onClick={() => navigate('/profile')}
          className="hover:cursor-pointer mr-2"
          src={profilePicUrl ? profilePicUrl : user.picture}
        />
      </Tooltip>
    </div>
  );
}
