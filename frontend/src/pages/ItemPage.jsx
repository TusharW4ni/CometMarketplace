import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Carousel } from '@mantine/carousel';
import {
  Image,
  Avatar,
  ActionIcon,
  Tooltip,
  Modal,
  Select,
  Textarea,
  Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import ReportPostIcon from '../assets/icons/ReportPostIcon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Report({ item, profilePicture }) {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure();
  const { user } = useAuth0();
  // console.log('item', item);
  const [formData, setFormData] = useState({
    userId: '',
    postId: item.id,
    reportType: '',
    reportDescription: '',
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRes = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        setFormData({ ...formData, userId: userRes.data.id });
      } catch (error) {
        console.log('error in getUser', error);
      }
    };
    if (user) {
      getUser();
    }
  }, [opened]);

  useEffect(() => {
    console.log('formData', formData);
  }, [formData]);

  const createReport = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/report/createReport`,
        formData,
      );
      toast.success(
        'Report submitted successfully! We will look into this ASAP.', {
          position: 'top-center',
        }
      );
      console.log('res', res.data);
      close();
    } catch (error) {
      console.log('error in createReport', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed bottom-0 right-0 m-10 z-10">
        <Tooltip label="Report Item">
          <ActionIcon size="xl" color="red" onClick={open}>
            <ReportPostIcon />
          </ActionIcon>
        </Tooltip>
      </div>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setFormData({
            userId: '',
            postId: item.id,
            reportType: '',
            reportDescription: '',
          });
        }}
        centered
        size="xl"
        title="Report Item"
      >
        <div className="flex space-x-10">
          <div className="rounded overflow-hidden shadow-lg p-6 bg-orange-200 w-3/5">
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
            <div className="px-6 py-4">
              <div className="flex space-x-5">
                <div
                  className=" flex-grow font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2 hover:cursor-pointer hover:text-blue-300 hover:underline"
                  onClick={() => {
                    navigate(`/item/${item.id}`);
                  }}
                >
                  {item.title}
                </div>
                <div className="  items-center text-gray-700 bg-orange-300 rounded-full justify-center flex p-2">
                  ${Number(item.price).toLocaleString('en-US')}
                </div>
              </div>
              <p className="text-gray-700 text-base flex justify-center mt-2 bg-orange-300 p-2 rounded-lg">
                {item.desc}
              </p>
              <div
                className="flex flex-col bg-orange-300 mt-3 p-4 rounded-lg justify-center items-center hover:underline hover:cursor-pointer hover:bg-orange-500"
                onClick={() => {
                  navigate(`/profile/${item.user.id}`);
                }}
              >
                <div className="flex items-center space-x-3">
                  <span>
                    <Avatar size="lg" src={profilePicture && profilePicture} />
                  </span>
                  <span>{item.user && item.user.email}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createReport();
                // setConfirmation(true);
              }}
            >
              {/* <TextInput
                label="Enter URL of the content you want to report"
                value={formData.postId}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value });
                }}
                required
              /> */}
              {/* <div className="mt-4"> */}
              <Select
                label="Select report type"
                data={['Spam', 'Suspicious', 'Fraud', 'Inappropriate']}
                value={formData.reportType}
                onChange={(value) => {
                  setFormData({ ...formData, reportType: value });
                }}
                required
              />
              {/* </div> */}
              <div className="mt-4">
                <Textarea
                  label="Description"
                  resize="vertical"
                  value={formData.reportDescription}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      reportDescription: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <Button type="submit" className="mt-10" color="orange">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function ItemPage() {
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
      <Report item={item} profilePicture={profilePicture} />
      <div className="flex items-center justify-center p-44 space-x-20">
        <div className="bg-orange-200 p-3 rounded-lg">
          <Carousel withIndicators>
            {Array.isArray(item?.photos) &&
              item.photos.map((photo) => (
                <Carousel.Slide key={photo} align="center">
                  <Image
                    src={`${
                      import.meta.env.VITE_APP_EXPRESS_BASE_URL
                    }/${photo}`}
                    alt={item.title}
                    h="100%"
                    w="80%"
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
