import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import axios from "axios";


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false;
}


const languages = {
  en: { next: "hi", name: "English", speechCode: "en-US" },
  hi: { next: "bn", name: "हिन्दी", speechCode: "hi-IN" },
  bn: { next: "en", name: "বাংলা", speechCode: "bn-IN" },
};

export default function App() {
  const { t, i18n } = useTranslation();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      textKey: "initialBotMessage",
      ts: new Date(),
    },
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(recognition);

  const [loading, setLoading] = useState(false);

  const messagesRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const nextLang = languages[currentLang]?.next || "en";
    i18n.changeLanguage(nextLang);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", text: trimmed, ts: new Date() };

    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); 

    try {
      
      const response = await axios.post("http://localhost:3000/user/chat", {
        user: input, 
        
      });

      
      const botReply = response.data || t("noReplyReceived"); 

      const botMessage = {
        role: "bot",
        text: botReply, 
        ts: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API error:", error);

      const errorMessage = {
        role: "bot",
        textKey: "chatError", 
        ts: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false); 
    }
  };

  const deleteMessage = (idx) => {
    setMessages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleVoiceListen = () => {
    const currentRecognition = recognitionRef.current;
    if (!currentRecognition) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }

    if (isListening) {
      currentRecognition.stop();
      return;
    }

    
    const currentLangCode = i18n.language;
    currentRecognition.lang =
      languages[currentLangCode]?.speechCode || "en-US";

    currentRecognition.onstart = () => {
      setIsListening(true);
    };
    currentRecognition.onend = () => {
      setIsListening(false);
    };
    currentRecognition.onresult = (event) => {
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript.trim();
      setInput(transcript);
    };
    currentRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        alert("You must allow microphone access to use this feature.");
      }
      setIsListening(false);
    };

    currentRecognition.start();
  };

  const getNextLanguageName = () => {
    const nextLangKey = languages[i18n.language]?.next || "hi";
    return languages[nextLangKey]?.name || "English";
  };

  return (
    <div className="app-wrap">
      <aside className="left">
        <div className="brand">
          <div className="logo">LS</div>
          <div>
            <h2>{t("title")}</h2>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {t("docAssist")}
            </div>
          </div>
        </div>

        <h3>{t("uploadTitle")}</h3>
        <div className="file-input">
          <input type="file" />
        </div>

        <div className="doc-placeholder" aria-live="polite">
          <strong>{t("docPreviewTitle")}</strong>
          <p style={{ marginTop: 10 }}>{t("docPreviewBody")}</p>
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          <div style={{ marginBottom: 6 }}>{t("tipsTitle")}</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            <li>{t("tip1")}</li>
            <li>{t("tip2")}</li>
          </ul>
        </div>
      </aside>

      
      <main className="right">
        {/* top menu */}
        <div className="topbar" role="toolbar" aria-label="top controls">
          <button className="lang-btn" onClick={toggleLanguage}>
            {getNextLanguageName()}
          </button>

          <div className="menu-button" onClick={() => setShowMenu((s) => !s)}>
            ☰
          </div>

          {showMenu && (
            <div className="dropdown" role="menu">
              <button
                onClick={() => {
                  setShowHistory(true);
                  setShowMenu(false);
                }}
              >
                {t("menuHistory")}
              </button>
              <button onClick={() => setShowMenu(false)}>
                {t("menuProfile")}
              </button>
            </div>
          )}
        </div>

       
        {showHistory && (
          <div className="history-modal" role="dialog" aria-modal="true">
            <div className="history-header">
              <div>{t("historyTitle")}</div>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
            <div className="history-list">
              {messages.length === 1 ? (
                <div>{t("historyEmpty")}</div>
              ) : (
                messages
                  .slice(1)
                  .map((m, i) => (
                    <div key={i} className="history-card">
                      <div style={{ flex: 1, fontSize: 13 }}>
                        {m.textKey ? t(m.textKey) : m.text}
                      </div>
                      <div>
                        <button
                          onClick={() => deleteMessage(i + 1)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        
        <div className="chat">
          <div className="chat-header">
            <div style={{ fontWeight: 700 }}>{t("chatTitle")}</div>
            <div
              style={{
                marginLeft: 8,
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              {t("chatSubtitle")}
            </div>
          </div>

         
          <div className="messages-wrap">
            <div className="messages" ref={messagesRef} aria-live="polite">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`row ${m.role === "user" ? "user" : "bot"}`}
                >
                  {m.role === "bot" && <div className="avatar">B</div>}
                  <div className={`bubble ${m.role === "user" ? "user" : ""}`}>
                    <div>{m.textKey ? t(m.textKey) : m.text}</div>
                    <div className="meta">
                      {m.ts ? new Date(m.ts).toLocaleTimeString() : ""}
                    </div>
                  </div>
                  {m.role === "user" && (
                    <div
                      className="avatar"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent), #0056b3)",
                        color: "#ffffff",
                      }}
                    >
                      Y
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="row bot">
                  <div className="avatar">B</div>
                  <div className="bubble">
                    <div>{t("botTyping", "...")}</div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
        </div>

        
        <div className="input-bar-outer" aria-hidden={false}>
          <div className="input-card">
            <div className="controls">
              <button
                className={`icon-btn ${isListening ? "listening" : ""}`}
                title={t(isListening ? "stopListening" : "startListening")}
                onClick={handleVoiceListen}
                disabled={!recognitionRef.current}
              >
                🎤
              </button>
              <label
                className="icon-btn"
                title={t("imgTitle")}
                style={{ cursor: "pointer" }}
              >
                📷
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className="input-field" role="search">
              <input
                type="text"
                placeholder={t("placeholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !loading && sendMessage()
                }
                disabled={loading}
                aria-label="Message"
              />
            </div>

            <button
              className="send-btn"
              onClick={sendMessage}
              aria-label={t("send")}
              disabled={loading}
            >
              {loading ? t("sending", "...") : t("send")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}