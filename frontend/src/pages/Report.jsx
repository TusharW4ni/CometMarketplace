import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Report() {
    // State hooks to manage form data
    const [reportType, setReportType] = useState('');
    const [link, setLink] = useState('');
    const [details, setDetails] = useState('');
    const navigate = useNavigate();
    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        //What happens when the form is submitted
        
        //Send report to backend

        console.log({ reportType, link, details });

        alert('Report submitted. Thank you.');
        navigate('/');
    };

    return (
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
    );
}

export default Report;
