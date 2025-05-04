'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    username: false,
    phoneNumber: false,
    email: false,
    password: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !phoneNumber || !email || !password) {
      // Mark all fields as touched to show errors
      setTouched({
        fullName: true,
        username: true,
        phoneNumber: true,
        email: true,
        password: true
      });
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          username,
          phone_number: phoneNumber,
          email,
          password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Đăng ký thất bại');
      }

      const data = await response.json();
      router.push('/login');

    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getErrorMessage = (field: string, value: string) => {
    if (!touched[field as keyof typeof touched]) return '';
    if (!value) return 'Trường này là bắt buộc';
    if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      return 'Email không hợp lệ';
    }
    if (field === 'phoneNumber' && !/^\d{10,11}$/.test(value)) {
      return 'Số điện thoại phải có 10-11 chữ số';
    }
    if (field === 'password' && value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Đăng ký
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className={`block w-full rounded-md border ${
                    getErrorMessage('fullName', fullName) ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                />
                {getErrorMessage('fullName', fullName) && (
                  <p className="mt-1 text-sm text-red-500">{getErrorMessage('fullName', fullName)}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={`block w-full rounded-md border ${
                    getErrorMessage('username', username) ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleBlur('username')}
                />
                {getErrorMessage('username', username) && (
                  <p className="mt-1 text-sm text-red-500">{getErrorMessage('username', username)}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  className={`block w-full rounded-md border ${
                    getErrorMessage('phoneNumber', phoneNumber) ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black`}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={() => handleBlur('phoneNumber')}
                />
                {getErrorMessage('phoneNumber', phoneNumber) && (
                  <p className="mt-1 text-sm text-red-500">{getErrorMessage('phoneNumber', phoneNumber)}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full rounded-md border ${
                    getErrorMessage('email', email) ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                {getErrorMessage('email', email) && (
                  <p className="mt-1 text-sm text-red-500">{getErrorMessage('email', email)}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`block w-full rounded-md border ${
                    getErrorMessage('password', password) ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                />
                {getErrorMessage('password', password) && (
                  <p className="mt-1 text-sm text-red-500">{getErrorMessage('password', password)}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
              <Link href="/login" className="mt-2 block text-center text-sm text-gray-500 hover:text-gray-700">
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
