import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GatewayInfo({ selectedGateway }) {
    const [gatewayInfo, setGatewayInfo] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        setIsVisible(true);
        if (!selectedGateway) return;
        const token = localStorage.getItem('Token');
        if (!token) {
            // Xử lý khi token không tồn tại, ví dụ: chuyển hướng người dùng đến trang đăng nhập
            return;
        }
        const config = {
            headers: {
                'authorization': `${token}`
            }
        };

        const fetchGatewayInfo = async () => {
            try {
                const response = await axios.get(`${window.API_URL}/api/gateway/getGateway/${selectedGateway.gateway_API}`,config);
                setGatewayInfo(response.data);
            } catch (error) {
                console.error('Error fetching gateway info:', error);
            }
        };

        fetchGatewayInfo();
        
    }, [selectedGateway]);

    console.log(gatewayInfo)

    return isVisible ? (
        <div className="gateway-info" style={{ 
            flex: 0.5, 
            padding: '10px', 
            borderLeft: '1px solid #ccc', 
            backgroundColor: '#e6f7ff', 
            overflowY: 'auto', 
            position: 'relative'  // Add this line
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
            {gatewayInfo ? (
                <div>
                    <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Gateway Information</h2>
                    <p><strong>Name:</strong> {gatewayInfo.gateway_name || 'No name provided'}</p>
                <p><strong>Location:</strong> Lat: {gatewayInfo.location[0].lat}, Lon: {gatewayInfo.location[0].lon}</p>
                <p><strong>Is Public:</strong> {gatewayInfo.is_public ? 'Yes' : 'No'}</p>
                {/* Add more fields here if needed */}
                
                {gatewayInfo.device.map((device, index) => (
                    <fieldset key={index} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                        <legend>Device {index + 1}</legend>
                        <p><strong>Device Name:</strong> {device.device_name || 'No name provided'}</p>
                        <p><strong>Device Location:</strong> Lat: {device.location[0].lat}, Lon: {device.location[0].lon}</p>
                        {/* Add more fields here if needed */}
                    </fieldset>
                ))}
                </div>
            ) : (
                <p>Loading gateway information...</p>
            )}
        </div>
    ) : null;
}

export default GatewayInfo;

