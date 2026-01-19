import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";



const BASE_URL = import.meta.env.VITE_API_URL;


const panelAnimation = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

const ProfilePanel = ({ onProfileLoaded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

    
  /* ===== GET PROFILE ===== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          localStorage.getItem("token") ||sessionStorage.getItem("token");
         

        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res)

     
        setName(res.data.name || "");

        if (res.data.profilePhoto) {
          setProfileImage(`${BASE_URL}/${res.data.profilePhoto}`);
        }

        // email auth storage se
        const user = JSON.parse(localStorage.getItem("user"));
        setEmail(user?.emailaddress || "");

        onProfileLoaded?.({
          name: res.data.name || "",
          email: user?.email || "",
          image: res.data.profilePhoto
            ? `${BASE_URL}/${res.data.profilePhoto}`
            : null,
        });
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ===== IMAGE CHANGE ===== */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  /* ===== SAVE ===== */
const handleSave = async () => {
  try {
    setSaving(true);
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) formData.append("profilePhoto", imageFile);

    const res = await axios.post("/api/profile", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedImage = res.data.profilePhoto
      ? `${BASE_URL}/${res.data.profilePhoto}`
      : profileImage;

    setProfileImage(updatedImage);

    onProfileLoaded?.((prev) => ({
      ...prev,
      name: res.data.name,
      image: updatedImage,
    }));

  
    toast.success("Profile updated successfully");

  } catch (err) {
    console.error("Profile update failed", err);



    toast.error("Failed to update profile ");

  } finally {
    setSaving(false);
  }
};


  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={panelAnimation}>
      <div className="bg-white border rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Your Profile
        </h2>

        {loading ? (
          <div className="text-center py-10">Loading profile...</div>
        ) : (
          <div className="flex flex-col items-center gap-8">

            <div className="relative w-36 h-36 rounded-xl overflow-hidden border flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400">Upload Image</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="w-full max-w-md flex flex-col gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border rounded-md"
              />
              <input
                value={email}
                disabled
                className="p-3 border rounded-md bg-gray-100"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-teal-500 text-white py-2 rounded-md"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePanel;
