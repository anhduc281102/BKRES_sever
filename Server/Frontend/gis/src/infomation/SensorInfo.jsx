import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartPage from './Chart.jsx';
import ThresholdButton from './Threshold.jsx';

const SensorInfo = ({ sensor }) => {
    const [sensorInfo, setSensorInfo] = useState(null);
    const [sensorData, setSensorData] = useState([]);
    const [showChart, setShowChart] = useState(false);
    const [ setChartPosition] = useState({ top: 20, left: 20 }); // Đặt vị trí ban đầu ở góc trên bên trái

    useEffect(() => {
        const fetchSensorInfo = async () => {
            const token = localStorage.getItem('Token');
            const config = {
                headers: {
                    'authorization': `${token}`
                }
            };
            try {
                const response = await axios.get(`http://sanslab.ddns.net:5000/api/sensor/getSensor/${sensor.sensor_API}`, config);
                setSensorInfo(response.data);
            } catch (error) {
                console.error("Error fetching sensor information:", error);
            }
        };
        fetchSensorInfo();
    }, [sensor]);

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
            const response = await axios.get(`http://sanslab.ddns.net:5000/api/data/getdata/${sensor_API}`, config);
            setSensorData(response.data.map(item => ({ data: item.data.data, time: item.data.time })));
            setShowChart(true);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCloseChart = () => {
        setShowChart(false);
    };

    const handleSensorClick = () => {
        setShowChart(false);
        fetchData();
    };

    const handleChartClick = () => {
        // Di chuyển biểu đồ lên góc trên bên trái khi click vào nó
        setChartPosition({ top: 20, left: 20 });
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
            <button style={{
                backgroundColor: '#4CAF50', /* Green */
                border: 'none',
                color: 'white',
                padding: '15px 32px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                margin: '4px 2px',
                cursor: 'pointer',
                borderRadius: '12px'
            }} onClick={handleSensorClick}>Show Chart</button>
            <ThresholdButton deviceAPI={sensorInfo.device_API} sensorAPI={sensorInfo.sensor_API} />
        </div>           
            {showChart && (
                <div className='block-chart' style={{ display: 'block', position: 'fixed', left: '0px', bottom: '10px', zIndex: 992, background: 'rgb(239 239 239)', width: '820px', height: '200px' }}>
                    <button onClick={handleCloseChart} style={{ position:'relative', float: 'right', zIndex: 999}}>X</button>
                    <div className='chart-line' style={{ display: 'block', float: 'left', position: 'fixed', zIndex: 99}}>
                        <ChartPage sensorData={sensorData} onClick={handleChartClick} />
                        {console.log(sensorData)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensorInfo;