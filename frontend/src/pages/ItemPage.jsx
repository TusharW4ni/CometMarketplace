import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Carousel } from '@mantine/carousel';
import { Image, Avatar } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

function ItemPage() {
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const { user } = useAuth0();
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/post/${id}`,
        );
        setItem(res.data);
        setName(res.data.user.name);
        setPronouns(res.data.user.pronouns);
        setProfilePicture(
          res.data.user.profilePicture
            ? `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${
                res.data.user.profilePicture
              }`
            : user.picture,
        );
        console.log('item', res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItemDetails();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center m-44 space-x-20">
        <div className="">
          <Carousel withIndicators>
            {Array.isArray(item?.photos) &&
              item.photos.map((photo) => (
                <Carousel.Slide key={photo}>
                  <Image
                    src={`${
                      import.meta.env.VITE_APP_EXPRESS_BASE_URL
                    }/${photo}`}
                    alt={item.title}
                  />
                </Carousel.Slide>
              ))}
          </Carousel>
        </div>
        <div className="">
          <div className="flex p-10 bg-orange-200 rounded-lg shadow-lg ">
            <div className="flex flex-col">
              <div className="flex">
                <h1 className="text-4xl font-mono font-bold underline text-center">
                  {item.title}
                </h1>
                <div className="text-2xl  items-center mt-2 ml-4">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.price)}
                </div>
              </div>

              <div className="flex bg-orange-300 mt-3 p-4 rounded-lg justify-center items-center">
                <div className="flex text-2xl">{item.desc}</div>
              </div>

              <div className="flex flex-col bg-orange-300 mt-3 p-4 rounded-lg justify-center items-center hover:underline hover:cursor-pointer hover:bg-orange-500">
                <div
                  className="flex space-x-5"
                  onClick={() => {
                    navigate(`/profile/${item.user.id}`);
                  }}
                >
                  <Avatar size="lg" src={profilePicture && profilePicture} />
                  <div>
                    <div className="text-xl">{name && name}</div>
                    <div>{pronouns && pronouns}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemPage;
