import React, { useState } from "react";
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Wrench,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        id="neighborhood-chat-modal"
        className="w-full max-w-xl bg-[#faf9f6] border-3 border-black rounded-3xl shadow-[8px_8px_0px_#000] overflow-hidden my-6 h-145 flex flex-col text-left animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b-2 border-black flex items-center justify-between bg-[#ffc900] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000]">
              {otherUserName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-black text-sm sm:text-base leading-tight">
                  {otherUserName}
                </h3>
                <span className="w-4 h-4 rounded-full bg-[#bbf7d0] border border-black flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-black stroke-[2.5]" />
                </span>
              </div>
              <p className="text-[11px] font-bold text-black/70">
                Verified Neighbor • Secure Local Chat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-black bg-white hover:bg-[#ff90e8] text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Close chat"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Tool Banner if coordinating for a specific tool */}
        {activeToolTitle && (
          <div className="px-5 py-2.5 bg-[#ff90e8] border-b-2 border-black flex items-center justify-between text-xs font-bold text-black shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Wrench className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span className="truncate">
                Coordinating for: <strong className="underline underline-offset-2">{activeToolTitle}</strong>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white border border-black text-[10px] font-black uppercase tracking-wider shrink-0 shadow-[1px_1px_0px_#000]">
              In-App Safe Chat
            </span>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#faf9f6]">
          {currentThread.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ffc900] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black mb-3">
                <MessageSquare className="w-6 h-6 stroke-[2.5]" />
              </div>
              <p className="text-sm font-black text-black">
                Start coordinating with {otherUserName}
              </p>
              <p className="text-xs font-medium text-black/70 max-w-xs mt-1">
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
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold leading-relaxed border-2 border-black shadow-[2.5px_2.5px_0px_#000] ${
                      isMe
                        ? "bg-[#ffc900] text-black rounded-br-xs"
                        : "bg-white text-black rounded-bl-xs"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-black/60 px-1 mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Coordination Chips */}
        <div className="px-4 py-2 bg-white border-t-2 border-black overflow-x-auto flex gap-2 scrollbar-none shrink-0">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="text-[11px] font-bold whitespace-nowrap px-3 py-1.5 rounded-full bg-[#faf9f6] border-2 border-black text-black hover:bg-[#ffc900] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-[#faf9f6] border-t-2 border-black flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${otherUserName}...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border-2 border-black bg-white text-black placeholder:text-black/40 font-medium focus:outline-none focus:shadow-[2px_2px_0px_#000] transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl border-2 border-black bg-[#ff90e8] hover:bg-[#ff7be3] text-black text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
