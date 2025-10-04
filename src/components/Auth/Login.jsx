import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/logo.png';
import { BASE_URL } from '../../utils/config';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/login`, {
      const res = await fetch(`${import.meta.env.VITE_API_URL || `${BASE_URL}`}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role_id);
      localStorage.setItem('user_id', data.user.user_id);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Login Successful!');
      setTimeout(() => {
        if (data.user.role_id === 3) navigate('/admin/dashboard');
        else if (data.user.role_id === 1) navigate('/Staff/dashboard');
        else if (data.user.role_id === 4) navigate('/secretary/dashboard');
        else if (data.user.role_id === 2) navigate('/children/dashboard');
        else navigate('/');
      }, 1000);
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="card shadow-lg w-100" style={{ maxWidth: '1000px', borderRadius: '2rem' }}>
        <div className="row g-0">
          {/* Left: Form */}
          <div className="col-12 col-md-6 p-5 text-center">
            <img src={logo} alt="logo" className="navbar-logo m-2 justify-content-center align-items-center " />
            <span className="navbar-title ">KidiCloud</span>
           
            <h2 className="h5 text-secondary mt-3">Welcome Back!</h2>
            <p className="text-muted mb-4">Login to access your dashboard</p>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-3 position-relative">
                <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                <input
                  type="email"
                  className="form-control ps-5"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control ps-5 pe-5"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 end-0 translate-middle-y me-3 text-secondary cursor-pointer`}
                  role="button"
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>

            

              {/* Login Button */}
              <button type="submit" className="btn btn-info w-100 text-white fw-semibold mb-3">
                Login
              </button>

              <div className="text-center">
              <Link to="/Forgot-Password"><p>Forgot Password</p></Link>
              </div>
            </form>
          </div>

          {/* Right: Image */}
          <div className="col-md-6 d-none d-md-block">
            <div className="h-100 position-relative">
              <img
                src="https://i.postimg.cc/13jCyCb9/7a4d099a65d67ea8e5d8c1e30fb467b1.jpg"
                alt="Childcare Illustration"
                className="img-fluid h-100 w-100 object-fit-cover"
                style={{ borderTopRightRadius: '2rem', borderBottomRightRadius: '2rem' }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.95), transparent)' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
