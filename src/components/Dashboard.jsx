import React, { useState } from "react";
import { Shield, Users, MessageCircle } from "lucide-react";



const API_BASE = import.meta.env.VITE_API_URL;


const Dashboard = ({ qrCode, config, messages, contacts, groups }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleClick = (section) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  const handleSendMessage = async () => {
  if (!replyTarget || !replyMessage.trim()) return;

  console.log("📤 Sending message:", {
    contactId: replyTarget.id,
    message: replyMessage,
    isGroup: replyTarget.isGroup,
  });

  setSending(true);
  try {
    const response = await fetch(`${API_BASE}/api/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactId: replyTarget.id,
        message: replyMessage,
        isGroup: replyTarget.isGroup,
      }),
    });

    const result = await response.json();
    console.log("📨 Server response:", result);

    if (response.ok && result.success) {
      alert("Message sent successfully!");
      setReplyTarget(null);
      setReplyMessage("");
    } else {
      console.error("❌ Failed to send message:", result.error);
      alert(`Failed to send message: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    alert("Network error. Please try again.");
  } finally {
    setSending(false);
  }
};

  const priorityContacts = contacts.filter((contact) =>
    config.priorityContacts.includes(contact.id)
  );

  const priorityGroups = groups.filter((group) =>
    config.priorityGroups.includes(group.id)
  );

  return (
    <div className="space-y-6 relative">
      {/* QR Code */}
      {qrCode && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-lg font-medium mb-4">
            Scan QR Code with WhatsApp
          </h2>
          <img
            src={qrCode}
            alt="WhatsApp QR Code"
            className="mx-auto max-w-sm"
          />
          <p className="text-sm text-gray-600 mt-4">
            Open WhatsApp on your phone → Settings → Linked Devices → Link a
            Device
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => handleClick("contacts")}
          className="cursor-pointer bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition"
        >
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Priority Contacts
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {config.priorityContacts.length}
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => handleClick("groups")}
          className="cursor-pointer bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition"
        >
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Priority Groups
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {config.priorityGroups.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Recent Messages
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {messages.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Contacts */}
      {selectedSection === "contacts" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Priority Contacts
          </h3>
          {priorityContacts.length === 0 ? (
            <p className="text-sm text-gray-500">
              No priority contacts selected.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {priorityContacts.map((contact) => (
                <li
                  key={contact.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500">{contact.id}</p>
                  </div>
                  <button
                    onClick={() => {
                      setReplyTarget({
                        id: contact.id,
                        name: contact.name,
                        isGroup: false,
                      });
                      setReplyMessage("");
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Reply
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Priority Groups */}
      {selectedSection === "groups" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Priority Groups
          </h3>
          {priorityGroups.length === 0 ? (
            <p className="text-sm text-gray-500">
              No priority groups selected.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {priorityGroups.map((group) => (
                <li
                  key={group.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-500">{group.id}</p>
                  </div>
                  <button
                    onClick={() => {
                      setReplyTarget({
                        id: group.id,
                        name: group.name,
                        isGroup: true,
                      });
                      setReplyMessage("");
                    }}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Reply
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {messages.slice(0, 10).map((message, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      message.isPriority ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {message.isGroup ? message.groupName : message.from}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-md">
                      {message.body}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {message.autoResponseSent && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Auto-replied
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Reply to {replyTarget.name}
            </h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setReplyTarget(null)}
                className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={sending || !replyMessage.trim()}
                onClick={handleSendMessage}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
