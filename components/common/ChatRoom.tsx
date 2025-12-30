
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Message, Errand } from '../../types';

interface ChatRoomProps {
  user: User;
  errandId: string;
  onClose: () => void;
  isBargedIn?: boolean;
}

const DUMMY_MESSAGES: Record<string, Message[]> = {
  'ORD-4829': [
    { id: '1', senderId: 'u1', senderName: 'Tafadzwa Diaspora', senderRole: UserRole.CLIENT, text: "Hi Simba, just wanted to check if they have the Zimgold oil in stock?", timestamp: '10:46 AM' },
    { id: '2', senderId: 'w1', senderName: 'Simba Runner', senderRole: UserRole.WORKER, text: "I'm checking the shelves now. Yes, they have plenty of the 2L bottles!", timestamp: '10:48 AM' },
    { id: '3', senderId: 'u1', senderName: 'Tafadzwa Diaspora', senderRole: UserRole.CLIENT, text: "Great, please grab 2 bottles.", timestamp: '10:49 AM' },
  ],
  'TIC-102': [
    { id: '1', senderId: 'w44', senderName: 'Simba R.', senderRole: UserRole.WORKER, text: "I've arrived at the OK Mart but the gates are closed. There is a sign saying 'Closed for maintenance'.", timestamp: '11:05 AM' },
  ]
};

const ChatRoom: React.FC<ChatRoomProps> = ({ user, errandId, onClose, isBargedIn }) => {
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES[errandId] || []);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const QUICK_REPLIES = [
    "I'm at the store",
    "Stuck in traffic",
    "Checking out now",
    "Item out of stock",
    "On my way to you"
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h3 className="font-black text-sm tracking-tight">Order Chat #{errandId}</h3>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">3 Participants Live</span>
            </div>
          </div>
        </div>
        {user.role === UserRole.SUPPORT && (
          <div className="bg-red-600/20 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-600/30">
            Monitoring Active
          </div>
        )}
      </div>

      {/* Barge-in Warning */}
      {isBargedIn && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center space-x-2">
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Support Mode: Your messages are visible to everyone</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          const isSupport = msg.senderRole === UserRole.SUPPORT;
          
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  {msg.senderName} {isSupport && '• Support'}
                </span>
              </div>
              <div className={`
                max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm
                ${isMe ? 'bg-red-600 text-white rounded-tr-none' : 
                  isSupport ? 'bg-black text-white rounded-tl-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}
              `}>
                {msg.text}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 font-bold">{msg.timestamp}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies for Workers */}
      {user.role === UserRole.WORKER && messages.length > 0 && (
        <div className="px-4 py-2 flex space-x-2 overflow-x-auto no-scrollbar border-t bg-white">
          {QUICK_REPLIES.map(reply => (
            <button 
              key={reply}
              onClick={() => sendMessage(reply)}
              className="whitespace-nowrap bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-gray-200 hover:border-red-200"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t flex items-center space-x-3">
        <button className="text-gray-400 hover:text-red-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Type a message..."
            className="w-full bg-gray-50 border rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-red-600/5 transition-all"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
          />
        </div>
        <button 
          onClick={() => sendMessage(inputText)}
          className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
