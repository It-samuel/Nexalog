import React from "react";

const AITab = ({
  config,
  setConfig,
  saveConfig,
  loading,
}) => {
  const handleCheckboxChange = (e) => {
    console.log('Checkbox changed:', e.target.checked);
    setConfig({
      ...config,
      aiModeEnabled: e.target.checked,
    });
  };

  const handlePromptChange = (e) => {
    console.log('Prompt changed:', e.target.value);
    setConfig({
      ...config,
      aiCustomPrompt: e.target.value,
    });
  };

  const handleThresholdChange = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > 1) value = 1;

    console.log('Threshold changed:', value);
    setConfig({
      ...config,
      aiUrgencyThreshold: value,
    });
  };

  const handleSave = async () => {
    console.log('Save button clicked with config:', config);
    try {
      await saveConfig();
      console.log('Save completed successfully');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Debug: Log current config state
  console.log('Current config in AITab:', config);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">AI Settings</h2>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={config.aiModeEnabled}
          onChange={handleCheckboxChange}
          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <span className="text-gray-700 text-sm">
          Enable AI Analysis for incoming messages
        </span>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          AI Custom Prompt
        </label>
        <textarea
          className="w-full border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={6}
          placeholder="e.g. Detect if this message is a business lead or job offer and reply appropriately."
          value={config.aiCustomPrompt || ''}
          onChange={handlePromptChange}
        />
        <p className="mt-1 text-gray-500 text-xs">
          This prompt is sent to Azure OpenAI along with the message text.
        </p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          AI Urgency Threshold (0.0 - 1.0)
        </label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={config.aiUrgencyThreshold || 0}
          onChange={handleThresholdChange}
          className="w-full border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <p className="mt-1 text-gray-500 text-xs">
          Only messages where AI returns a relevance score above this
          threshold will trigger email notifications.
        </p>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save AI Settings"}
      </button>
    </div>
  );
};

export default AITab;

// comment