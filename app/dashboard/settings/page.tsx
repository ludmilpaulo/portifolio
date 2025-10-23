"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaSave, 
  FaEye, 
  FaEyeSlash, 
  FaUpload, 
  FaTrash,
  FaCog,
  FaPalette,
  FaShieldAlt,
  FaBell,
  FaGlobe,
  FaDatabase,
  FaDownload,
  FaUpload as FaUploadIcon
} from "react-icons/fa";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: "Ludmil Paulo",
      email: "ludmil@example.com",
      bio: "Senior Software Engineer & Full Stack Developer with 7+ years of experience.",
      avatar: "/avatar/lud.jpeg",
      location: "Global",
      website: "https://ludmilpaulo.com"
    },
    security: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: false,
      loginNotifications: true
    },
    appearance: {
      theme: "light",
      primaryColor: "#0093E9",
      secondaryColor: "#80D0C7",
      fontFamily: "Inter",
      fontSize: "medium"
    },
    notifications: {
      emailNotifications: true,
      projectUpdates: true,
      testimonialAlerts: true,
      securityAlerts: true,
      weeklyReports: false
    },
    seo: {
      siteTitle: "Ludmil Paulo | Senior Software Engineer & Full Stack Developer",
      metaDescription: "Senior Software Engineer & Full Stack Developer with 7+ years of experience. Expert in React, Node.js, Python, and mobile app development.",
      keywords: "software engineer, full stack developer, react developer, node.js developer",
      googleAnalytics: "",
      googleSearchConsole: ""
    }
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: FaCog },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "seo", label: "SEO", icon: FaGlobe },
    { id: "backup", label: "Backup", icon: FaDatabase }
  ];

  const handleSave = () => {
    // Save settings logic
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-settings.json';
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          alert("Settings imported successfully!");
        } catch (error) {
          alert("Error importing settings. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={settings.profile.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
            <FaUpload className="text-sm" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
          <p className="text-gray-600 text-sm">Upload a new profile picture</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, name: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, email: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={settings.profile.location}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, location: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={settings.profile.website}
            onChange={(e) => setSettings({
              ...settings,
              profile: { ...settings.profile, website: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={settings.profile.bio}
          onChange={(e) => setSettings({
            ...settings,
            profile: { ...settings.profile, bio: e.target.value }
          })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaShieldAlt className="text-yellow-600 mr-2" />
          <span className="text-yellow-800 font-medium">Security Settings</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">Keep your account secure with these settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={settings.security.currentPassword}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, currentPassword: e.target.value }
              })}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            value={settings.security.newPassword}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, newPassword: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            value={settings.security.confirmPassword}
            onChange={(e) => setSettings({
              ...settings,
              security: { ...settings.security, confirmPassword: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => setSettings({
              ...settings,
              security: { ...settings.security, twoFactorEnabled: !settings.security.twoFactorEnabled }
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Login Notifications</h4>
            <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
          </div>
          <button
            onClick={() => setSettings({
              ...settings,
              security: { ...settings.security, loginNotifications: !settings.security.loginNotifications }
            })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.security.loginNotifications ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.security.loginNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, primaryColor: e.target.value }
              })}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={settings.appearance.primaryColor}
              onChange={(e) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, primaryColor: e.target.value }
              })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.appearance.secondaryColor}
              onChange={(e) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, secondaryColor: e.target.value }
              })}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={settings.appearance.secondaryColor}
              onChange={(e) => setSettings({
                ...settings,
                appearance: { ...settings.appearance, secondaryColor: e.target.value }
              })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={settings.appearance.fontFamily}
            onChange={(e) => setSettings({
              ...settings,
              appearance: { ...settings.appearance, fontFamily: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <select
            value={settings.appearance.fontSize}
            onChange={(e) => setSettings({
              ...settings,
              appearance: { ...settings.appearance, fontSize: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaDatabase className="text-blue-600 mr-2" />
          <span className="text-blue-800 font-medium">Backup & Export</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">Manage your portfolio data and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
          <p className="text-gray-600 text-sm mb-4">Download all your portfolio data and settings</p>
          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
          >
            <FaDownload className="mr-2" />
            Export Settings
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
          <p className="text-gray-600 text-sm mb-4">Upload previously exported settings</p>
          <label className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center cursor-pointer">
            <FaUploadIcon className="mr-2" />
            Import Settings
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
        <p className="text-red-700 text-sm mb-4">These actions cannot be undone</p>
        <div className="flex space-x-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            <FaTrash className="mr-2" />
            Delete All Data
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return renderAppearanceSettings();
      case "backup":
        return renderBackupSettings();
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio configuration</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaSave className="mr-2" />
          Save Changes
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="mr-3" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
