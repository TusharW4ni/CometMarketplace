import logo from '../assets/cmlogo.png';
import { Button } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';

export default function NotAuthorized() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col items-center space-y-10 bg-zinc-700 py-9 px-10 rounded-lg border-2 border-orange-500 ">
        <div className="border-2 border-orange-500 rounded-lg overflow-auto">
          <img
            src={logo}
            width="300"
            draggable="false"
          />
        </div>
        <div className="flex space-x-20">
          <Button color="orange" onClick={() => loginWithRedirect()}>
            Login
          </Button>
          <Button
            variant="outline"
            color="orange"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  screen_hint: 'signup',
                },
              })
            }
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
