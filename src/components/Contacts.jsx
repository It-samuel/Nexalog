import React, { useState } from 'react';
import { User, Check, Search } from 'lucide-react';

const Contacts = ({ contacts, config, togglePriorityContact, saveConfig, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) => {
    const query = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(query) ||
      contact.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
        <p className="text-sm text-gray-500">Select contacts to receive priority notifications</p>
      </div>

      {/* Search bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <p className="px-6 py-4 text-sm text-gray-500">No contacts found.</p>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {contact.name || 'Unnamed Contact'}
                    </p>
                    <p className="text-xs text-gray-500">{contact.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => togglePriorityContact(contact.id)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    config.priorityContacts.includes(contact.id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {config.priorityContacts.includes(contact.id) ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Priority
                    </>
                  ) : (
                    'Add to Priority'
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t">
        <button
          onClick={saveConfig}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Contacts;
