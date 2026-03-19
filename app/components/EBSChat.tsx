"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface QuickReply {
  label: string;
  value: string;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#e1a730,#f0c040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>✂</div>
      <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: 4, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 6, height: 6, background: "#e1a730", borderRadius: "50%", display: "inline-block", animation: "ebs-bounce 1.4s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

export default function EBSChat({ clientId = "ebs-barbers" }: { clientId?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [hasOpened, setHasOpened] = useState(false);
  const [showNotif, setShowNotif] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);
  const sessionIdRef = useRef<string>(uid() + uid());

  const logMessage = useCallback(async (role: "user" | "assistant", content: string) => {
    try {
      await fetch("https://www.zempotis.com/api/chat-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          session_id: sessionIdRef.current,
          role,
          content,
          page_url: window.location.href,
        }),
      });
    } catch (err) {
      console.error("[EBS CHAT LOG ERROR]", err);
    }
  }, [clientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !hasOpened) {
      setHasOpened(true);
      setShowNotif(false);
      const greeting = "Hi there! ✂️ Welcome to EBS Barbers. I'm here to help you with bookings, services, and any questions you have.\n\nHow can I help you today?";
      setMessages([{ id: uid(), role: "assistant", content: greeting, time: now() }]);
      historyRef.current = [{ role: "assistant", content: greeting }];
      setQuickReplies([
        { label: "Book an appointment", value: "I'd like to book an appointment" },
        { label: "View services", value: "What services do you offer?" },
        { label: "Opening hours", value: "What are your opening hours?" },
        { label: "Find you", value: "Where are you located?" },
      ]);
      logMessage("assistant", greeting);
    }
  }, [open, hasOpened, logMessage]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;

    setInput("");
    setQuickReplies([]);

    const userMsg: Message = { id: uid(), role: "user", content: msg, time: now() };
    setMessages((m) => [...m, userMsg]);
    historyRef.current = [...historyRef.current, { role: "user", content: msg }];
    logMessage("user", msg);
    setLoading(true);

    try {
      // ── Points to the EBS Barbers specific route on Zempotis ──
      const res = await fetch(`https://www.zempotis.com/api/client/${clientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");

      // ── Uses data.reply from the client route ──
      const botMsg: Message = { id: uid(), role: "assistant", content: data.reply, time: now() };
      setMessages((m) => [...m, botMsg]);
      historyRef.current = [...historyRef.current, { role: "assistant", content: data.reply }];
      logMessage("assistant", data.reply);
    } catch {
      setMessages((m) => [...m, {
        id: uid(), role: "assistant", time: now(),
        content: "Sorry, something went wrong. Please call us directly or pop in!",
      }]);
    }

    setLoading(false);
  }, [input, loading, logMessage, clientId]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{`
        @keyframes ebs-bounce { 0%,60%,100%{transform:translateY(0);opacity:.35} 30%{transform:translateY(-5px);opacity:1} }
        @keyframes ebs-in { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes ebs-window { from{opacity:0;transform:translateY(16px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes ebs-pulse { 0%,70%,100%{transform:scale(1)} 35%{transform:scale(1.35)} }
        .ebs-msg { animation: ebs-in .25s cubic-bezier(.34,1.56,.64,1) both; }
        .ebs-qr:hover { background:rgba(225,167,48,0.15)!important; border-color:rgba(225,167,48,0.5)!important; color:#e1a730!important; }
        .ebs-trigger:hover { transform:scale(1.08)!important; box-shadow:0 14px 40px rgba(225,167,48,.5),0 4px 12px rgba(0,0,0,.4)!important; }
        .ebs-send:hover { opacity:.88; }
        .ebs-send:active { transform:scale(.93); }
        .ebs-input-wrap:focus-within { border-color:#e1a730!important; box-shadow:0 0 0 3px rgba(225,167,48,.15)!important; }
      `}</style>

      {/* Trigger */}
      <button
        className="ebs-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 58, height: 58, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg,#e1a730 0%,#f0c040 100%)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(225,167,48,0.45), 0 2px 8px rgba(0,0,0,0.4)",
          transition: "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease",
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {showNotif && (
              <span style={{
                position: "absolute", top: 2, right: 2,
                width: 12, height: 12, borderRadius: "50%",
                background: "#ef4444", border: "2px solid #111",
                animation: "ebs-pulse 3s ease-in-out 2s infinite",
              }} />
            )}
          </>
        )}
      </button>

      {/* Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 98, right: 28, zIndex: 9998,
          width: 380, maxWidth: "calc(100vw - 40px)",
          height: 560, maxHeight: "calc(100vh - 130px)",
          background: "#0a0a0a", borderRadius: 20,
          border: "1px solid rgba(225,167,48,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(225,167,48,0.05)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "ebs-window .3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
            background: "linear-gradient(135deg,#111 0%,#1a1200 100%)",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#e1a730,#f0c040)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>✂</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-heading, serif)", fontWeight: 700, fontSize: 14, color: "#e1a730", letterSpacing: "0.05em" }}>EBS BARBERS</div>
              <div style={{ fontSize: 11.5, color: "#888", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "block" }} />
                Online · replies instantly
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "1.25rem", lineHeight: 1 }}
            >×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m) => (
              <div key={m.id} className="ebs-msg" style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", gap: 2 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: m.role === "assistant" ? "linear-gradient(135deg,#e1a730,#f0c040)" : "rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: m.role === "assistant" ? 12 : 11, fontWeight: 700, color: m.role === "assistant" ? "#111" : "#888",
                  }}>
                    {m.role === "assistant" ? "✂" : "U"}
                  </div>
                  <div style={{
                    maxWidth: "78%", padding: "10px 14px",
                    borderRadius: m.role === "assistant" ? "14px 14px 14px 4px" : "14px 14px 4px 14px",
                    background: m.role === "assistant" ? "#1a1a1a" : "linear-gradient(135deg,#e1a730,#f0c040)",
                    border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                    fontSize: 13.5, color: m.role === "assistant" ? "#e5e5e5" : "#111",
                    lineHeight: 1.65, wordBreak: "break-word",
                  }}>
                    {m.content.split("\n").map((line, i) => (
                      <span key={i}>{line}{i < m.content.split("\n").length - 1 && <br />}</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#555", textAlign: m.role === "user" ? "right" : "left", marginLeft: m.role === "assistant" ? 34 : 0, marginRight: m.role === "user" ? 34 : 0 }}>
                  {m.time}
                </div>
              </div>
            ))}

            {loading && <TypingDots />}

            {quickReplies.length > 0 && !loading && (
              <div className="ebs-msg" style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingLeft: 34 }}>
                {quickReplies.map((qr) => (
                  <button
                    key={qr.value}
                    className="ebs-qr"
                    onClick={() => { setQuickReplies([]); sendMessage(qr.value); }}
                    style={{
                      padding: "6px 13px", borderRadius: 999,
                      border: "1.5px solid rgba(225,167,48,0.3)", background: "transparent",
                      color: "#e1a730", fontSize: 12.5, cursor: "pointer",
                      transition: "all 150ms ease", whiteSpace: "nowrap",
                    }}
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
            <div
              className="ebs-input-wrap"
              style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14,
                padding: "10px 12px", background: "#111",
                transition: "border-color 200ms ease, box-shadow 200ms ease",
              }}
            >
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                }}
                onKeyDown={handleKey}
                placeholder="Ask us anything…"
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  resize: "none", fontSize: 14, color: "#e5e5e5", lineHeight: 1.5, maxHeight: 96,
                }}
                aria-label="Message"
              />
              <button
                className="ebs-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: 34, height: 34, borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#e1a730,#f0c040)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, opacity: input.trim() && !loading ? 1 : 0.4,
                  transition: "opacity 150ms ease, transform 150ms ease",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#444", marginTop: 8 }}>
              Powered by <strong style={{ color: "#e1a730" }}>Zempotis AI</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
}