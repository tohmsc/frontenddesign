import React from 'react';
import { Input } from '@/components/ui/input';

export function ChatSidebar() {
  return (
    <div className="p-4 border-r border-border">
      <h2 className="text-lg font-semibold mb-4">Chat</h2>
      <Input placeholder="Type your message here..." />
      {/* Add a submit button if needed */}
    </div>
  );
}