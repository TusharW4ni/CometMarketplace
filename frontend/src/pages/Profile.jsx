import { Button, TextInput, Select, Textarea } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Profile() {
  const { logout, user } = useAuth0();
  const [currUser, setCurrUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    pronouns: '',
    bio: '',
  });

  useEffect(() => {
    //fetches the data of the user form dbs
    const fetchUserProfile = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        setCurrUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    
    if (editProfile) {
      fetchUserProfile();
    }
  }, [editProfile, user.email]); // refetch if the Profile information/user is changed.

  useEffect(() => {
    // This useEffect listens for changes in currUser and updates the profile state accordingly
    if (currUser && editProfile) {
      setProfile({
        displayName: currUser.name || '',
        username: currUser.username || '',
        pronouns: currUser.pronouns || '',
        bio: currUser.bio || '',
      });
    }
  }, [currUser, editProfile, profilePicUrl]);

  useEffect(() => {
    // Initialize profilePicUrl when currUser changes and has a profile picture.
    if (currUser && currUser.profilePicture) {
      const newProfilePicUrl = `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${currUser.profilePicture}`;
      setProfilePicUrl(newProfilePicUrl);
    }
  }, [currUser]); // This hook solely focuses on updating the profilePicUrl state.
  

  // When clicked save this gets triggered and saves the updates information to the db
  const handleSave = async (event) => {
    // console.log("Profile: ", profile);
    // console.log("currUser: ", currUser);
    event.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/update-profile/${currUser.id}`,
        profile,
      );
      alert('Profile successfully updated!');
      //setEditProfile(false);
    } catch (error) {
      console.log("Response: ", error.response);
      if (error.response && error.response.status === 409) {
        alert('Username already exists. Please choose a different username.');
      } else {
        // console.error('Failed to update profile:', error);
        alert('Failed to update profile.');
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleUploadButtonClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  //When a picture is uploded then it stores the image in db.
  const handleFileChange = async (event) => {
    if (event.target.files.length === 1) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/upload-profile-picture/${currUser.id}`,
                formData
            );
            setCurrUser(response.data);
            setEditProfile(false);
            alert('Profile picture updated successfully!');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
        } catch (error) {
            // console.error('Failed to upload profile picture:', error);
            alert('Failed to upload profile picture.');
        }
    } else {
        alert('Please select only one file.');
    }
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
        <div className="my-5">
          <Button onClick={() => setEditProfile(true)}>
            Edit Profile
          </Button>
          {editProfile && (
            <div className="flex flex-col items-center space-y-4">
              {currUser && currUser.profilePicture && (
                <img 
                  src={profilePicUrl}
                  alt="Profile preview" 
                  className="w-24 h-24 rounded-full object-cover mt-2"
                />
              )}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
              <Button onClick={handleUploadButtonClick}>Upload Picture</Button>
              <TextInput
                placeholder="Name"
                name="displayName"
                value={profile.displayName}
                onChange={(e) =>
                  setProfile({...profile, displayName: e.target.value})
                }
                size="md"
                className="w-3/4 max-w-xs"
              />
              <TextInput
                placeholder="Username"
                name="username"
                value={profile.username}
                onChange={(e) =>
                  setProfile({...profile, username: e.target.value})
                }
                size="md"
                className="w-3/4 max-w-xs"
              />  
              <Select
                placeholder="Select pronouns"
                name="pronouns"
                value={profile.pronouns}
                onChange={(value) => setProfile({...profile, pronouns: value})}
                data={[
                  { value: 'he/him', label: 'He/Him' },
                  { value: 'she/her', label: 'She/Her' },
                  { value: 'they/them', label: 'They/Them' },
                  { value: 'other', label: 'Other' },
                ]}
                size="md"
                className="w-3/4 max-w-xs"
              />
              <Textarea
                placeholder="Bio (Limit: 116 Characters)"
                name="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                autosize // Adjusts the height dynamically based on content
                minRows={1} // Minimum number of rows to show
                maxLength={116} // Maximum characters allowed
                style={{ fontFamily: 'monospace' }}
                className="w-3/4 max-w-xs"
              />   
              <Button onClick={handleSave}>Save</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
