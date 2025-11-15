import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link } from "react-router-dom";

// ... (SpeechRecognition setup remains the same)
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

  // --- State for Image Upload ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  // ------------------------------------

  const messagesRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // --- useEffect for Image Preview Cleanup ---
  useEffect(() => {
    // Cleanup function to revoke the object URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  // -------------------------------------------

  const toggleLanguage = () => {
    // ... (function remains the same)
    const currentLang = i18n.language;
    const nextLang = languages[currentLang]?.next || "en";
    i18n.changeLanguage(nextLang);
  };

  const sendMessage = async () => {
    // ... (function remains the same)
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", text: trimmed, ts: new Date() };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("https://servered-dc3x.onrender.com/user/chat", {
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

  // --- Function to Upload Image ---
  const uploadImage = async (fileToUpload) => {
    if (!fileToUpload) return;

    setIsUploading(true);
    const formData = new FormData();
    // 'image' is the field name your multer backend expects
    formData.append("image", fileToUpload);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image upload success:", response.data);
      // You could optionally send a chat message here
    } catch (error) {
      console.error("Image upload error:", error);
      // You could set an error message to display in the preview area
      setPreviewUrl(null); // Clear preview on error
      alert(t("imageUploadError", "Failed to upload image."));
    } finally {
      setIsUploading(false);
    }
  };
  // ------------------------------------

  // --- Function to Handle File Selection ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert(t("imageOnlyError", "Please select an image file."));
      return;
    }

    setSelectedFile(file);

    // Clean up previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create a new preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);

    // Upload the image immediately
    uploadImage(file);
  };
  // -------------------------------------------

  const deleteMessage = (idx) => {
    // ... (function remains the same)
    setMessages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleVoiceListen = () => {
    // ... (function remains the same)
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
    // ... (function remains the same)
    const nextLangKey = languages[i18n.language]?.next || "hi";
    return languages[nextLangKey]?.name || "English";
  };

  return (
    <div className="app-wrap">
      <aside className="left">
        <div className="brand">
          {/* ... (brand section remains the same) */}
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
          {/* --- Updated File Input --- */}
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>

        {/* --- Updated Preview Area --- */}
        <div className="doc-placeholder" aria-live="polite">
          {isUploading ? (
            <div>{t("uploadingImage", "Uploading...")}</div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt={t("imagePreviewAlt", "Image preview")}
              style={{
                width: "100%", // <--- THIS WAS THE FIX
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          ) : (
            <>
              <strong>{t("docPreviewTitle")}</strong>
              <p style={{ marginTop: 10 }}>{t("docPreviewBody")}</p>
            </>
          )}
        </div>
        {/* --------------------------- */}

        <div
          style={{
            marginTop: "auto",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          {/* ... (tips section remains the same) */}
          <div style={{ marginBottom: 6 }}>{t("tipsTitle")}</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            <li>{t("tip1")}</li>
            <li>{t("tip2")}</li>
          </ul>
        </div>
      </aside>

      <main className="right">
        {/* ... (topbar, menu, and history modal remain the same) */}
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

        {/* ... (chat header and messages remain the same) */}
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
                {/* --- Updated File Input --- */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="input-field" role="search">
              {/* ... (text input remains the same) */}
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
      <Link to="/factchecker"><h1>Go to FactChecker</h1></Link>
      
    </div>
  );
}