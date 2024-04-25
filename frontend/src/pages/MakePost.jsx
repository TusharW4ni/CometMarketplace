import Navbar from '../components/Navbar';
import { Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import FormData from 'form-data';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MakePost() {
  const [currUser, setCurrUser] = useState(null);
  const { user } = useAuth0();
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [price, setPrice] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    desc: '',
  });
  const [isPosted, setIsPosted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
        { email: user.email },
      );
      setCurrUser(response.data);
      setFormData({ ...formData, userId: response.data.id });
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('this is the MakePost formData', formData);
  }, [formData]);

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);

    // Create URLs representing the files
    const urls = uploadedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const handlePriceChange = (event) => {
    // Remove all non-digit characters
    let rawValue = event.target.value.replace(/\D/g, '');

    if (rawValue !== '' ? rawValue > 100000 : false) {
      toast.error('Price cannot exceed $100,000', {
        position: 'top-center',
      });
      rawValue = '100000';
    }

    setFormData({ ...formData, price: rawValue });

    // Convert to a number and format with commas
    const formattedValue =
      rawValue !== '' ? Number(rawValue).toLocaleString('en-US') : '';

    setPrice(formattedValue);
  };

  const handleSubmit = async () => {
    if (formData.title === '' || formData.price === 0 || formData.desc === '') {
      toast.error('Please fill out all fields', {
        position: 'top-center',
      });
      return;
    }
    let newPostId;
    try {
      const res1 = await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/user/new-post`,
        formData,
      );
      newPostId = res1.data.postId;
    } catch (error) {
      console.error(error);
    }

    let formDataObj = new FormData();
    files.forEach((file) => {
      formDataObj.append('files', file);
    });
    console.log('this is the fileDataObj from handleSumbit', formDataObj);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_APP_EXPRESS_BASE_URL
        }/api/user/add-images-to-new-post`,
        formDataObj,
        {
          params: {
            userId: currUser.id,
            postId: newPostId,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setIsPosted(true);
      setTimeout(() => {
        setIsPosted(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      {isPosted && (
        <div className="mt-16 text-center py-4 lg:px-4">
          <div
            className="p-2 bg-orange-500 items-center text-black leading-none lg:rounded-full flex lg:inline-flex"
            role="alert"
          >
            <span className="flex rounded-full bg-orange-200 uppercase px-2 py-1 text-xs font-bold mr-3">
              Done
            </span>
            <span className="font-semibold mr-2 text-left flex-auto">
              Your post has been created
            </span>
          </div>
        </div>
      )}
      <div className="mt-16 flex flex-col items-center">
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-white mt-5">Item for Sale</h1>
          <div className="flex space-x-40">
            <div>
              <Button component="label" htmlFor="fileUpload">
                Upload Photos
              </Button>
              <input
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
              />
              <div className="mt-5 grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt="Preview" width={100} height={100} />
                    <button
                      className="absolute top-0 right-0 bg-gray-500 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => removeImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="title" className="text-white">
                Title
              </label>
              <input
                type="text"
                className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <label htmlFor="price" className="text-white">
                Price
              </label>

              <input
                type="text"
                value={`$ ${price}`}
                onChange={handlePriceChange}
                className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <label htmlFor="description" className="text-white">
                Description
              </label>
              <textarea
                className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
              <Button color="orange" onClick={handleSubmit}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
