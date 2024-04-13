import { Button, TextInput, Select, Textarea } from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './Profile.css';

export default function Profile() {
  const { logout, user } = useAuth0();
  const [currUser, setCurrUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [originalProfilePic, setOriginalProfilePic] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    pronouns: '',
    bio: '',
  });

  useEffect(() => {
    if (editProfile) {
      fetchUserProfile();
    }
  }, [editProfile, user.email]);

  useEffect(() => {
    if (currUser && editProfile) {
      setProfile({
        displayName: currUser.name || '',
        username: currUser.username || '',
        pronouns: currUser.pronouns || '',
        bio: currUser.bio || '',
      });
      const profilePicture = `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${currUser.profilePicture}`;
      setProfilePicUrl(profilePicture);
      setOriginalProfilePic(profilePicture);
    }
  }, [currUser, editProfile]);

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

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (profilePicFile) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicFile);
        await axios.post(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/upload-profile-picture/${currUser.id}`,
         formData, {
          params: {
            userId: currUser.id,
          },
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProfilePicFile(null);  
        setOriginalProfilePic(profilePicUrl);
      }
      await axios.post(`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/update-profile/${currUser.id}`, profile);
      alert('Profile successfully updated!');
    } catch (error) {
      console.error("Response: ", error.response);
      alert('Failed to update profile.');
    }
  };

  const handleCancelEdit = () => {
    setProfilePicUrl(originalProfilePic);
    setProfilePicFile(null);
    setEditProfile(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfilePicUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setProfilePicFile(null);
    setProfilePicUrl(originalProfilePic);
  };

  const fileInputRef = useRef(null);

  return (
    <div>
      <Navbar />
      <div className="flex bg-green-800 justify-end p-3">
        <Button color="red" onClick={() => logout()}>Logout</Button>
      </div>
      <div className="container mx-auto mt-5">
        <div className="my-5">
          <Button onClick={() => setEditProfile(true)} className="hover-button">Edit Profile</Button>
          {editProfile && (
            <div className="flex flex-col items-center space-y-4">
              {profilePicUrl && (
                <div className="profile-pic-wrapper">
                  <img src={profilePicUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2" />
                  {profilePicFile && <div className="remove-icon" onClick={handleRemovePicture}>×</div>}
                </div>
              )}
              <Button onClick={() => fileInputRef.current.click()} className="hover-button">Upload Picture</Button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <TextInput
                placeholder="Name"
                name="displayName"
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                size="md"
                className="w-3/4 max-w-xs"
              />
              <TextInput
                placeholder="Username"
                name="username"
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
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
                autosize
                minRows={1}
                maxRows={4}
                maxLength={116}
                style={{ fontFamily: 'monospace' }}
                className="w-3/4 max-w-xs"
              />
              <div className="flex justify-center w-full">
                <Button onClick={handleCancelEdit} className="hover-button" style={{ marginRight: '8px', backgroundColor: 'gray' }}>Cancel</Button>
                <Button onClick={handleSave} className="hover-button" style={{ backgroundColor: 'green' }}>Save</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

