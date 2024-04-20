import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { SearchContext } from '../SearchContext';
import { RangeSlider } from '@mantine/core';

export default function Search() {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [priceRange, setPriceRange] = useState([25, 75]);

  useEffect(() => {
    console.log('priceRange', priceRange);
  }, [priceRange]);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className=" pt-96 bg-emerald-700 w-1/6 h-full fixed p-10 ">
        <div className="text-white">Set Price Range</div>
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
    </>
  );
}
