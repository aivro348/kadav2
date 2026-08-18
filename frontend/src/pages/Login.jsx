import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (username && password) {
      const lowerUsername = username.toLowerCase();
      
      if (lowerUsername === 'admin' && password === 'admin') {
        sessionStorage.setItem('rws_username', lowerUsername);
        navigate('/select-survey');
      } else if (lowerUsername.match(/^iitk([1-9]|[1-9][0-9]|100)$/) && password === lowerUsername) {
        sessionStorage.setItem('rws_username', lowerUsername);
        navigate('/select-survey');
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary-600">
          <img src="/netzero.jpg" alt="Logo" className="h-20 w-20 object-cover rounded-full shadow-md border-2 border-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Towards Net Zero
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Rural Water Supply Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-lg sm:px-10 border border-slate-100">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm mb-6 font-medium shadow-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="label-text">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label-text">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2.5 btn-primary text-base font-semibold shadow-sm">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
