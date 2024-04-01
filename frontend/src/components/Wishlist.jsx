//Created by Sushant Nepal

import React, { useState } from 'react';

// Wishlist component
const Wishlist = () => {
  // State to manage wishlist items
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'Item 1', price: '$10.00' },
    { id: 2, name: 'Item 2', price: '$20.00' },
    { id: 3, name: 'Item 3', price: '$30.00' },
  ]);

  // Function to remove item from wishlist
  const removeFromWishlist = (itemId) => {
    setWishlistItems(prevItems =>
      prevItems.filter(item => item.id !== itemId)
    );
  };

  // Render wishlist
  return (
    <div>
      <h1>Wishlist</h1>
      <ul>
        {wishlistItems.map((item) => (
          <li key={item.id}>
            {/* Display item name and price */}
            {item.name} - {item.price}
            {/* Button to remove item from wishlist */}
            <button
              style={{
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '5px 10px', // Adjust padding to make it smaller
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px', // Adjust font size to make it smaller
                marginLeft: '10px', // Add space between button and item
                minWidth: '0', // Allow button to shrink to smaller size
              }}
              onClick={() => removeFromWishlist(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
