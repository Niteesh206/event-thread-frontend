// import React, { useState } from 'react';
// import { MessageSquare, Users, Calendar, Zap, Shield } from 'lucide-react';

// const LoginPage = ({ onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isAdminLogin, setIsAdminLogin] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!username.trim()) {
//       setError('Please enter a username');
//       return;
//     }
    
//     if (isAdminLogin && !password.trim()) {
//       setError('Please enter a password');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       await onLogin(username, password, isAdminLogin);
//     } catch (err) {
//       setError(err.message || 'Login failed. Please try again.');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
//       {/* Header */}
//       <header className="p-6">
//         <div className="max-w-6xl mx-auto flex items-center gap-3">
//           <div className="bg-blue-600 p-2 rounded-lg">
//             <MessageSquare className="w-6 h-6 text-white" />
//           </div>
//           <span className="text-2xl font-bold text-gray-900">EventThreads</span>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-center px-4 py-12">
//         <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          
//           {/* Left Side - Marketing Content */}
//           <div className="space-y-8">
//             <div>
//               <h1 className="text-5xl font-bold text-gray-900 mb-4">
//                 Connect Through
//                 <span className="text-blue-600"> Temporary Events</span>
//               </h1>
//               <p className="text-xl text-gray-600">
//                 Create and join interest-based threads that expire after a set time. 
//                 Perfect for meetups, study groups, and spontaneous gatherings.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-100 p-3 rounded-lg">
//                   <Zap className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Quick & Easy</h3>
//                   <p className="text-gray-600">Create threads in seconds, no complex setup required</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="bg-purple-100 p-3 rounded-lg">
//                   <Users className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Interest-Based</h3>
//                   <p className="text-gray-600">Connect with people who share your interests</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <Calendar className="w-6 h-6 text-green-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Time-Limited</h3>
//                   <p className="text-gray-600">Threads automatically expire, keeping conversations fresh</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Login Form */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 {isAdminLogin ? 'Admin Access' : 'Get Started'}
//               </h2>
//               <p className="text-gray-600">
//                 {isAdminLogin 
//                   ? 'Sign in with your admin credentials' 
//                   : 'Enter your username to join EventThreads'}
//               </p>
//             </div>

//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-700 text-sm">{error}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   placeholder={isAdminLogin ? "Enter admin username" : "Choose a username"}
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   disabled={loading}
//                 />
//               </div>

//               {isAdminLogin && (
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     placeholder="Enter admin password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     disabled={loading}
//                   />
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Signing in...
//                   </>
//                 ) : (
//                   isAdminLogin ? 'Sign In as Admin' : 'Join EventThreads'
//                 )}
//               </button>
//             </form>

//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => {
//                   setIsAdminLogin(!isAdminLogin);
//                   setUsername('');
//                   setPassword('');
//                   setError('');
//                 }}
//                 className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 transition-colors"
//               >
//                 {isAdminLogin ? (
//                   <>← Back to regular login</>
//                 ) : (
//                   <>
//                     <Shield className="w-4 h-4" />
//                     Admin Login
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="py-6 px-4 border-t border-gray-200">
//         <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
//           <p>© 2024 EventThreads. Connect, Chat, Expire.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from 'react';
import { MessageSquare, Users, Calendar, Zap, Shield } from 'lucide-react';

const LoginPage = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (isRegisterMode && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        await onRegister(username, password);
      } else {
        await onLogin(username, password, isAdminLogin);
      }
    } catch (err) {
      setError(err.message || `${isRegisterMode ? 'Registration' : 'Login'} failed. Please try again.`);
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setIsAdminLogin(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  const switchToAdmin = () => {
    setIsAdminLogin(!isAdminLogin);
    setIsRegisterMode(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">EventThreads</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Marketing Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Connect Through
                <span className="text-blue-600"> Temporary Events</span>
              </h1>
              <p className="text-xl text-gray-600">
                Create and join interest-based threads that expire after a set time. 
                Perfect for meetups, study groups, and spontaneous gatherings.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quick & Easy</h3>
                  <p className="text-gray-600">Create threads in seconds, no complex setup required</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Interest-Based</h3>
                  <p className="text-gray-600">Connect with people who share your interests</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Time-Limited</h3>
                  <p className="text-gray-600">Threads automatically expire, keeping conversations fresh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isAdminLogin ? 'Admin Access' : isRegisterMode ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isAdminLogin 
                  ? 'Sign in with your admin credentials' 
                  : isRegisterMode 
                  ? 'Sign up to start connecting' 
                  : 'Sign in to your account'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder={isAdminLogin ? "Enter admin username" : "Choose a username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder={isRegisterMode ? "Create a password (min 6 characters)" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isRegisterMode ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  isAdminLogin ? 'Sign In as Admin' : isRegisterMode ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {!isAdminLogin && (
              <div className="mt-6 text-center">
                <button
                  onClick={switchMode}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={switchToAdmin}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {isAdminLogin ? (
                  <>← Back to {isRegisterMode ? 'sign up' : 'sign in'}</>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Admin Login
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>© 2024 EventThreads. Connect, Chat, Expire.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;