//Keejun
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

function ItemPage() {
  const [item, setItem] = useState({
    title: '',
    price: '',
    description: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchItemDetails = async () => {
      setIsLoading(true);
      console.log(id);
      try {
        console.log(`${import.meta.env.VITE_APP_BACKEND_URL}/api/item/${id}`);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/item/${id}`,
        );

        // showing data
        console.log('Actual response.data : ', response.data);

        setItem(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching item details', error);
        setError('Failed to fetch item details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center">
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <div className="flex flex-col h-screen">
          <Carousel withIndicators loop>
            {item.photo.map((pho) => (
              <Carousel.Slide key={pho}>
                <Image
                  src={`${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/${pho}`}
                  alt={item.title}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
          <div
            className="mt-auto p-5 shadow-lg rounded-lg bg-white"
            style={{ marginBottom: '6rem' }}
          >
            <h3 className="text-xl leading-6 font-medium text-gray-900">
              Title: {item.title}
            </h3>
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-500">Price:</div>
              <span className="text-sm text-gray-900">{item.price}</span>
            </div>
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-500">Contact:</div>
              <span className="text-sm text-gray-900">{item.email}</span>
            </div>
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-500">
                Description:
              </div>
              <p className="mt-1 text-sm text-gray-700">{item.description}</p>
            </div>
            <div className="mt-2 mb-4">
              <div className="text-sm font-medium text-gray-500">Rating:</div>
              <span className="text-sm text-gray-900"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemPage;
