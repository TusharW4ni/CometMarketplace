import Navbar from '../components/Navbar';
import { FileButton, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { Avatar } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';
import FormData from 'form-data';
import axios from 'axios';

export default function MakePost() {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [price, setPrice] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    description: '',
  })

  useEffect(() => {
    console.log("formData", formData);
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
    const rawValue = event.target.value.replace(/\D/g, '');
    setFormData({ ...formData, price: rawValue });

    // Convert to a number and format with commas
    const formattedValue = Number(rawValue).toLocaleString('en-US');

    setPrice(formattedValue);
  };

  const handleSubmit = async () => {
    let photos = new FormData();
    files.forEach((file) => {
      photos.append('photos', file);
    });
    const response = await axios.post('/api/user/new-post', {
      title: formData.title,
      price: formData.price,
      description: formData.description,
      photos,
    });
    console.log(response);
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center">
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-white">Item for Sale</h1>
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <label htmlFor="price" className="text-white">
                Price
              </label>
              <input
                type="text"
                value={`$${price}`}
                onChange={handlePriceChange}
                className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <label htmlFor="description" className="text-white">
                Description
              </label>
              <textarea className="w-96 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500" onChange={
                (e) => setFormData({ ...formData, description: e.target.value })
              }/>
              <Button color="orange" onClick={handleSubmit}>Post</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
