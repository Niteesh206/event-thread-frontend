

// import React, { useState } from 'react';
// import { MessageSquare, Users, Calendar, Zap, Shield } from 'lucide-react';

// const LoginPage = ({ onLogin, onRegister }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isAdminLogin, setIsAdminLogin] = useState(false);
//   const [isRegisterMode, setIsRegisterMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!username.trim()) {
//       setError('Please enter a username');
//       return;
//     }
    
//     if (!password.trim()) {
//       setError('Please enter a password');
//       return;
//     }

//     if (isRegisterMode && password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       if (isRegisterMode) {
//         await onRegister(username, password);
//       } else {
//         await onLogin(username, password, isAdminLogin);
//       }
//     } catch (err) {
//       setError(err.message || `${isRegisterMode ? 'Registration' : 'Login'} failed. Please try again.`);
//       setLoading(false);
//     }
//   };

//   const switchMode = () => {
//     setIsRegisterMode(!isRegisterMode);
//     setIsAdminLogin(false);
//     setUsername('');
//     setPassword('');
//     setError('');
//   };

//   const switchToAdmin = () => {
//     setIsAdminLogin(!isAdminLogin);
//     setIsRegisterMode(false);
//     setUsername('');
//     setPassword('');
//     setError('');
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

//           {/* Left Side - Marketing */}
//           <div className="space-y-8">
//             <h1 className="text-5xl font-bold text-gray-900 mb-4">
//               Connect Through <span className="text-blue-600">Temporary Events</span>
//             </h1>
//             <p className="text-xl text-gray-600">
//               Create and join interest-based threads that expire after a set time.
//             </p>
//             {/* Features */}
//             <div className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <div className="bg-blue-100 p-3 rounded-lg"><Zap className="w-6 h-6 text-blue-600" /></div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Quick & Easy</h3>
//                   <p className="text-gray-600">Create threads in seconds</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="bg-purple-100 p-3 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Interest-Based</h3>
//                   <p className="text-gray-600">Connect with people who share your interests</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="bg-green-100 p-3 rounded-lg"><Calendar className="w-6 h-6 text-green-600" /></div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Time-Limited</h3>
//                   <p className="text-gray-600">Threads automatically expire</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Login/Register Form */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 {isAdminLogin ? 'Admin Access' : isRegisterMode ? 'Create Account' : 'Welcome Back'}
//               </h2>
//               <p className="text-gray-600">
//                 {isAdminLogin 
//                   ? 'Sign in with your admin credentials' 
//                   : isRegisterMode 
//                   ? 'Sign up to start connecting' 
//                   : 'Sign in to your account'}
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
//                   name="username"
//                   type="text"
//                   placeholder={isAdminLogin ? "Enter admin username" : "Choose a username"}
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   disabled={loading}
//                   autoComplete="username" // ✅ Chrome-compliant
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   placeholder={isRegisterMode ? "Create a password (min 6 characters)" : "Enter your password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   disabled={loading}
//                   autoComplete={isRegisterMode ? "new-password" : "current-password"} // ✅ Chrome-compliant
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     {isRegisterMode ? 'Creating account...' : 'Signing in...'}
//                   </>
//                 ) : (
//                   isAdminLogin ? 'Sign In as Admin' : isRegisterMode ? 'Create Account' : 'Sign In'
//                 )}
//               </button>
//             </form>

//             {!isAdminLogin && (
//               <div className="mt-6 text-center">
//                 <button
//                   onClick={switchMode}
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
//                 >
//                   {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
//                 </button>
//               </div>
//             )}

//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <button
//                 onClick={switchToAdmin}
//                 className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 transition-colors"
//               >
//                 {isAdminLogin ? (
//                   <>← Back to {isRegisterMode ? 'sign up' : 'sign in'}</>
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

//       <footer className="py-6 px-4 border-t border-gray-200">
//         <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
//           <p>© 2024 EventThreads. Connect, Chat, Expire.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LoginPage;

//2
import React, { useState } from 'react';
import { MessageSquare, Users, Calendar, Zap, Shield, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const LoginPage = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (isRegisterMode && value.length < 6) return 'Password must be at least 6 characters';
        if (isRegisterMode && !/(?=.*[a-z])(?=.*[A-Z])/.test(value)) return 'Password should contain uppercase and lowercase letters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, field === 'username' ? username : password);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') setUsername(value);
    else setPassword(value);
    
    if (touched[field]) {
      const error = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);
    
    setFieldErrors({
      username: usernameError,
      password: passwordError
    });

    if (usernameError || passwordError) {
      setError('Please fix the errors above');
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
    setFieldErrors({});
    setTouched({});
  };

  const switchToAdmin = () => {
    setIsAdminLogin(!isAdminLogin);
    setIsRegisterMode(false);
    setUsername('');
    setPassword('');
    setError('');
    setFieldErrors({});
    setTouched({});
  };

  const getFieldStatus = (field) => {
    if (!touched[field]) return null;
    return fieldErrors[field] ? 'error' : 'success';
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Image with Curved Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/src/components/ui/together.jpg')",
            filter: 'brightness(0.7)'
          }}
        />
        
        {/* Curved Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-pink-900/60" />
        
        {/* Curved Shape Overlay - Creates bending effect */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-64 md:h-96" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="rgba(255, 255, 255, 0.1)" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        
        {/* Top Curved Shape - Additional bending */}
        <svg 
          className="absolute top-0 left-0 w-full h-32 md:h-48 transform rotate-180" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="rgba(255, 255, 255, 0.05)" 
            fillOpacity="1" 
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,122.7C960,139,1056,149,1152,138.7C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 animate-slide-in">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-lg hover-lift border border-white/30 overflow-hidden">
              <img 
                src="/src/components/ui/logo.jpg" 
                alt="Prastha Logo" 
                className="w-8 h-8 object-cover rounded-lg"
              />
            </div>
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              Prastha
            </span>
          </div>
        </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Marketing Content */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Connect Through
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"> Temporary Events</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed drop-shadow">
                Create and join interest-based threads that expire after a set time. 
                Perfect for meetups, study groups, and spontaneous gatherings.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Zap, color: 'blue', title: 'Quick & Easy', desc: 'Create threads in seconds, no complex setup required' },
                { icon: Users, color: 'purple', title: 'Interest-Based', desc: 'Connect with people who share your interests' },
                { icon: Calendar, color: 'green', title: 'Time-Limited', desc: 'Threads automatically expire, keeping conversations fresh' }
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-slide-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`bg-white/20 backdrop-blur-sm p-3 rounded-lg group-hover:scale-110 transition-transform border border-white/30`}>
                    <feature.icon className={`w-6 h-6 text-white`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login/Register Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 animate-scale-in hover-lift">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                {isAdminLogin ? (
                  <span className="flex items-center gap-2">
                    <Shield className="w-8 h-8 text-blue-300" />
                    Admin Access
                  </span>
                ) : isRegisterMode ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-white/80">
                {isAdminLogin 
                  ? 'Sign in with your admin credentials' 
                  : isRegisterMode 
                  ? 'Sign up to start connecting' 
                  : 'Sign in to your account'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border-l-4 border-red-400 backdrop-blur-sm rounded-lg animate-scale-in flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    placeholder={isAdminLogin ? "Enter admin username" : "Choose a username"}
                    value={username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:border-transparent transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${
                      getFieldStatus('username') === 'error' 
                        ? 'border-red-400 focus:ring-red-400' 
                        : getFieldStatus('username') === 'success'
                        ? 'border-green-400 focus:ring-green-400'
                        : 'border-white/30 focus:ring-blue-400'
                    }`}
                    disabled={loading}
                    autoComplete="username"
                  />
                  {getFieldStatus('username') && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {getFieldStatus('username') === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.username && touched.username && (
                  <p className="mt-1 text-sm text-red-300 animate-fade-in">{fieldErrors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isRegisterMode ? "Create a strong password" : "Enter your password"}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full px-4 py-3 pr-20 border rounded-lg focus:ring-2 focus:border-transparent transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/50 ${
                      getFieldStatus('password') === 'error' 
                        ? 'border-red-400 focus:ring-red-400' 
                        : getFieldStatus('password') === 'success'
                        ? 'border-green-400 focus:ring-green-400'
                        : 'border-white/30 focus:ring-blue-400'
                    }`}
                    disabled={loading}
                    autoComplete={isRegisterMode ? "new-password" : "current-password"}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {getFieldStatus('password') && (
                      <div>
                        {getFieldStatus('password') === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/60 hover:text-white transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {fieldErrors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-300 animate-fade-in">{fieldErrors.password}</p>
                )}
                {isRegisterMode && password && !fieldErrors.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-400' : 'bg-white/30'}`} />
                      <span className={password.length >= 6 ? 'text-green-300' : 'text-white/60'}>At least 6 characters</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? 'bg-green-400' : 'bg-white/30'}`} />
                      <span className={/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? 'text-green-300' : 'text-white/60'}>Upper & lowercase letters</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ripple"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isRegisterMode ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  isAdminLogin ? (
                    <>
                      <Shield className="w-5 h-5" />
                      Sign In as Admin
                    </>
                  ) : isRegisterMode ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {!isAdminLogin && (
              <div className="mt-6 text-center">
                <button
                  onClick={switchMode}
                  className="text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors hover:underline"
                >
                  {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/20">
              <button
                onClick={switchToAdmin}
                className="w-full text-center text-sm text-blue-300 hover:text-blue-200 font-medium flex items-center justify-center gap-2 transition-all hover:gap-3"
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
      <footer className="py-6 px-4 border-t border-white/10 animate-fade-in">
        <div className="max-w-6xl mx-auto text-center text-sm text-white/80">
          <p>© 2024 Prastha. Connect, Chat, Expire.</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default LoginPage;