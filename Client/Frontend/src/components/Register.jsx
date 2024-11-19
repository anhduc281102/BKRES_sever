import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Register.css'; 
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        account: '',
        password: ''
    });

    const navigate = useNavigate(); // Sử dụng useNavigate thay thế cho useHistory

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(window.API_URL);
            const response = await axios.post(`${window.API_URL}/api/user/register`, formData);
            console.log('Register response:', response.data);
            navigate('/login'); // Sử dụng navigate để chuyển hướng đến trang đăng nhập
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Đăng ký</h2>
                <div className="form-group">
                    <label htmlFor="fname">Tên:</label>
                    <input
                        type="text"
                        id="fname"
                        name="fname"
                        value={formData.fname}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lname">Họ:</label>
                    <input
                        type="text"
                        id="lname"
                        name="lname"
                        value={formData.lname}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="account">Tài khoản:</label>
                    <input
                        type="text"
                        id="account"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn-register">Đăng ký</button>
                <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
            </form>
        </div>
    );
}

export default Register;
