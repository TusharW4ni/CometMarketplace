import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Select, Textarea } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';

function Report({ item }) {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    userId: '',
    url: '',
    reportType: '',
    reportDescription: '',
  });
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRes = await axios.post(
          `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/getUser`,
          { email: user.email },
        );
        setFormData({ ...formData, userId: userRes.data.id });
      } catch (error) {
        console.log('error in getUser', error);
      }
    };
    if (user) {
      getUser();
    }
  }, []);

  useEffect(() => {
    console.log('formData', formData);
  }, [formData]);

  const createReport = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_EXPRESS_BASE_URL}/api/report/createReport`,
        formData,
      );
    } catch (error) {
      console.log('error in createReport', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-20 p-20 text-white">
        {confirmation && (
          <div className="flex w-full justify-center items-center">
            <div className="rounded-full bg-orange-500 px-2 py-1">
              <p className="text-white">
                Report submitted successfully! We'll look into this ASAP.
              </p>
            </div>
          </div>
        )}
        <p className="text-2xl font-bold">Report</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createReport();
            setConfirmation(true);
            setTimeout(() => {
              setConfirmation(false);
              navigate(-1);
            }, 3000);
          }}
        >
          <TextInput
            label="Enter URL of the content you want to report"
            value={formData.url}
            onChange={(e) => {
              setFormData({ ...formData, url: e.target.value });
            }}
            required
          />
          <div className="mt-4">
            <Select
              label="Select report type"
              data={['Spam', 'Suspicious', 'Fraud', 'Inappropriate']}
              value={formData.reportType}
              onChange={(value) => {
                setFormData({ ...formData, reportType: value });
              }}
              required
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              resize="vertical"
              value={formData.reportDescription}
              onChange={(e) => {
                setFormData({ ...formData, reportDescription: e.target.value });
              }}
              required
            />
          </div>
          <Button type="submit" className="mt-10" color="orange">
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}

export default Report;
