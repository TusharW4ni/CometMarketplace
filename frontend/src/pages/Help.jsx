import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Help = () => {
    const navigate = useNavigate();

    return (
        <div className="text-white">
            <Navbar />
            <h1>About CometMarketplace</h1>
            <br></br>
            <p>CometMarketplace is a platform for all Comets to buy and sell items. Only UTD students and faculty can use this platform. It allows for a better experience than what is currently offered by the UTD app.</p>
            <br></br>
            <h1>Help & FAQ</h1>
            <br></br>
            <p className="hover:cursor-pointer" onClick={() => navigate(`/help`)}>How to make a post:</p>
            <p>- Click the tag icon near the top of the homepage (or just click on "How to make a post:"). Then, enter the item's name, price, and description</p>
            <br></br>
            <p>How to see an item:</p>
            <p>- Click on the item's name</p>
            <br></br>
            <p className="hover:cursor-pointer" onClick={() => navigate(`/messages`)}>How to message someone:</p>
            <p>- Click the dialogue box button near the top right (or just click on "How to message someone")</p>
            <br></br>
            <p>How to report an issue:</p>
            <p>- Click the "Report an Issue" button below, or click the [Report] button on the homepage</p>
            <br></br>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/report')}>
                Report an Issue
            </button>
        </div>
    );
};

export default Help;