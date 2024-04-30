
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartPage = ({ sensorData }) => {
    const lastTenData = sensorData.slice(-20);
    return (
        <div className="chart-container" style={{ display: 'block', position: 'fixed', left: '20px', top: '20px', zIndex: 992, background: 'rgb(239 239 239)' }}>
            {/* <ResponsiveContainer width="99%" height={300} style={{ border: '3px solid #000' }}>
                <LineChart data={lastTenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="time" padding={{left: 0, right: 0}} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer> */}
            <ResponsiveContainer width="99%" height={300} style={{ border: '3px solid #000' }}>        
                <AreaChart data={lastTenData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="temperature" stackId="1" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
export default ChartPage;
