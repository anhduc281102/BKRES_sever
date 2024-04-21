import React, { useEffect, useRef } from 'react';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import '../styles/Main.css';
import mainStationIconUrl from '../assets/gateway_icon.png'; // Đường dẫn đến icon của trạm chính
import subStationIconUrl from '../assets/device_icon.png'; // Đường dẫn đến icon của trạm con

function Main() {
    const mapContainer = useRef(null);
    const mainStationMarkers = useRef([]); // Ref cho danh sách các markers của trạm chính
    const subStationMarkers = useRef([]); // Ref cho danh sách các markers của trạm con

    useEffect(() => {
        if (!mapContainer.current || mapContainer.current.children.length === 0) {
            // Khởi tạo bản đồ và đặt tọa độ trung tâm ở Việt Nam
            const map = L.map(mapContainer.current).setView([16.4637, 107.5909], 6);

            // Sử dụng bản đồ OpenStreetMap làm nền
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Tạo icon cho trạm chính
            const mainStationIcon = L.icon({
                iconUrl: mainStationIconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [0, -41]
            });

            // Tạo icon cho trạm con
            const subStationIcon = L.icon({
                iconUrl: subStationIconUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [0, -41]
            });

            // Dữ liệu tọa độ của các trạm thu thập dữ liệu (ví dụ)
            const stations = [
                { name: 'Station 1', location: [21.0285, 105.8542], children: [[21.02, 105.85], [21.03, 105.85], [21.04, 105.85]] },
                { name: 'Station 2', location: [10.762622, 106.660172], children: [[10.76, 106.66], [10.77, 106.66], [10.78, 106.66]] },
                { name: 'Station 3', location: [16.0544, 108.2022], children: [[16.05, 108.20], [16.06, 108.20], [16.07, 108.20]] }
                // Thêm các trạm khác vào đây
            ];

            // Đánh dấu các điểm trạm trên bản đồ với icon tùy chỉnh
            stations.forEach(station => {
                const mainStationMarker = L.marker(station.location, { icon: mainStationIcon }).addTo(map).bindPopup(`<b>${station.name}</b>`); 
                mainStationMarkers.current.push(mainStationMarker); 

                // Sự kiện click trên marker của trạm chính
                mainStationMarker.on('click', () => {
                    // Zoom vào vị trí của marker trạm chính
                    map.setView(station.location, 14.5);

                    // Xóa các marker của trạm con hiện tại
                    subStationMarkers.current.forEach(marker => map.removeLayer(marker));
                    subStationMarkers.current = [];

                    // Hiển thị vị trí của các node con với icon trạm con
                    station.children.forEach(child => {
                        const subStationMarker = L.marker(child, { icon: subStationIcon }).addTo(map); // Thêm marker cho node con với icon trạm con
                        subStationMarkers.current.push(subStationMarker); // Thêm marker của trạm con vào danh sách
                    });
                });
            });

            // Sự kiện zoomend để xóa các marker của trạm con khi zoom < 7
            map.on('zoomend', function() {
                const zoom = map.getZoom();
                if (zoom > 9) {
                    subStationMarkers.current.forEach(marker => map.removeLayer(marker));
                    subStationMarkers.current = [];
                }
            });
        }
    }, [mapContainer]);

    return <div ref={mapContainer} id="map" className="map-container"></div>;
}

export default Main;

// import React, { useEffect, useRef } from 'react';
// import L from 'leaflet'; 
// import 'leaflet/dist/leaflet.css'; 
// import '../styles/Main.css';
// import mainStationIconUrl from '../assets/gateway_icon.png'; 
// import subStationIconUrl from '../assets/device_icon.png'; 
// import axios from 'axios';

// function Main() {
//     const mapContainer = useRef(null);
//     const mainStationMarkers = useRef([]); 
//     const subStationMarkers = useRef([]); 

//     useEffect(() => {
//         const token = localStorage.getItem('Token');
//         if (!token) {
//             // Xử lý khi token không tồn tại, ví dụ: chuyển hướng người dùng đến trang đăng nhập
//             return;
//         }
//         // var container = L.DomUtil.get('map');
//         // if(container != null){
//         //     container._leaflet_id = null;
//         // }
//         // Chỉ khởi tạo bản đồ nếu container chưa được khởi tạo
//         if (!mapContainer.current || !mapContainer.current._leaflet_id) {
//             // Cấu hình yêu cầu Axios
//             const config = {
//                 headers: {
//                     'authorization': `${token}`
//                 }
//             };
        
//             // Gửi yêu cầu GET đến endpoint để lấy dữ liệu gateway
//             axios.get('http://sanslab.ddns.net:5000/api/gateway/getallGateway', config)
//             .then(response => {
//                 const gateways = response.data.data.gateways;
//                 // Khởi tạo bản đồ và đặt tọa độ trung tâm
//                 const map = L.map(mapContainer.current).setView([16.4637, 107.5909], 6);
//                 // Thêm layer bản đồ
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 }).addTo(map);
        
//                 // Tạo icon cho trạm chính và trạm con
//                 const mainStationIcon = L.icon({
//                     iconUrl: mainStationIconUrl,
//                     iconSize: [25, 41],
//                     iconAnchor: [12, 41],
//                     popupAnchor: [0, -41]
//                 });
//                 const subStationIcon = L.icon({
//                     iconUrl: subStationIconUrl,
//                     iconSize: [25, 41],
//                     iconAnchor: [12, 41],
//                     popupAnchor: [0, -41]
//                 });
        
//                 // Đánh dấu các trạm chính trên bản đồ
//                 gateways.forEach(gateway => {
//                     const location = gateway.location[0]; // Lấy tọa độ đầu tiên
//                     const mainStationMarker = L.marker([location.lat, location.lon], { icon: mainStationIcon })
//                         .addTo(map)
//                         .bindPopup(`<b>${gateway.gateway_name}</b>`); 
//                     mainStationMarkers.current.push(mainStationMarker); 
        
//                     // Xử lý sự kiện click trên marker của trạm chính
//                     mainStationMarker.on('click', () => {
//                         // Zoom vào vị trí của marker trạm chính
//                         map.setView([location.lat, location.lon], 14.5);
        
//                         // Xóa các marker của trạm con hiện tại
//                         subStationMarkers.current.forEach(marker => map.removeLayer(marker));
//                         subStationMarkers.current = [];
        
//                         // Hiển thị vị trí của các thiết bị trạm con với icon trạm con
//                         gateway.device.forEach(device => {
//                             const subStationMarker = L.marker([device.location.lat, device.location.lon], { icon: subStationIcon })
//                                 .addTo(map)
//                                 .bindPopup(`<b>${device.device_name}</b>`); 
//                             subStationMarkers.current.push(subStationMarker); 
//                         });
//                     });
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching gateways:', error);
//             });
//         }
//     }, [mapContainer]);

//     return <div ref={mapContainer} id="map" className="map-container"></div>;
// }

// export default Main;
