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
  const [ogFormData, setOgFormData] = useState({
    title: '',
    price: 0,
    desc: '',
  });
  const [ogFiles, setOgFiles] = useState([]);
  const [showCancel, setShowCancel] = useState(false);
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
    // setOgFormData({ ...formData });
    // setOgFiles([...files]);
  }, []);

  useEffect(() => {
    if (
      formData.desc !== ogFormData.desc ||
      formData.title !== ogFormData.title ||
      formData.price !== ogFormData.price
    ) {
      setShowCancel(true);
    }
    if (JSON.stringify(files) !== JSON.stringify(ogFiles)) {
      setShowCancel(true);
    }
  }, [formData, files]);

  useEffect(() => {
    console.log('this is the MakePost formData', formData);
  }, [formData]);

  const handleCancel = () => {
    setFormData({ ...ogFormData });
    setFiles([...ogFiles]);
    setPreviewUrls([]);
    setPrice('');
    setShowCancel(false);
  };

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
      // setIsPosted(true);
      toast.success('Your post has been created', {
        position: 'top-center',
      });
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
        <div className="pt-16 text-center py-4 lg:px-4">
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
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen">
        <div className="flex justify-center text-2xl text-white uppercase font-mono fixed top-0 mt-20">
          New Post
        </div>
        <div className="flex ">
          {/* <h1 className="text-2xl font-bold text-white mt-5">Item for Sale</h1> */}
          <div className="grid grid-cols-2 place-items-center place-justify-center">
            <div className="space-y-3">
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
              <div className="grid grid-cols-3 gap-4">
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
            <div className="flex justify-center flex-col space-y-2">
              <label htmlFor="title" className="text-white">
                Title
              </label>
              <input
                type="text"
                className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                value={formData.title}
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
                value={formData.desc}
              />
              <div className="flex justify-between">
                {showCancel && <Button onClick={handleCancel}>Cancel</Button>}
                <Button color="orange" onClick={handleSubmit}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
