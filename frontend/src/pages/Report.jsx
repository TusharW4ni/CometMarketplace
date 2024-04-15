<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { auth } from '../utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Report() {
  const [userReportingId, setUserReportingId] = useState('');
  const [url, setUrl] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserReportingId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const createReport = async () => {
    console.log('createReport');
    setUserReportingId(1); // <---- Temporary fix. I can't get the user ID.
    if (!userReportingId) {
      console.error('User ID is not defined');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/create-report`,
        {
          userReportingId,
          url,
          reportType,
          reportDescription,
        },
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-20 text-white">
        <p className="text-2xl font-bold">Report</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createReport();
            alert(`Report submitted successfully! We'll look into this ASAP.`);
            navigate('../');
          }}
        >
          Enter URL of the content you want to report:
          <input
            type="text"
            className="block w-full bg-gray-800 text-white p-2 mt-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div className="mt-4">
            <label htmlFor="reportType">Select report type:</label>
            <select
              id="reportType"
              className="block w-full bg-gray-800 text-white p-2 mt-2"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select...
              </option>
              <option value="Spam">Spam</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Fraud">Fraud</option>
              <option value="Inappropriate">Inappropriate</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="reportDescription">Description:</label>
            <textarea
              id="reportDescription"
              className="block w-full bg-gray-800 text-white p-2 mt-2"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Report;
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Report() {
    // State hooks to manage form data
    const [reportType, setReportType] = useState('');
    const [link, setLink] = useState('');
    const [details, setDetails] = useState('');
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = (e) => { //What happens when the form is submitted
        e.preventDefault();

        //Send report to backend

        console.log({ reportType, link, details });

        alert('Report submitted. Thank you.');
        navigate('/');
    };

    return (
        <div>
            <Navbar />
            <div style={{ margin: '20px', color: 'white' }}>
            <h1 style={{ color: 'white', fontSize: '24px' }}>Make Report</h1>
                <div style={{ marginBottom: '10px' }}></div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="reportType" style={{ color: 'white' }}>Report Type: </label>
                        <select
                            id="reportType"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            required
                            style={{ color: 'black' }}
                        >
                            <option value="">Select a type</option>
                            <option value="suspicious">Suspicious</option>
                            <option value="fraud">Fraud</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="link" style={{ color: 'white' }}>Link: </label>
                        <input
                            id="link"
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                            style={{ color: 'black' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="details" style={{ color: 'white' }}>Details: </label>
                        <textarea
                            id="details"
                            rows="4"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            required
                            style={{ color: 'black' }}
                        ></textarea>
                    </div>
                    <button type="submit">[Submit Report]</button>
                </form>
            </div>
        </div>
    );
}

export default Report;
>>>>>>> 37d3a725054ca1df1ab8633a311cd91e05b9615b
