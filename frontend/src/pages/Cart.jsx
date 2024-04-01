import Navbar from '../components/Navbar';
import { Button } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

/* SAHAJ BIYANI - Use-case 6: Add items to shopping cart (As seen on SE Doc) 
If the code does not work as expected, recalc the useState*/
export default function Cart() {
  const { logout } = useAuth0();
  const [cartItems, setCartItems] = useState([]);

  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  return (
    <div>
      <Navbar />
      <div className="flex bg-green-800 justify-end p-3">
        <Button color="red" onClick={() => logout()}>
          Logout
        </Button>
      </div>
      <div className="container mx-auto mt-10">
        <h1 className="text-2xl font-bold text-white mb-5">Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-white">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover mb-4" />
                <p className="text-white font-bold">{item.title}</p>
                <p className="text-white">{item.description}</p>
                <p className="text-white font-bold">${item.price}</p>
                <Button color="red" onClick={() => removeFromCart(index)}>Remove</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
