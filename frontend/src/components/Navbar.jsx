import logo from '../assets/cmlogo.png';
import MessagesIcon from '../assets/icons/MessagesIcon';
import SellIcon from '../assets/icons/SellIcon';
import ShoppingCartIcon from '../assets/icons/ShoppingCartIcon';
import { ActionIcon, Input, Avatar, Tooltip } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  return (
    <div className="flex p-2 bg-emerald-700 justify-between items-center">
      {/* Logo */}
      <Tooltip label="Home" position="bottom" openDelay={700}>
        <img
          src={logo}
          style={{ width: 45, borderRadius: '10%' }}
          alt={'CometMarketplace Logo'}
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
      {/* Shopping Cart Button (Sahaj)*/}
      <Tooltip label="Cart" position="bottom" openDelay={700}>
        <ActionIcon
          variant="filled"
          size="xl"
          color="orange"
          onClick={() => navigate('/cart')}
        >
          <ShoppingCartIcon />
        </ActionIcon>
      </Tooltip>
      {/* Profile Button */}
      <Tooltip label="Profile" position="bottom" openDelay={700}>
        <Avatar
          radius="xl"
          onClick={() => navigate('/profile')}
          className="hover:cursor-pointer mr-2"
          src={user && user.picture}
        />
      </Tooltip>
    </div>
  );
}
