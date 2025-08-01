import React from 'react';

const SettingsTab = ({ 
  config, 
  setConfig, 
  newEmail, 
  setNewEmail, 
  handleAddEmail, 
  handleRemoveEmail, 
  saveConfig, 
  loading 
}) => {
  return (
    <div className="space-y-6">
      {/* Auto-Response Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Auto-Response Settings</h3>
          <p className="text-sm text-gray-500">
            Configure automatic responses for non-priority contacts
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Enable Auto-Response
              </p>
              <p className="text-sm text-gray-500">
                Send automatic replies to non-priority contacts
              </p>
            </div>
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  autoResponseEnabled: !config.autoResponseEnabled,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.autoResponseEnabled ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.autoResponseEnabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Auto-Response Message
            </label>
            <textarea
              value={config.autoResponseMessage}
              onChange={(e) =>
                setConfig({
                  ...config,
                  autoResponseMessage: e.target.value,
                })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your auto-response message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cooldown Period (hours)
            </label>
            <input
              type="number"
              value={
                config.autoResponseCooldown
                  ? config.autoResponseCooldown / 3600000
                  : ""
              }
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setConfig({
                  ...config,
                  autoResponseCooldown: !isNaN(value)
                    ? value * 3600000
                    : 0,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="1"
              min="0.25"
              step="0.25"
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum time between auto-responses to the same contact
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Notification Settings
          </h3>
          <p className="text-sm text-gray-500">
            Configure how you receive priority notifications
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Sound Notifications
              </p>
              <p className="text-sm text-gray-500">
                Play sound for priority messages
              </p>
            </div>
            <button
              onClick={() =>
                setConfig({
                  ...config,
                  notificationSound: !config.notificationSound,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.notificationSound ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.notificationSound
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Emails */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Notification Emails
          </h3>
          <p className="text-sm text-gray-500">
            Add one or more email addresses to receive notifications for
            priority contacts or groups.
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex space-x-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleAddEmail}
              disabled={!newEmail.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>

          <ul className="divide-y divide-gray-200">
            {(config.notificationEmails || []).length === 0 ? (
              <li className="py-2 text-sm text-gray-500">
                No notification emails added yet.
              </li>
            ) : (
              config.notificationEmails.map((email, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center py-2"
                >
                  <span className="text-sm text-gray-700">{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveConfig}
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;