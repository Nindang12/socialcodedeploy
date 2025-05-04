'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function MessagesPage() {
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const handleChatSelect = (chatId: string) => {
    // TODO: Implement chat selection functionality
  };

  const handleSendMessage = () => {
    // TODO: Implement send message functionality
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Tin nhắn</h1>
      <div className="max-w-xl w-full h-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
          {/* Chat list */}
          <div className="border-b pb-4">
            <div className="space-y-2">
              {/* TODO: Implement chat list */}
            </div>
          </div>

          {/* Chat content */}
          {activeChat ? (
            <div className="space-y-4">
              {/* Messages */}
              <div className="space-y-4">
                {/* TODO: Implement messages list */}
              </div>

              {/* Message input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
                  onClick={handleSendMessage}
                >
                  Gửi
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Chọn một cuộc trò chuyện để bắt đầu
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 