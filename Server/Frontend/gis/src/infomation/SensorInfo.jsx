
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const SensorInfo = ({ sensor }) => {
    const [sensorInfo, setSensorInfo] = useState(null);
    useEffect(() => {
        const fetchSensorInfo = async () => {
            const token = localStorage.getItem('Token');
            const config = {
                headers: {
                    'authorization': `${token}`
                }
            };
            const response = await axios.get(`http://sanslab.ddns.net:5000/api/sensor/getSensor/${sensor.sensor_API}`, config);
            setSensorInfo(response.data);
        };
        fetchSensorInfo();
    }, [sensor]);
    if (!sensorInfo) {
        return <p>Loading sensor information...</p>;
    }
    return (
        <fieldset style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <legend>Sensor Information</legend>
            <p><strong>Sensor Name:</strong> {sensorInfo.sensor_name || 'No name provided'}</p>
            <p><strong>Provider:</strong> {sensorInfo.provider || 'No provider provided'}</p>
            <p><strong>Unit:</strong> {sensorInfo.unit || 'No unit provided'}</p>
            <p><strong>Description:</strong> {sensorInfo.describe || 'No description provided'}</p>
        </fieldset>
    );
};
export default SensorInfo;
