import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button, TextInput } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';
import Wishlist from '../components/Wishlist';

export default function Profile() {
  const { logout } = useAuth0();
  const [showWishlist, setShowWishlist] = useState(false);

  //Sathwik
  /*
  The provided code adds an "Edit Profile" feature to a React component,
  displaying a form with inputs for the user's display name, username, pronouns, and bio
  when a button is clicked, and allows the user to submit these changes with a "Save" button.

  It will not save the entered data to the database as of phase4.
  */
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    pronouns: '',
    bio: '',
  });

  const handleShowWishlist = () => {
    setShowWishlist(true);
  };

  const handleEditProfile = () => {
    setEditProfile(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log('Profile Info:', profile);
    // Here we would typically handle the saving to a database.
    alert('Profile successfully updated!');
    setEditProfile(false);
  };

  return (
    <div>
      <Navbar />
      <div className="flex bg-green-800 justify-end p-3">
        <Button color="red" onClick={() => logout()}>
          Logout
        </Button>
      </div>

      <div className="container mx-auto mt-5">
        <Button onClick={handleShowWishlist}>
          Show Wishlist
        </Button>
        {showWishlist && <Wishlist />}

        <div className="my-5">
          <Button onClick={handleEditProfile}>
            Edit Profile
          </Button>
          {editProfile && (
            <div className="space-y-4">
              <TextInput
                placeholder="Display Name"
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
              />
              <TextInput
                placeholder="Username"
                name="username"
                value={profile.username}
                onChange={handleChange}
              />
              <TextInput
                placeholder="Pronouns"
                name="pronouns"
                value={profile.pronouns}
                onChange={handleChange}
              />
              <TextInput
                placeholder="Bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
