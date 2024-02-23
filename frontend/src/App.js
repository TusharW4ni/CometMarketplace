import axios from 'axios';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import logo from './images/comet-marketplace-logo-artdecor.png';


function App() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await axios.get('http://localhost:5001/users');
    setUsers(response.data);
  };

  return (
    <div>
      <div className="flex flex-row justify-center items-center h-16 w-full px-4 ">
        <img className="h-12 w-12 mr-4 cursor-pointer" src={logo} alt="Logo" />
        <h1 className="font-bold text-2xl cursor-pointer">Comet Marketplace</h1>
      </div>
      <Navbar />
    </div>
  );
}

export default App;
