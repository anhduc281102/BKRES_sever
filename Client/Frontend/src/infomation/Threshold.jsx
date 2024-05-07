import React, { useState } from 'react';
import axios from 'axios';

const ThresholdButton = ({ deviceAPI, sensorAPI }) => {
    const [threshold, setThreshold] = useState({ min: '', max: '' });

    const handleSetThreshold = async () => {
        try {
            const body = {
                device_API: deviceAPI, 
                sensor_API: sensorAPI, 
                ...threshold
            };
            const response = await axios.post('http://sanslab.ddns.net:5002/threshold', body);
            console.log(response.data);
        } catch (error) {
            console.error("Error setting threshold:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setThreshold({ ...threshold, [name]: value });
    };


    return (
        <div>
            {/* Thêm khung div chứa nút Set Threshold và input */}
            <div style={{ display: 'block', position: 'fixed', left: '510px', top: '240px', zIndex: 992, background: '#f0f8ff', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <label htmlFor="min">Min:</label>
            <input type="number" id="min" name="min" value={threshold.min} onChange={handleInputChange} style={{ marginLeft: '10px', marginRight: '10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <label htmlFor="max">Max:</label>
            <input type="number" id="max" name="max" value={threshold.max} onChange={handleInputChange} style={{ marginLeft: '10px', marginRight: '10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button onClick={handleSetThreshold} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Set Threshold</button>
        </div>

        </div>
    );
};

export default ThresholdButton;
