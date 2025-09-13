import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const FILTERS = {
  PRIORITY: 'Priority',
  AI_FLAGGED: 'AI-Flagged',
};

const Messages = ({ messages, clearMessages }) => {
  const [filter, setFilter] = useState(FILTERS.PRIORITY);

  const filteredMessages = messages.filter((message) => {
    if (filter === FILTERS.PRIORITY) {
      return message.isPriority;
    }
    if (filter === FILTERS.AI_FLAGGED) {
      return message.aiRelevance && message.aiRelevance >= 0.5;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Message Log</h3>
          <p className="text-sm text-gray-500">
            {filter === FILTERS.PRIORITY && 'Showing priority messages only'}
            {filter === FILTERS.AI_FLAGGED && 'Showing AI-flagged messages only'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={FILTERS.PRIORITY}>Priority only</option>
            <option value={FILTERS.AI_FLAGGED}>AI-flagged only</option>
          </select>

          <button
            onClick={clearMessages}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredMessages.map((message, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  message.isPriority ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                    {message.aiRelevance && message.aiRelevance >= 0.5 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        AI-Flagged
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

        {filteredMessages.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No messages found for selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
