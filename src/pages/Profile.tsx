import { useStore } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { userStore } from "../store/userStore";
import { apiClient } from "../utils/axios";
import { formatDateForDisplay, formatDateForInput } from "../utils/formatDate";

const Profile = () => {
  const { user, setUser } = useStore(userStore);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    gender: "",
    dob: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        gender: user.gender || "",
        dob: formatDateForInput(user.dob) || "",
        imageUrl: user.imageUrl || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBio = async () => {
    if (!formData.firstName) {
      alert("Please enter your first name to generate bio");
      return;
    }

    setIsGeneratingBio(true);

    try {
      const res = await apiClient.post("/ai/generate-bio", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        gender: formData.gender,
      });

      const generatedBio = res.data.bio;

      if (generatedBio) {
        setFormData((prev) => ({ ...prev, bio: generatedBio }));
      }
    } catch (error) {
      console.error("Failed to generate bio:", error);
      alert("Failed to generate bio. Please try again.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("bio", formData.bio);
      data.append("gender", formData.gender);
      data.append("dob", formData.dob);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await apiClient.patch("/user/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.user || res.data;

      if (updatedUser && updatedUser._id) {
        setUser(updatedUser);
        setIsEditing(false);
        setSelectedFile(null);
        setPreview("");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(254, 60, 114, 0.2)",
      transition: { duration: 0.3 },
    },
  } as const;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const displayImage =
    preview ||
    formData.imageUrl ||
    user.imageUrl ||
    "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg";

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-4 px-4 mt-15"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Profile Card - Left Side */}
          <motion.div
            className="w-full lg:w-96"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <motion.img
                  src={displayImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-gray-200 mt-1 text-sm sm:text-base">
                    {formData.email}
                  </p>
                </motion.div>
              </div>

              <div className="p-6 space-y-4">
                <motion.div
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink to-orange flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Gender</p>
                    <p className="text-gray-800 font-medium capitalize">
                      {formData.gender || "Not specified"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink to-orange flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date of Birth</p>
                    <p className="text-gray-800 font-medium">
                      {formatDateForDisplay(formData.dob) || "Not specified"}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink to-orange flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Bio</p>
                    <p className="text-gray-800 font-medium">
                      {formData.bio || "No bio added yet"}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Edit Form - Right Side */}
          <motion.div className="w-full lg:w-[500px]" variants={itemVariants}>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {isEditing ? "Edit Profile" : "Profile Details"}
                </h2>
                <motion.button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    if (isEditing) {
                      setSelectedFile(null);
                      setPreview("");
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink to-orange text-white font-medium text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    key="edit-form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Image Upload */}
                    <div className="flex flex-col items-center">
                      <div
                        onClick={triggerFileInput}
                        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={displayImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Click to change photo
                      </p>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Gender & DOB */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-all"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-500 text-sm mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* ✅ Bio with AI Generate Button */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-gray-500 text-sm">
                          Bio
                        </label>
                        <motion.button
                          type="button"
                          onClick={handleGenerateBio}
                          disabled={isGeneratingBio}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isGeneratingBio ? (
                            <>
                              <motion.svg
                                className="w-4 h-4"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </motion.svg>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>✨ AI Generate</span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      <div className="relative">
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about yourself... or let AI generate one for you!"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-all resize-none"
                        />

                        {/* AI Generating Animation Overlay */}
                        <AnimatePresence>
                          {isGeneratingBio && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl flex items-center justify-center backdrop-blur-[1px]"
                            >
                              <div className="flex items-center gap-2 text-purple-600">
                                <motion.div
                                  className="flex gap-1"
                                  initial="start"
                                  animate="end"
                                >
                                  {[0, 1, 2].map((i) => (
                                    <motion.span
                                      key={i}
                                      className="w-2 h-2 bg-purple-500 rounded-full"
                                      animate={{
                                        y: [0, -8, 0],
                                      }}
                                      transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                      }}
                                    />
                                  ))}
                                </motion.div>
                                <span className="text-sm font-medium">
                                  AI is thinking...
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <p className="text-gray-400 text-xs mt-2">
                        💡 Tip: Fill in your name, gender & DOB for a more
                        personalized bio
                      </p>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-pink to-orange text-white font-bold text-lg shadow-lg shadow-pink/25 disabled:opacity-50 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="view-details"
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {[
                      {
                        label: "Full Name",
                        value: `${formData.firstName} ${formData.lastName}`,
                      },
                      { label: "Email", value: formData.email },
                      {
                        label: "Gender",
                        value: formData.gender || "Not specified",
                      },
                      {
                        label: "Date of Birth",
                        value:
                          formatDateForDisplay(formData.dob) || "Not specified",
                      },
                      {
                        label: "Bio",
                        value: formData.bio || "No bio added yet",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="border-b border-gray-100 pb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <p className="text-gray-400 text-sm mb-1">
                          {item.label}
                        </p>
                        <p className="text-gray-800 text-lg font-medium capitalize">
                          {item.value}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;