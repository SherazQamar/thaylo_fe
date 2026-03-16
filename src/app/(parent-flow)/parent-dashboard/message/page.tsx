"use client";

import Image from "next/image";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const contacts = [
  { name: "Sarah Johnson", time: "12:01pm", message: "Thanks, I can't wait to see you tomorrow for coffee!", avatar: "/assets/wayfinder Em.png", unread: 0, active: true },
  { name: "Jane Carr", time: "11:54am", message: "I can't join, sorry! Have Fun!", avatar: "/assets/wayfinder Em.png", unread: 1, active: false },
  { name: "Kaiya Levin", time: "11:22pm", message: "Have you seen Janes new dog???????", avatar: "/assets/wayfinder Em.png", unread: 1, active: false },
  { name: "Wayfinder", time: "10:45am", message: "Alex did very well today in reading.", avatar: "/assets/wayfinder-symbol.png", unread: 0, active: false },
  { name: "Fatima", time: "9:30am", message: "Mom, I learned new words today!", avatar: "/assets/wayfinder Em.png", unread: 0, active: false },
  { name: "Bloom Buddy", time: "Yesterday", message: "I feel good today! 🌱", avatar: "/assets/wayfinder-symbol.png", unread: 2, active: false },
  { name: "Ali's Teacher", time: "Yesterday", message: "Ali is doing great in math!", avatar: "/assets/wayfinder Em.png", unread: 0, active: false },
];

const chatMessages = [
  { sender: "Mom", avatar: "/assets/wayfinder Em.png", text: "Hi Wayfinder, how is Fatima doing in her reading lessons?", isUser: true, role: "mom" },
  { sender: "Wayfinder", avatar: "/assets/wayfinder-symbol.png", text: "Hi Mom! Fatima has been making great progress. She completed 3 reading modules this week and her comprehension scores are improving.", isUser: false, role: "wayfinder" },
  { sender: "Mom", avatar: "/assets/wayfinder Em.png", text: "That's wonderful to hear! Is there anything I can do to help her at home?", isUser: true, role: "mom" },
  { sender: "Wayfinder", avatar: "/assets/wayfinder-symbol.png", text: "Great question! Reading together for 15 minutes before bed can really boost her confidence. Focus on stories she enjoys.", isUser: false, role: "wayfinder" },
  { sender: "Fatima", avatar: "/assets/wayfinder Em.png", text: "Mom! I learned about main ideas today! My favorite word is \"gleaming\"!", isUser: false, role: "student" },
  { sender: "Mom", avatar: "/assets/wayfinder Em.png", text: "That's amazing, sweetie! I'm so proud of you. Keep up the great work!", isUser: true, role: "mom" },
  { sender: "Wayfinder", avatar: "/assets/wayfinder-symbol.png", text: "Fatima has been very engaged today. Her vocabulary retention is above average for her grade level.", isUser: false, role: "wayfinder" },
  { sender: "Mom", avatar: "/assets/wayfinder Em.png", text: "Thank you for the update. We'll practice more at home this weekend!", isUser: true, role: "mom" },
];

export default function ParentMessagePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-4 md:py-5 flex-shrink-0">
        <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
          Message
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex mx-4 md:mx-6 lg:mx-10 mb-4 md:mb-6 rounded-[12px] overflow-hidden" style={{ backgroundColor: "#1a1930" }}>
        {/* Left - Contact List (hidden on mobile) */}
        <div className="hidden md:flex w-[280px] flex-shrink-0 border-r border-white/10 flex-col">
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-[10px] px-3 py-2.5" style={{ backgroundColor: "#313044" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="text" placeholder="Search" className="bg-transparent outline-none text-white/80 placeholder-white/40 w-full" style={{ ...inter, fontWeight: 400, fontSize: "14px" }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-white/5 ${contact.active ? "bg-white/10" : "hover:bg-white/5"}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={contact.avatar} alt={contact.name} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{contact.name}</p>
                    <span style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "16px", color: "#00CED1" }}>{contact.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="truncate" style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "160px" }}>{contact.message}</p>
                    {contact.unread > 0 && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EF4444", ...inter, fontWeight: 600, fontSize: "10px", color: "#FFFFFF" }}>{contact.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Chat */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-b border-white/10 gap-2">
            <div>
              <p style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "24px", color: "#FFFFFF" }}>Group Chat</p>
              <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>Mom, Wayfinder, Fatima</p>
            </div>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <p style={{ ...inter, fontWeight: 400, fontSize: "11px", lineHeight: "16px", color: "rgba(255,255,255,0.4)" }}>This chat is for lesson updates and learning-related discussion only.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col gap-4">
            <p className="text-center" style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.4)" }}>Today 10:27am</p>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"} gap-2`}>
                {!msg.isUser && msg.avatar && (
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex-shrink-0 mt-5">
                    <Image src={msg.avatar} alt={msg.sender} width={36} height={36} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`max-w-[85%] md:max-w-[420px] ${msg.isUser ? "items-end" : "items-start"} flex flex-col`}>
                  {!msg.isUser && (
                    <span className="rounded-full px-2.5 py-0.5 mb-1" style={{ ...inter, fontWeight: 600, fontSize: "11px", lineHeight: "16px", color: "#FFFFFF", backgroundColor: msg.role === "wayfinder" ? "#00CED1" : "#525162" }}>{msg.sender}</span>
                  )}
                  <div className="rounded-[16px] px-3 md:px-4 py-2 md:py-2.5" style={{ backgroundColor: msg.isUser ? "#313044" : "#00CED1", ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: msg.isUser ? "#FFFFFF" : "#111023" }}>{msg.text}</div>
                </div>
              </div>
            ))}

            {/* Help prompt */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="rounded-[16px] px-3 md:px-4 py-2 md:py-2.5" style={{ backgroundColor: "#313044" }}>
                <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "#FFFFFF" }}>
                  Need help? Say <span style={{ color: "#00CED1", fontWeight: 600 }}>&quot;Wayfinder&quot;</span>
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-5 py-3 md:py-3.5 border-t border-white/10 flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <div className="flex-1 rounded-[10px] px-4 py-2.5" style={{ backgroundColor: "#313044" }}>
              <input type="text" placeholder="Message" className="bg-transparent outline-none text-white/80 placeholder-white/40 w-full" style={{ ...inter, fontWeight: 400, fontSize: "14px" }} />
            </div>
            <button className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
