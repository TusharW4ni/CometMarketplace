import logo from '../assets/cmlogo.png';
import ShoppingCartIcon from '../assets/icons/ShoppingCartIcon';
import MessagesIcon from '../assets/icons/MessagesIcon';
import SellIcon from '../assets/icons/SellIcon';
import { ActionIcon, Input, Avatar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="flex bg-emerald-700 justify-between items-center">
      <img
        src={logo}
        width={50}
        height={50}
        alt={'CometMarketplace Logo'}
        onClick={() => navigate('/')}
        className="hover:cursor-pointer"
      />
      <ActionIcon
        variant="filled"
        size="xl"
        color="orange"
        onClick={() => navigate('/new-post')}
      >
        <SellIcon />
      </ActionIcon>
      <div className="w-1/2">
        <Input size="md" placeholder="Search" />
      </div>
      <ActionIcon
        variant="filled"
        size="xl"
        color="orange"
        onClick={() => navigate('/messages')}
      >
        <MessagesIcon />
      </ActionIcon>
      {/* <ActionIcon
        variant="filled"
        size="xl"
        color="orange"
      >
        <ShoppingCartIcon />
      </ActionIcon> */}
      <Avatar
        radius="xl"
        onClick={() => navigate('/profile')}
        className="hover:cursor-pointer"
      />
    </div>
  );
}
