import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { saveUserProfile } from "../services/dealService";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserProfile(userCredential.user.uid, { email, name });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-xl shadow-black/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30 mb-4">
            <span className="text-xl font-bold text-white">DT</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {isLogin ? "Enter your details to access your deals." : "Sign up to start tracking your deals today."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input 
                placeholder="John Doe" 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500" 
                required 
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input 
              type="email"
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500" 
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/20 mt-2">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="ml-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            {isLogin ? "Sign up now" : "Log in instead"}
          </button>
        </div>
      </div>
    </div>
  );
}