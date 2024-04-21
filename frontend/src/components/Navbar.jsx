import logo from '../assets/cmlogo.png';
import MessagesIcon from '../assets/icons/MessagesIcon';
import SellIcon from '../assets/icons/SellIcon';
import { ActionIcon, TextInput, Avatar, Tooltip } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchIcon from '../assets/icons/SearchIcon';

import { useContext } from 'react';
import { SearchContext } from '../SearchContext';

export default function Navbar({ refresh }) {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
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
  }, [user, refresh]);

  return (
    <div className="flex fixed top-0 z-50 w-full p-2 bg-emerald-700 justify-between items-center ">
      {/* Logo */}
      <div className="w-1/12">
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
      </div>
      {/* Make a post button */}
      <div className="w-1/12">
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
      </div>
      {/* Search Bar */}
      <div className="w-6/12 flex items-center">
        <form
          className="flex-grow"
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/search');
          }}
        >
          <input
            className="rounded-md p-2 w-full hover:border-2 hover:border-orange-300 focus:outline-none focus:border-2 focus:border-orange-500"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <ActionIcon
          type="submit"
          size="lg"
          className="ml-2"
          color="orange"
          onClick={() => navigate('/search')}
        >
          <SearchIcon />
        </ActionIcon>
      </div>
      {/* Messages Button */}
      <div className="w-1/12 ml-20">
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
      </div>
      {/* Profile Button */}
      <div className="">
        <Tooltip label="Profile" position="bottom" openDelay={700}>
          <Avatar
            radius="xl"
            onClick={() => navigate('/profile')}
            className="hover:cursor-pointer mr-2"
            src={profilePicUrl ? profilePicUrl : user.picture}
          />
        </Tooltip>
      </div>
    </div>
  );
}
