import React from 'react';
import { Trash2 } from 'lucide-react';

const Messages = ({ messages, clearMessages }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Message Log</h3>
          <p className="text-sm text-gray-500">Recent messages and auto-responses</p>
        </div>
        <button
          onClick={clearMessages}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${message.isPriority ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {message.isGroup ? message.groupName : message.from}
                    </p>
                    {message.isGroup && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Group
                      </span>
                    )}
                    {message.isPriority && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Priority
                      </span>
                    )}
                    {message.autoResponseSent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Auto-replied
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.body}</p>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No messages yet. Start the bot to begin monitoring.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;