import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import { AUTH_ENDPOINTS } from '../../config/apiConfig';
import { useToast } from '../common/Toast';
import backgroundImage from '../../assets/logobg.jpg';

const Auth = () => {
    const [isActive, setIsActive] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ 
        firstName: '',
        lastName: '',
        username: '', 
        email: '', 
        password: '',
        confirmPassword: '',
        role: 'BEGINNER'
    });
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const { addToast } = useToast();

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
        return regex.test(password);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            let data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                addToast('Login successful!', 'success');
                navigate('/Profile');
            } else {
                addToast(data.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('An error occurred during login. Please try again.', 'error');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        if (!validatePassword(registerData.password)) {
            setPasswordError("Password must be at least 6 characters long, include uppercase, lowercase, number, and special character.");
            return;
        }

        setPasswordError("");

        try {
            const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            let data = await response.json();

            if (response.ok) {
                addToast('Registration successful! Please login.', 'success');
                setIsActive(false);
            } else {
                addToast(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            addToast('An error occurred during registration. Please try again.', 'error');
        }
    };

    return (
        <div style={containerStyle}>
            <div className="relative w-[1000px] h-[750px] bg-white m-5 rounded-3xl shadow-lg overflow-hidden">


                {/* Login Form */}
                <div className={`absolute w-1/2 h-full bg-white flex items-center text-gray-800 text-center p-10 z-10 transition-all duration-700 ease-in-out ${isActive ? 'opacity-0 pointer-events-none right-1/2' : 'opacity-100 right-0'}`}>
                    <form onSubmit={handleLoginSubmit} className="w-full">
                        <h1 className="text-4xl -mt-2.5 mb-0">Login</h1>
                        <div className="relative my-7">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                required
                                value={loginData.email}
                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"
                            />
                            <i className='bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="relative my-7">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"
                            />
                            <i className='bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="-mt-4 mb-4">
                            <a href="#" className="text-sm text-gray-800">Forgot Password?</a>
                        </div>
                        <button type="submit" className="w-full h-12 rounded-lg text-white font-semibold bg-DarkColor">Login</button>
                    </form>
                </div>

                {/* Register Form */}
               <div className={`absolute w-[550px] h-full bg-white flex items-start pt-6 text-gray-800 text-center p-10 z-10 transition-all duration-700 ease-in-out transform ${isActive ? 'opacity-100 translate-y-0 left-0' : 'opacity-0 pointer-events-none translate-y-10 right-0'}`}>

                    <form onSubmit={handleRegisterSubmit} className="w-full">
                        <h1 className="text-4xl -mt-2.5 mb-0">Registration</h1>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="relative">
                                <input type="text" placeholder="First Name" value={registerData.firstName} onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})} className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"/>
                                <i className='bx bx-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                            </div>
                            <div className="relative">
                                <input type="text" placeholder="Last Name" value={registerData.lastName} onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})} className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"/>
                                <i className='bx bx-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                            </div>
                        </div>
                        <div className="relative my-5">
                            <input type="text" placeholder="Username" required value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})} className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"/>
                            <i className='bx bx-at absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="relative my-5">
                            <input type="email" placeholder="Email" required value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"/>
                            <i className='bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="relative my-5">
                            <input type="password" placeholder="Password (Min 6 chars, 1 uppercase, 1 number)"  required value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"/>
                            <i className='bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        <div className="relative my-5">
                            <input type="password" placeholder="Confirm Password" required value={registerData.confirmPassword} onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-base text-gray-800"/>
                            <i className='bx bxs-lock absolute right-5 top-1/2 transform -translate-y-1/2 text-xl'></i>
                        </div>
                        {passwordError && (
                            <p className="text-red-600 text-sm mb-2">{passwordError}</p>
                        )}
                        <button type="submit" className="w-full h-12 rounded-lg text-white font-semibold bg-DarkColor mt-2">Register</button>
                    </form>
                </div>

                {/* Sliding Panel */}
                <div className="absolute w-full h-full">
                    <div className="absolute w-full h-full overflow-hidden">
                        <div className={`absolute w-[300%] h-full rounded-[150px] transition-all duration-[1.8s] ease-in-out transform ${isActive ? 'left-[calc(-50%+850px)]' : '-left-[250%]'} bg-SecondaryColor`}></div>
                    </div>
                    <div className={`absolute left-0 w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${isActive ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'} text-ExtraDarkColor`}>
                        <h1 className="text-4xl">Hello, Welcome!</h1>
                        <p className="mb-5 text-sm">Don't have an account?</p>
                        <button className="w-40 h-[46px] bg-transparent rounded-lg font-semibold border-2 border-ExtraDarkColor text-ExtraDarkColor" onClick={() => setIsActive(true)}>Register</button>
                    </div>
                    <div className={`absolute right-0 w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'} text-ExtraDarkColor`} style={{ left: '55%' }}>
                        <h1 className="text-4xl">Welcome Back!</h1>
                        <p className="mb-5 text-sm">Already have an account?</p>
                        <button className="w-40 h-[46px] bg-transparent rounded-lg font-semibold border-2 border-ExtraDarkColor text-ExtraDarkColor" onClick={() => setIsActive(false)}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
