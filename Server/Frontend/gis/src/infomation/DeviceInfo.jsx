import axios from 'axios';
import { useState, useEffect } from 'react';
import SensorInfo from '../infomation/SensorInfo';

function DeviceInfo({ selectedDevice }) {
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [selectedSensor, setSelectedSensor] = useState(null);
    useEffect(() => {
        setIsVisible(true);
        if (!selectedDevice) return;
        const token = localStorage.getItem('Token');
        if (!token) {
            // Handle when token doesn't exist, e.g., redirect user to login page
            return;
        }
        const config = {
            headers: {
                'authorization': `${token}`
            }
        };

        const fetchDeviceInfo = async () => {
            try {
                const response = await axios.get(`http://sanslab.ddns.net:5000/api/device/getDevice/${selectedDevice.device_API}`, config);
                setDeviceInfo(response.data);
            } catch (error) {
                console.error('Error fetching device info:', error);
            }
        };

        fetchDeviceInfo();
    }, [selectedDevice]);

    console.log(deviceInfo);

    return isVisible ? (
        <div className="device-info" style={{ 
            flex: 0.5, 
            padding: '10px', 
            borderLeft: '1px solid #ccc', 
            backgroundColor: '#e6f7ff', 
            overflowY: 'auto', 
            position: 'relative' 
        }}>
            <button onClick={() => setIsVisible(false)} style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                background: 'none', 
                border: 'none', 
                fontSize: '20px', 
                cursor: 'pointer' 
            }}>X</button>
            {deviceInfo ? (
    <div>
        <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Device Information</h2>
        <p><strong>Name:</strong> {deviceInfo.device_name || 'No name provided'}</p>
        <p><strong>Location:</strong> Lat: {deviceInfo.location[0].lat}, Lon: {deviceInfo.location[0].lon}</p>
        {/* Add more fields here if needed */}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {deviceInfo.sensor.map((sensor, index) => (
            <button 
                key={index} 
                onClick={() => setSelectedSensor(sensor)}
                style={{
                    display: 'inline-block',
                    margin: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease',
                    flex: '0 0 calc(50% - 20px)' // for 2 buttons per row
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
            >
                Sensor {index + 1}
            </button>
        ))}
    </div>

    {selectedSensor && <SensorInfo sensor={selectedSensor} />}
        </div>
    ) : (
        <p>Loading device information...</p>
    )}
        </div>
    ) : null;
}

export default DeviceInfo;