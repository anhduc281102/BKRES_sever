
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartPage = ({ sensorData }) => {
    const lastTenData = sensorData.slice(-30);
    return (
        <div className="chart-container" style={{ display: 'block', position: 'fixed', left: '0px', bottom: '10px', zIndex: 992, background: 'rgb(239 239 239)', width: '820px', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lastTenData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="data" stackId="1" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            {lastTenData.length > 0 && (
                <div style={{ position: 'absolute', bottom: '128px', left: `calc(94.6667% - 81px)`, background: '#fff', padding: '5px', border: '1px solid #000' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Giá trị hiện tại:</p>
                    <p style={{ margin: 0 }}>{lastTenData[lastTenData.length - 1].data}</p>
                </div>
            )}
        </div>
    );    
};
export default ChartPage;
