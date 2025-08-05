import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Play,
  Square,
  Settings,
  MessageCircle,
  Users,
  Bell,
  BellOff,
  Trash2,
  Send,
  LogOut,
  Wifi,
  WifiOff,
  QrCode,
  Check,
  X,
  User,
  Clock,
  Shield,
} from "lucide-react";

// Import the components
import Dashboard from "./components/Dashboard";
import Contacts from "./components/Contacts";
import Groups from "./components/Groups";
import Messages from "./components/Messages";
import SettingsTab from "./components/SettingsTab";
import AITab from "./components/AITab";

const API_BASE = import.meta.env.VITE_API_URL;

const App = () => {
  const [status, setStatus] = useState("disconnected");
  const [qrCode, setQrCode] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  // FIX 1: Add AI fields to initial state
  const [config, setConfig] = useState({
    priorityContacts: [],
    priorityGroups: [],
    autoResponseMessage: "",
    autoResponseEnabled: true,
    autoResponseCooldown: 3600000,
    notificationSound: true,
    notificationEmails: [],
    // ADD THESE MISSING AI FIELDS:
    aiModeEnabled: true,
    aiCustomPrompt: "",
    aiUrgencyThreshold: 0.5
  });
  
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  
  // FIX 2: Add a flag to prevent config overwriting when user is making changes
  const [isConfigDirty, setIsConfigDirty] = useState(false);

  // FIX 3: Modified fetchStatus to not overwrite config when user is editing
  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/status`);
      const data = await response.json();
      setStatus(data.status);
      setQrCode(data.qrCode);
      
      // Only update config if user hasn't made unsaved changes
      if (!isConfigDirty && data.config) {
        setConfig(data.config);
      } else if (!data.config) {
        // Set default config only if no config exists and no dirty changes
        if (!isConfigDirty) {
          setConfig({
            priorityContacts: [],
            priorityGroups: [],
            autoResponseMessage: "",
            autoResponseEnabled: true,
            autoResponseCooldown: 3600000,
            notificationSound: true,
            notificationEmails: [],
            aiModeEnabled: true,
            aiCustomPrompt: "",
            aiUrgencyThreshold: 0.5
          });
        }
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE}/contacts`);
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_BASE}/groups`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Helper function to save config to server
  const saveConfigToServer = async (configToSave) => {
    try {
      await fetch(`${API_BASE}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });
    } catch (error) {
      console.error("Error saving configuration:", error);
      showNotification("Error saving configuration", "error");
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail.trim()) return;

    setConfig((prevConfig) => {
      const updatedConfig = {
        ...prevConfig,
        notificationEmails: [...prevConfig.notificationEmails, newEmail.trim()],
      };

      // Save to server immediately
      saveConfigToServer(updatedConfig);

      return updatedConfig;
    });

    setNewEmail("");
    showNotification("Email added successfully", "success");
  };

  const handleRemoveEmail = async (emailToRemove) => {
    const updatedEmails = config.notificationEmails.filter(
      (email) => email !== emailToRemove
    );
    const updatedConfig = {
      ...config,
      notificationEmails: updatedEmails,
    };

    setConfig(updatedConfig);

    try {
      await fetch(`${API_BASE}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig),
      });
      showNotification("Email removed successfully", "success");
    } catch (error) {
      showNotification("Error saving configuration", "error");
    }
  };

  // Bot control functions
  const startBot = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/start`, { method: "POST" });
      showNotification("Bot starting...", "success");
    } catch (error) {
      showNotification("Error starting bot", "error");
    }
    setLoading(false);
  };

  const stopBot = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/stop`, { method: "POST" });
      showNotification("Bot stopped", "success");
    } catch (error) {
      showNotification("Error stopping bot", "error");
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/logout`, { method: "POST" });
      showNotification("Logged out successfully", "success");
    } catch (error) {
      showNotification("Error logging out", "error");
    }
    setLoading(false);
  };

  // FIX 4: Modified saveConfig to clear the dirty flag after saving
  const saveConfig = async () => {
    setLoading(true);
    try {
      console.log("Saving config:", config); // Debug log
      await fetch(`${API_BASE}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      showNotification("Configuration saved", "success");
      setIsConfigDirty(false); // Clear dirty flag after successful save
    } catch (error) {
      showNotification("Error saving configuration", "error");
      console.error("Save config error:", error);
    }
    setLoading(false);
  };

  const clearMessages = async () => {
    try {
      await fetch(`${API_BASE}/messages`, { method: "DELETE" });
      setMessages([]);
      showNotification("Message log cleared", "success");
    } catch (error) {
      showNotification("Error clearing messages", "error");
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Toggle priority contact/group
  const togglePriorityContact = async (contactId) => {
    // Update local state immediately for UI responsiveness
    setConfig((prevConfig) => {
      const isAlreadyPriority = prevConfig.priorityContacts.includes(contactId);
      const newPriorityContacts = isAlreadyPriority
        ? prevConfig.priorityContacts.filter((id) => id !== contactId)
        : [...prevConfig.priorityContacts, contactId];

      const newConfig = {
        ...prevConfig,
        priorityContacts: newPriorityContacts,
      };

      // Immediately save to server
      savePriorityConfig(newConfig);

      return newConfig;
    });
  };

  const togglePriorityGroup = async (groupId) => {
    // Update local state immediately for UI responsiveness
    setConfig((prevConfig) => {
      const isAlreadyPriority = prevConfig.priorityGroups.includes(groupId);
      const newPriorityGroups = isAlreadyPriority
        ? prevConfig.priorityGroups.filter((id) => id !== groupId)
        : [...prevConfig.priorityGroups, groupId];

      const newConfig = {
        ...prevConfig,
        priorityGroups: newPriorityGroups,
      };

      // Immediately save to server
      savePriorityConfig(newConfig);

      return newConfig;
    });
  };

  // Add this new function to save priority changes immediately
  const savePriorityConfig = async (newConfig) => {
    try {
      await fetch(`${API_BASE}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });
      showNotification("Priority settings saved", "success");
    } catch (error) {
      showNotification("Error saving priority settings", "error");
      console.error("Error saving priority config:", error);
    }
  };

  // Auto-refresh
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [isConfigDirty]); // Add isConfigDirty as dependency

  useEffect(() => {
    if (status === "connected") {
      fetchContacts();
      fetchGroups();
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "text-green-500";
      case "connecting":
        return "text-yellow-500";
      case "qr-ready":
        return "text-blue-500";
      case "auth-failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <Wifi className="w-5 h-5" />;
      case "connecting":
        return <Clock className="w-5 h-5 animate-spin" />;
      case "qr-ready":
        return <QrCode className="w-5 h-5" />;
      default:
        return <WifiOff className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header + Navigation */}
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-4 sm:space-y-0">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Nexalog</h1>
      </div>

      {/* Status + Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">
            {status.replace("-", " ")}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {status === "connected" ? (
            <button
              onClick={stopBot}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 w-full sm:w-auto"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={startBot}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 w-full sm:w-auto"
            >
              <Play className="w-4 h-4" />
              <span>Start</span>
            </button>
          )}

          <button
            onClick={logout}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex justify-between items-center py-2 sm:py-0">
      {/* Always show Dashboard */}
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`flex items-center space-x-2 py-2 px-3 rounded-md font-medium text-sm ${
          activeTab === "dashboard"
            ? "bg-green-100 text-green-600"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Dashboard</span>
      </button>

      {/* Hamburger for small screens */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex space-x-6">
        {[
          { id: "contacts", label: "Contacts", icon: Users },
          { id: "groups", label: "Groups", icon: Users },
          { id: "messages", label: "Messages", icon: MessageCircle },
          { id: "settings", label: "Settings", icon: Settings },
          { id: "ai", label: "AI", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-2 px-3 rounded-md font-medium text-sm ${
              activeTab === tab.id
                ? "bg-green-100 text-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Mobile Tabs */}
    {isMenuOpen && (
      <div className="sm:hidden mt-2 space-y-1 pb-4">
        {[
          { id: "contacts", label: "Contacts", icon: Users },
          { id: "groups", label: "Groups", icon: Users },
          { id: "messages", label: "Messages", icon: MessageCircle },
          { id: "settings", label: "Settings", icon: Settings },
          { id: "ai", label: "AI", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md font-medium text-sm ${
              activeTab === tab.id
                ? "bg-green-100 text-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>
</div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            qrCode={qrCode} 
            config={config} 
            messages={messages}
            contacts={contacts}
            groups={groups} />
        )}

        {activeTab === 'contacts' && (
          <Contacts 
            contacts={contacts} 
            config={config} 
            togglePriorityContact={togglePriorityContact} 
            saveConfig={saveConfig} 
            loading={loading} 
          />
        )}

        {activeTab === 'groups' && (
          <Groups 
            groups={groups} 
            config={config} 
            togglePriorityGroup={togglePriorityGroup} 
            saveConfig={saveConfig} 
            loading={loading} 
          />
        )}

        {activeTab === 'messages' && (
          <Messages messages={messages} clearMessages={clearMessages} />
        )}

        {activeTab === 'settings' && config && (
          <SettingsTab 
            config={config} 
            setConfig={setConfig} 
            newEmail={newEmail}   
            setNewEmail={setNewEmail} 
            handleAddEmail={handleAddEmail} 
            handleRemoveEmail={handleRemoveEmail} 
            saveConfig={saveConfig} 
            loading={loading} 
          />
        )}

        {activeTab === "ai" && (
          <AITab
            config={config}
            setConfig={(newConfig) => {
              setConfig(newConfig);
              setIsConfigDirty(true); // Mark config as dirty when AI settings change
            }}
            saveConfig={saveConfig}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default App;