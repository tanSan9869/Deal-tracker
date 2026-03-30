import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateUserAvatar, getUserAvatar } from "../services/userService";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const dropdownRef = useRef(null);

  // Load avatar from Firestore
  useEffect(() => {
    if (currentUser) {
      getUserAvatar(currentUser.uid).then(storedAvatar => {
        if (storedAvatar) {
          setAvatar(storedAvatar);
        } else if (currentUser.photoURL) {
          setAvatar(currentUser.photoURL);
        }
      });
    }
  }, [currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsDropdownOpen(false);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        // Create a canvas to downscale the image
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        // Keep aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert back to a highly compressed base64 JPEG (e.g., 0.7 quality)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        try {
          await updateUserAvatar(currentUser.uid, compressedBase64);
          setAvatar(compressedBase64);
        } catch (error) {
          console.error("Error saving avatar to Firestore", error);
          alert(`Database Error: ${error.message}\nMake sure your Firestore Database Rules allow writing to the "users" collection!`);
        } finally {
          setIsUploading(false);
        }
      };
      img.onerror = () => {
        alert("Failed to read the image file.");
        setIsUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    document.getElementById('avatar-upload').click();
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 py-4 px-6 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
          DT
        </div>
        <div className="font-extrabold text-xl tracking-tight text-white">Deal<span className="text-indigo-500">Tracker</span></div>
      </div>
      {currentUser && (
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-200">
              {currentUser.displayName || "Explorer"}
            </span>
            <span className="text-xs text-gray-500">
              {currentUser.email}
            </span>
          </div>
          
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isUploading}
            className={`w-10 h-10 rounded-full border-2 border-transparent hover:border-indigo-500 focus:outline-none focus:border-indigo-500 transition-all overflow-hidden bg-gray-800 flex items-center justify-center shadow-md ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
            ) : avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-lg">
                {(currentUser.displayName || currentUser.email || "E").charAt(0).toUpperCase()}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden">
              <button 
                onClick={triggerFileInput}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Upload Avatar Photo
              </button>
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <div className="h-px bg-gray-700 my-1"></div>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
