import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await axios.get('http://localhost:5001/users');
    setUsers(response.data);
  };

  return (
    <div>
      <h1 className="flex flex-row justify-center font-bold text-4xl">Comet Marketplace</h1>
      <div className="flex flex-row justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            await getUsers();
          }}
        >
          Click me!
        </button>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
