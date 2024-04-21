import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { SearchContext } from '../SearchContext';
import { RangeSlider, ActionIcon, Image, Checkbox, Radio } from '@mantine/core';
import axios from 'axios';
import BookmarkIcon from '../assets/icons/BookmarkIcon';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '@mantine/carousel';

export default function Search() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [priceSort, setPriceSort] = useState('asc');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log('priceRange', priceRange);
    console.log('searchTerm', searchTerm);
  }, [priceRange, searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getFilteredPosts`,
          {
            searchTerm: searchTerm,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            priceSort: priceSort,
          },
        );
        setProducts(res.data);
        console.log('products', res.data);
      } catch (error) {
        console.log('error in getting filtered posts', error);
      }
    };

    fetchProducts();
  }, [searchTerm, priceRange, priceSort]);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="pt-14 bg-emerald-700 w-1/6 h-full fixed p-3 ">
        <div className="bg-green-300 mb-10 pl-3 pr-3 pb-6 pt-2 rounded-lg">
          <div className="text-xl mb-3">Set Range</div>
          <RangeSlider
            min={0}
            max={100}
            color="orange"
            defaultValue={priceRange}
            onChange={setPriceRange}
            step={25}
            marks={[
              { value: 0, label: '0' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
              { value: 75, label: '75' },
              { value: 100, label: '100+' },
            ]}
          />
        </div>
        <div className="bg-green-300 pl-3 pr-3 pb-6 pt-2 rounded-lg">
          <div className="text-xl">Sort By</div>
          <div className="mb-1">Price</div>
          <Radio.Group value={priceSort} onChange={setPriceSort}>
            <div className="space-y-2">
              <Radio value="asc" label="Low-High" color="orange" />
              <Radio value="desc" label="High-Low" color="orange" />
            </div>
          </Radio.Group>
        </div>
      </div>
      <div className="mt-14">
        <div className="grid grid-cols-1 p-5 md:grid-cols-2 lg:grid-cols-3 gap-10 ml-80">
          {products.length > 0 ? (
            products.map((post) => (
              <div
                key={post.id}
                className="rounded overflow-hidden shadow-lg p-6 bg-orange-200"
              >
                <Carousel withIndicators>
                  {post.photos.map((photo) => (
                    <Carousel.Slide key={photo}>
                      <Image
                        src={`${
                          import.meta.env.VITE_APP_EXPRESS_BASE_URL
                        }/${photo}`}
                        alt={post.title}
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
                <div className="px-6 py-4">
                  <div className="flex space-x-5">
                    <ActionIcon
                      className="absolute top-0 right-0 m-2 hover:cursor-pointer"
                      onClick={() => handleBookmarkClick(post.id)}
                    >
                      <BookmarkIcon />
                    </ActionIcon>
                    <div
                      className=" flex-grow font-bold bg-orange-500 p-1 rounded-full justify-center flex text-xl mb-2 hover:cursor-pointer hover:text-blue-300 hover:underline"
                      onClick={() => {
                        navigate(`/item/${post.id}`);
                      }}
                    >
                      {post.title}
                    </div>
                    <div className="  items-center text-gray-700 bg-orange-300 rounded-full justify-center flex p-2">
                      ${Number(post.price).toLocaleString('en-US')}
                    </div>
                  </div>
                  <p className="text-gray-700 text-base flex justify-center mt-2 bg-orange-300 p-2 rounded-lg">
                    {post.desc}
                  </p>
                  <div
                    className="flex flex-col bg-orange-300 mt-3 p-4 rounded-lg justify-center items-center hover:underline hover:cursor-pointer hover:bg-orange-500"
                    onClick={() => {
                      navigate(`/profile/${post.user.id}`);
                    }}
                  >
                    <div className="">{post.user.email}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex mt-20">
              <h1 className="text-2xl text-white">No Result</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
