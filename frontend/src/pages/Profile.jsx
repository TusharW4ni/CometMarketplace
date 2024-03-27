import Navbar from '../components/Navbar';
import { Button } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';

export default function Profile() {
  const { logout } = useAuth0();
  return (
    <div>
      <Navbar />
      <div className="flex bg-green-800 justify-end p-3">
        <Button color="red" onClick={() => logout()}>
          Logout
        </Button>
      </div>
      Profile
    </div>
  );
}
