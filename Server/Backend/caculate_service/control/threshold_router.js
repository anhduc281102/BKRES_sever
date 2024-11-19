const express = require('express');
const router = express.Router();
const Threshold = require('../models/threshold_schema');
const Data = require('../models/data_schema');
const Alert = require('../models/alert_schema'); 

// Route để nhận alert_threshold từ người dùng và xử lý dữ liệu
router.post('/threshold', async (req, res) => {
    try {
        const {device_API, sensor_API, min, max } = req.body;

        // Kiểm tra xem các trường cần thiết đã được cung cấp hay không
        if ( !device_API || !sensor_API || !min || !max) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin' });
        }

        // Kiểm tra xem ngưỡng cảnh báo cho sensor đã tồn tại trong cơ sở dữ liệu hay không
        let existingThreshold = await Threshold.findOne({ 
            device_API,
            sensor_API
        });

        if (existingThreshold) {
            // Nếu ngưỡng đã tồn tại, cập nhật giá trị min và max
            existingThreshold.alert_threshold = { min, max };
            await existingThreshold.save();
            return res.status(200).json({ message: 'Ngưỡng cảnh báo đã được cập nhật thành công' });
        } else {
            // Nếu ngưỡng chưa tồn tại, tạo một bản ghi mới
            const threshold = new Threshold({
                device_API,
                sensor_API,
                alert_threshold: { min, max }
            });
            await threshold.save();
            return res.status(201).json({ message: 'Ngưỡng cảnh báo đã được lưu thành công' });
        }
    } catch (error) {
        console.error('Lỗi khi lưu ngưỡng cảnh báo:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu ngưỡng cảnh báo' });
    }
});


// Route để xử lý dữ liệu và lưu bản tin cảnh báo vào collection mới
router.get('/alert', async (req, res) => {
    try {
        // Lấy tất cả các bản tin có isProcess = false từ collection Data
        const unprocessedData = await Data.find({ isProcess: false });

        // Kiểm tra từng bản tin và thực hiện cảnh báo nếu cần
        for (const data of unprocessedData) {
            // Lấy ngưỡng cảnh báo từ cơ sở dữ liệu dựa trên gateway_API, device_API và sensor_API của bản tin
            const threshold = await Threshold.findOne({ 
                device_API: data.device_API, 
                sensor_API: data.sensor_API 
            });

            if (!threshold) {
                console.error('Không tìm thấy ngưỡng cảnh báo cho bản tin:', data);
                continue; // Bỏ qua bản tin nếu không tìm thấy ngưỡng cảnh báo
            }

            // So sánh dữ liệu với ngưỡng cảnh báo
            if (data.data.data < threshold.alert_threshold.min) {
                // Nếu dữ liệu bé hơn ngưỡng thấp, thực hiện cảnh báo thấp hơn ngưỡng
                console.log(`Dữ liệu bé hơn ngưỡng thấp: ${data.data.data}`);

                // Lưu bản tin cảnh báo vào collection Alert
                const newAlert = new Alert({
                    device_API: data.device_API,
                    sensor_API: data.sensor_API,
                    data: data.data.data,
                    alert_message: `Dữ liệu bé hơn ngưỡng thấp: ${data.data.data}`
                });
                await newAlert.save();

                // Đánh dấu bản tin đã được xử lý
                await Data.findByIdAndUpdate(data._id, { isProcess: true });
            } else if (data.data.data > threshold.alert_threshold.max) {
                // Nếu dữ liệu lớn hơn ngưỡng cao, thực hiện cảnh báo lớn hơn ngưỡng
                console.log(`Dữ liệu lớn hơn ngưỡng cao: ${data.data.data}`);

                // Lưu bản tin cảnh báo vào collection Alert
                const newAlert = new Alert({
                    device_API: data.device_API,
                    sensor_API: data.sensor_API,
                    data: data.data.data,
                    alert_message: `Dữ liệu lớn hơn ngưỡng cao: ${data.data.data}`
                });
                await newAlert.save();

                // Đánh dấu bản tin đã được xử lý
                await Data.findByIdAndUpdate(data._id, { isProcess: true });
            }
        }

        res.status(200).json({ message: 'Đã thực hiện cảnh báo thành công' });
    } catch (error) {
        console.error('Lỗi khi thực hiện cảnh báo:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi thực hiện cảnh báo' });
    }
});

router.get('/alert/:sensor_API', async (req, res) => {
    try {
        const sensor_API = req.params.sensor_API;

        // Kiểm tra xem có bản tin cảnh báo nào cho sensor này không
        const alerts = await Alert.find({ sensor_API });

        if (alerts.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy bản tin cảnh báo cho sensor này' });
        }

        res.status(200).json({ alerts });
    } catch (error) {
        console.error('Lỗi khi lấy bản tin cảnh báo:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy bản tin cảnh báo' });
    }
});

module.exports = router;
