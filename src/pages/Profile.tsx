import { useStore } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { userStore } from "../store/userStore";
import { apiClient } from "../utils/axios";
import { formatDateForDisplay, formatDateForInput } from "../utils/formatDate";
import toast from "react-hot-toast";

// ✅ GitHub SVG Icon Component
const GitHubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// ✅ LinkedIn SVG Icon Component
const LinkedInIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

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
    githubUrl: "",
    linkedInUrl: "",
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
        githubUrl: user.githubUrl || "",
        linkedInUrl: user.linkedInUrl || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
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
      toast.error("Please enter your first name to generate bio");
      return;
    }

    setIsGeneratingBio(true);

    try {
      const res = await apiClient.post("/ai/generate-bio", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        gender: formData.gender,
        githubUrl: formData.githubUrl || "",
        linkedInUrl: formData.linkedInUrl || "",
      });

      const generatedBio = res.data.bio;
      if (generatedBio) {
        setFormData((prev) => ({ ...prev, bio: generatedBio }));
        toast.success("Bio generated successfully! ✨");
      }
    } catch (error) {
      console.error("Failed to generate bio:", error);
      toast.error("Failed to generate bio. Please try again.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    // ✅ Validate URLs
    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      toast.error("Please enter a valid GitHub URL");
      return;
    }
    if (formData.linkedInUrl && !isValidUrl(formData.linkedInUrl)) {
      toast.error("Please enter a valid LinkedIn URL");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("bio", formData.bio);
      data.append("gender", formData.gender);
      data.append("dob", formData.dob);
      data.append("githubUrl", formData.githubUrl);
      data.append("linkedInUrl", formData.linkedInUrl);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await apiClient.patch("/user/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user || res.data;

      if (updatedUser && updatedUser._id) {
        setUser(updatedUser);
        setIsEditing(false);
        setSelectedFile(null);
        setPreview("");
        toast.success("Profile updated successfully! 🎉");
      }
    } catch (error: any) {
      console.error("Update error:", error?.response?.data);
      toast.error(
        error?.response?.data?.message ?? "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ URL Validator
  const isValidUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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
    preview || formData.imageUrl || user.imageUrl || "men.svg";

  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 py-4 px-4 mt-15"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* ==================== LEFT SIDE — Profile Card ==================== */}
          <motion.div
            className="w-full lg:w-96"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
              {/* Profile Image */}
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <motion.img
                  src={displayImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-gray-200 mt-1 text-sm sm:text-base lowercase!">
                    {formData.email.toLocaleLowerCase()}
                  </p>
                </motion.div>
              </div>

              <div className="p-6 space-y-4">
                {/* Gender */}
                <motion.div
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink to-orange flex items-center justify-center flex-shrink-0">
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

                {/* DOB */}
                <motion.div
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink to-orange flex items-center justify-center flex-shrink-0">
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

                {/* ✅ GitHub — Styled with icon, clickable link */}
                <motion.div
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <GitHubIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-sm">GitHub</p>
                    {formData.githubUrl ? (
                      <motion.a
                        href={formData.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 font-medium hover:text-pink transition-colors truncate block"
                        whileHover={{ x: 3 }}
                      >
                        {formData.githubUrl.replace(
                          /^https?:\/\/(www\.)?github\.com\/?/,
                          ""
                        ) || formData.githubUrl}
                        <svg
                          className="w-3.5 h-3.5 inline-block ml-1 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </motion.a>
                    ) : (
                      <p className="text-gray-400 font-medium italic text-sm">
                        Not added yet
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* ✅ LinkedIn — Styled with icon, clickable link */}
                <motion.div
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center flex-shrink-0">
                    <LinkedInIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-sm">LinkedIn</p>
                    {formData.linkedInUrl ? (
                      <motion.a
                        href={formData.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 font-medium hover:text-[#0077B5] transition-colors truncate block"
                        whileHover={{ x: 3 }}
                      >
                        {formData.linkedInUrl.replace(
                          /^https?:\/\/(www\.)?linkedin\.com\/in\/?/,
                          ""
                        ) || formData.linkedInUrl}
                        <svg
                          className="w-3.5 h-3.5 inline-block ml-1 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </motion.a>
                    ) : (
                      <p className="text-gray-400 font-medium italic text-sm">
                        Not added yet
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Bio */}
                <motion.div
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink to-orange flex items-center justify-center flex-shrink-0">
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

          {/* ==================== RIGHT SIDE — Edit Form ==================== */}
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
                      // ✅ Reset form on cancel
                      if (user) {
                        setFormData({
                          firstName: user.firstName || "",
                          lastName: user.lastName || "",
                          email: user.email || "",
                          bio: user.bio || "",
                          gender: user.gender || "",
                          dob: formatDateForInput(user.dob) || "",
                          imageUrl: user.imageUrl || "",
                          githubUrl: user.githubUrl || "",
                          linkedInUrl: user.linkedInUrl || "",
                        });
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-linear-to-r from-pink to-orange text-white font-medium text-sm sm:text-base"
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
                      <motion.div
                        onClick={triggerFileInput}
                        className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group ring-4 ring-gray-100 hover:ring-pink/30 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                      </motion.div>
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
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
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

                    {/* ✅ GitHub URL — with icon */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <GitHubIcon className="w-4 h-4 text-gray-700" />
                        GitHub URL
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <GitHubIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleChange}
                          placeholder="https://github.com/username"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
                        />
                      </div>
                    </motion.div>

                    {/* ✅ LinkedIn URL — with icon */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <LinkedInIcon className="w-4 h-4 text-[#0077B5]" />
                        LinkedIn URL
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <LinkedInIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="linkedInUrl"
                          value={formData.linkedInUrl}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0077B5] focus:ring-2 focus:ring-[#0077B5]/20 transition-all"
                        />
                      </div>
                    </motion.div>

                    {/* Bio with AI Generate */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-gray-500 text-sm">
                          Bio
                        </label>
                        <motion.button
                          type="button"
                          onClick={handleGenerateBio}
                          disabled={isGeneratingBio}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500 text-white text-xs font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                          placeholder="Tell us about yourself... or let AI generate one!"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/20 transition-all resize-none"
                        />

                        <AnimatePresence>
                          {isGeneratingBio && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-linear-to-r from-purple-500/10 to-indigo-500/10 rounded-xl flex items-center justify-center backdrop-blur-[1px]"
                            >
                              <div className="flex items-center gap-2 text-purple-600">
                                <motion.div className="flex gap-1">
                                  {[0, 1, 2].map((i) => (
                                    <motion.span
                                      key={i}
                                      className="w-2 h-2 bg-purple-500 rounded-full"
                                      animate={{ y: [0, -8, 0] }}
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
                        💡 Tip: Add GitHub & LinkedIn URLs for a more
                        personalized AI bio
                      </p>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-xl bg-linear-to-r from-pink to-orange text-white font-bold text-lg shadow-lg shadow-pink/25 disabled:opacity-50 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  /* ==================== VIEW MODE ==================== */
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
                        value: `${formData.firstName} ${formData.lastName}`.trim(),
                        icon: null,
                      },
                      {
                        label: "Email",
                        value: formData.email.toLocaleLowerCase(),
                        icon: null,
                      },
                      {
                        label: "Gender",
                        value: formData.gender || "Not specified",
                        icon: null,
                      },
                      {
                        label: "Date of Birth",
                        value:
                          formatDateForDisplay(formData.dob) || "Not specified",
                        icon: null,
                      },
                      {
                        label: "GitHub",
                        value: formData.githubUrl || "Not added yet",
                        icon: <GitHubIcon className="w-4 h-4 text-gray-700" />,
                        isLink: !!formData.githubUrl,
                        url: formData.githubUrl,
                      },
                      {
                        label: "LinkedIn",
                        value: formData.linkedInUrl || "Not added yet",
                        icon: (
                          <LinkedInIcon className="w-4 h-4 text-[#0077B5]" />
                        ),
                        isLink: !!formData.linkedInUrl,
                        url: formData.linkedInUrl,
                      },
                      {
                        label: "Bio",
                        value: formData.bio || "No bio added yet",
                        icon: null,
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="border-b border-gray-100 pb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <p className="text-gray-400 text-sm mb-1 flex items-center gap-1.5">
                          {item.icon}
                          {item.label}
                        </p>
                        {item.isLink && item.url ? (
                          <motion.a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink text-lg font-medium hover:underline flex items-center gap-1"
                            whileHover={{ x: 3 }}
                          >
                            {item.value.replace(
                              /^https?:\/\/(www\.)?(github\.com|linkedin\.com\/in)\/?/,
                              ""
                            )}
                            <svg
                              className="w-4 h-4 opacity-50"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </motion.a>
                        ) : (
                          <p
                            className={`text-lg font-medium capitalize ${
                              item.value.includes("Not") ||
                              item.value.includes("No ")
                                ? "text-gray-400 italic"
                                : "text-gray-800"
                            }`}
                          >
                            {item.value}
                          </p>
                        )}
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