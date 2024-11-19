import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartPage from './Chart.jsx';
import ThresholdButton from './Threshold.jsx';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SensorInfo = ({ sensor }) => {
    const [sensorInfo, setSensorInfo] = useState(null);
    const [sensorData, setSensorData] = useState([]);
    const [showThreshold, setShowThreshold] = useState(false);
    const [alertMessages, setAlertMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('Token');
                const sensor_API = sensor.sensor_API;
                const config = {
                    headers: {
                        'authorization': `${token}`,
                        'sensor_API': `${sensor_API}`
                    }
                };
                const response = await axios.get(`${window.API_URL}/api/data/getdata/${sensor_API}`, config);
                setSensorData(response.data.map(item => ({ data: item.data.data, time: item.data.time })));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchSensorInfo = async () => {
            const token = localStorage.getItem('Token');
            const config = {
                headers: {
                    'authorization': `${token}`
                }
            };
            try {
                const response = await axios.get(`${window.API_URL}/api/sensor/getSensor/${sensor.sensor_API}`, config);
                setSensorInfo(response.data);
            } catch (error) {
                console.error("Error fetching sensor information:", error);
            }
        };

        const fetchAlertMessages = async () => {
            try {
                const response = await axios.get(`http://sanslab.ddns.net:5002/alert/${sensor.sensor_API}`);
                setAlertMessages(response.data.alerts.slice(-5) || []);
            } catch (error) {
                console.error("Error fetching alert messages:", error);
            }
        };

        fetchSensorInfo();
        fetchData();
        fetchAlertMessages();
    }, [sensor]);

    const handleShowThreshold = () => {
        setShowThreshold(true);
    };

    const handleCloseThreshold = () => {
        setShowThreshold(false);
    };

    if (!sensorInfo) {
        return <p>Loading sensor information...</p>;
    }

    return (
        <div>
            <fieldset style={{ display: 'block', marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <legend>Sensor Information</legend>
                <p><strong>Sensor Name:</strong> {sensorInfo.sensor_name || 'No name provided'}</p>
                <p><strong>Provider:</strong> {sensorInfo.provider || 'No provider provided'}</p>
                <p><strong>Unit:</strong> {sensorInfo.unit || 'No unit provided'}</p>
                <p><strong>Description:</strong> {sensorInfo.describe || 'No description provided'}</p>
            </fieldset>

            <div>
                <button onClick={handleShowThreshold} style={{ backgroundColor: '#4CAF50', border: 'none', color: 'white', padding: '15px 32px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '12px' }}>Set Threshold</button>
            </div>

            {showThreshold && (
                <div className='threshold-modal' style={{ position: 'absolute', top: '285px', right: '407px', zIndex: 999, background: 'white', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <button onClick={handleCloseThreshold} style={{ position: 'absolute', top: '5px', right: '5px', padding: '5px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'transparent' }}>x</button>
                    <ThresholdButton deviceAPI={sensorInfo.device_API} sensorAPI={sensorInfo.sensor_API} />
                </div>
            )}

            <div className='block-chart' style={{ display: 'block', position: 'fixed', left: '0px', bottom: '10px', zIndex: 992, background: 'rgb(239 239 239)', width: '820px', height: '200px' }}>
                <div className='chart-line' style={{ display: 'block', float: 'left', position: 'fixed', zIndex: 99 }}>
                    <ChartPage sensorData={sensorData} />
                    {console.log(sensorData)}
                </div>
            </div>

            <div className="alert-container" style={{ display: 'block', position: 'fixed', right: '437px', top: '0px', backgroundColor: '#87CEFA',zIndex: 999 }}>
                <h3>Alert Messages</h3>
                <ul>
                    {alertMessages.map((alert, index) => (
                        <li key={index}>{alert.alert_message} - {new Date(alert.time).toLocaleString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SensorInfo;
