import React, { useState } from "react";
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Wrench,
  Clock,
  Sparkles,
} from "lucide-react";
import type { ChatMessage, User } from "../types.ts";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  currentUser: User | null;
  onSendMessage: (
    receiverId: string,
    receiverName: string,
    message: string,
    toolTitle?: string,
  ) => void;
  selectedConversation?: {
    requestId?: string;
    toolTitle?: string;
    otherUserId: string;
    otherUserName: string;
  } | null;
}

const QUICK_CHIPS = [
  "Hi! Is 5:30 PM okay for pickup today?",
  "On my way to your front porch now!",
  "All done! Dropping it back wiped clean.",
  "Thanks so much! Really helped with our home project.",
];

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  currentUser,
  onSendMessage,
  selectedConversation,
}) => {
  if (!isOpen) return null;

  const [inputMessage, setInputMessage] = useState("");

  // Determine active other user
  const otherUserId = selectedConversation?.otherUserId || "user-siti";
  const otherUserName = selectedConversation?.otherUserName || "Kak Siti Hajar";
  const activeToolTitle = selectedConversation?.toolTitle;

  // Filter messages between currentUser and otherUser
  const currentThread = messages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.receiverId === otherUserId) ||
      (m.senderId === otherUserId && m.receiverId === currentUser?.id),
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage(
      otherUserId,
      otherUserName,
      inputMessage.trim(),
      activeToolTitle,
    );
    setInputMessage("");
  };

  const handleChipClick = (chip: string) => {
    setInputMessage(chip);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        id="neighborhood-chat-modal"
        className="w-full max-w-xl bg-[#fcfbf9] border border-[#ded7c8] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 h-145 flex flex-col text-left"
      >
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-[#e8e2d7] flex items-center justify-between bg-[#f4efe6] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5f7d66] text-white flex items-center justify-center font-bold text-sm">
              {otherUserName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-[#24211d] text-sm leading-tight">
                  {otherUserName}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-[#5f7d66]" />
              </div>
              <p className="text-[11px] text-[#67635c]">
                Verified Neighbor · Phone number kept private
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#67635c] hover:text-[#24211d] hover:bg-[#eae3d5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Banner if coordinating for a specific tool */}
        {activeToolTitle && (
          <div className="px-5 py-2 bg-[#fbeee9] border-b border-[#c86d51]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#b0553b] font-medium truncate">
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                Coordinating for: <strong>{activeToolTitle}</strong>
              </span>
            </div>
            <span className="text-[10px] text-[#67635c] shrink-0">
              In-App Safe Chat
            </span>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#faf8f5]">
          {currentThread.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-10 h-10 rounded-full bg-[#ede7db] flex items-center justify-center text-[#67635c] mb-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#24211d]">
                Start coordinating with {otherUserName}
              </p>
              <p className="text-[11px] text-[#67635c] max-w-xs mt-1">
                Agree on a convenient pickup time, porch handover, or exchange
                tool tips safely.
              </p>
            </div>
          ) : (
            currentThread.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? "bg-[#c86d51] text-white rounded-br-xs"
                        : "bg-[#fcfbf9] text-[#24211d] border border-[#ded7c8] rounded-bl-xs"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-[#8c867b] px-1 mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Coordination Chips */}
        <div className="px-4 py-2 bg-[#f4efe6] border-t border-[#e8e2d7] overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#fcfbf9] border border-[#ded7c8] text-[#4e4a43] hover:border-[#c86d51] hover:text-[#c86d51] transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-[#fcfbf9] border-t border-[#e8e2d7] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${otherUserName}...`}
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#ded7c8] bg-[#faf8f5] focus:outline-none focus:ring-1 focus:ring-[#c86d51]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2 sm:px-4 sm:py-2 rounded-xl bg-[#c86d51] hover:bg-[#b0553b] text-white text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
