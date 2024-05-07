import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log(email, password);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        console.log(email, password);
        e.preventDefault();

        try {
            const response = await axios.post('http://sanslab.ddns.net:5000/api/user/login', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                localStorage.setItem('Token', response.data.Token);
                console.log(localStorage.getItem('Token'));
                navigate('/main'); 
            } else {
                console.error('Đăng nhập không thành công:', response.data.error);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API đăng nhập:', error);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Đăng nhập</h2>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-login">Đăng nhập</button>
                <p className="register-link">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
            </form>
        </div>
    );
}

export default Login;
