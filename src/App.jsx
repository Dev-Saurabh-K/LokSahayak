import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link } from "react-router-dom";

// --- Speech Recognition Setup ---
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
    { role: "bot", textKey: "initialBotMessage", ts: new Date() },
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Image State ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const recognitionRef = useRef(recognition);
  const endRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Cleanup image preview
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
      const response = await axios.post("https://servered-dc3x.onrender.com/user/chat", {
        user: input,
      });
      const botReply = response.data || t("noReplyReceived");
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botReply, ts: new Date() },
      ]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", textKey: "chatError", ts: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (fileToUpload) => {
    if (!fileToUpload) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", fileToUpload);

    try {
      const response = await axios.post(
        "https://servered-dc3x.onrender.com/user/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Image upload success:", response.data);
    } catch (error) {
      console.error("Image upload error:", error);
      setPreviewUrl(null);
      alert(t("imageUploadError", "Failed to upload image."));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(t("imageOnlyError", "Please select an image file."));
      return;
    }
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    uploadImage(file);
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
    currentRecognition.lang = languages[i18n.language]?.speechCode || "en-US";
    currentRecognition.onstart = () => setIsListening(true);
    currentRecognition.onend = () => setIsListening(false);
    currentRecognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setInput(transcript);
    };
    currentRecognition.onerror = (event) => {
      if (event.error === "not-allowed") alert("Microphone access required.");
      setIsListening(false);
    };
    currentRecognition.start();
  };

  const getNextLanguageName = () => {
    const nextLangKey = languages[i18n.language]?.next || "hi";
    return languages[nextLangKey]?.name || "English";
  };

  return (
    <div className="flex h-screen w-screen bg-emerald-50 overflow-hidden font-sans text-gray-600">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="hidden md:flex w-80 flex-col bg-white border-r border-emerald-100 shadow-lg z-20">
        <div className="p-6 flex flex-col gap-6 h-full">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold shadow-emerald-200 shadow-lg">
              LS
            </div>
            <div>
              <h2 className="m-0 text-emerald-800 font-bold text-lg leading-tight">{t("title")}</h2>
              <div className="text-xs text-gray-400">{t("docAssist")}</div>
            </div>
          </div>

          {/* Upload Section (Drag & Drop) */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-700 mb-2">{t("uploadTitle")}</h3>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 transition-all cursor-pointer text-center p-4 group">
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📤</div>
              <p className="text-sm font-medium text-emerald-700 m-0">Drag & drop file here</p>
              <span className="text-xs text-gray-400">or Click to browse</span>
            </label>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 overflow-hidden relative">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
                <div className="text-sm font-semibold text-emerald-700">{t("uploadingImage")}</div>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt={t("imagePreviewAlt")}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="h-full flex flex-col justify-center text-center p-2">
                <strong className="text-emerald-800 block mb-2">{t("docPreviewTitle")}</strong>
                <p className="text-xs leading-relaxed text-gray-500">{t("docPreviewBody")}</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-emerald-50 rounded-xl p-4 mt-auto">
            <div className="text-sm font-semibold text-emerald-700 mb-2">{t("tipsTitle")}</div>
            <ul className="text-xs text-gray-500 space-y-1 pl-4 list-disc">
              <li>{t("tip1")}</li>
              <li>{t("tip2")}</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* --- RIGHT MAIN AREA --- */}
      <main className="flex-1 flex flex-col h-full relative bg-white/50 backdrop-blur-sm">
        
        {/* Topbar */}
        <div className="h-16 border-b border-emerald-100 bg-white/80 backdrop-blur flex items-center justify-end px-6 gap-3 shrink-0 z-10">
          <Link to="/factchecker" className="mr-auto text-sm font-semibold text-emerald-700 hover:text-emerald-900 hover:underline transition-colors">
            Go to FactChecker
          </Link>

          <button onClick={toggleLanguage} className="px-4 py-2 rounded-xl border border-emerald-100 bg-white text-sm font-semibold text-gray-700 hover:bg-emerald-50 transition-colors shadow-sm">
            {getNextLanguageName()}
          </button>

          <div className="relative">
            <button onClick={() => setShowMenu((s) => !s)} className="w-10 h-10 rounded-xl border border-emerald-100 bg-white flex items-center justify-center hover:bg-emerald-50 cursor-pointer shadow-sm">
              ☰
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 w-40 bg-white border border-emerald-100 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col">
                <button onClick={() => { setShowHistory(true); setShowMenu(false); }} className="px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-b border-emerald-50">
                  {t("menuHistory")}
                </button>
                <button onClick={() => setShowMenu(false)} className="px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                  {t("menuProfile")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat History Modal (Overlay) */}
        {showHistory && (
          <div className="absolute inset-4 bg-white border border-emerald-200 rounded-2xl shadow-2xl z-50 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/30 rounded-t-2xl">
              <div className="font-semibold text-emerald-800">{t("historyTitle")}</div>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">✖</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 1 ? (
                <div className="text-center text-gray-400 mt-10">{t("historyEmpty")}</div>
              ) : (
                messages.slice(1).map((m, i) => (
                  <div key={i} className="flex justify-between items-center p-3 mb-2 bg-emerald-50 rounded-xl hover:bg-emerald-100/50 transition-colors">
                    <div className="text-sm text-gray-600 truncate flex-1 mr-4">{m.textKey ? t(m.textKey) : m.text}</div>
                    <button onClick={() => deleteMessage(i + 1)} className="text-gray-400 hover:text-red-500 transition-colors">🗑</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Chat Header */}
          <div className="px-6 py-4 bg-emerald-50/30 flex items-center gap-2 border-b border-emerald-50/50 shrink-0">
            <div className="font-bold text-gray-800">{t("chatTitle")}</div>
            <div className="text-xs text-gray-400 ml-2 pt-0.5">{t("chatSubtitle")}</div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs shadow-sm shrink-0">B</div>
                )}
                
                <div className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed relative group
                  ${m.role === "user" 
                    ? "bg-blue-50 text-blue-900 border border-blue-100 rounded-br-none" 
                    : "bg-emerald-50 text-gray-800 border border-emerald-100 rounded-bl-none"
                  }`}
                >
                  <div>{m.textKey ? t(m.textKey) : m.text}</div>
                  <div className={`text-[10px] mt-1.5 opacity-60 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.ts ? new Date(m.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                  </div>
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">Y</div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-end gap-3 justify-start animate-pulse">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">B</div>
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* INPUT AREA - UPDATED */}
        <div className="p-4 md:p-6 bg-white border-t border-emerald-100 shrink-0">
          <div className="bg-white border border-emerald-200 rounded-2xl p-2 flex items-center gap-2 shadow-lg shadow-emerald-100/50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            
            {/* Controls: Only Mic now, SVG added */}
            <div className="flex gap-1 pl-1">
              <button
                onClick={handleVoiceListen}
                disabled={!recognitionRef.current}
                className={`p-2 rounded-xl hover:bg-emerald-50 transition-colors ${
                  isListening ? "text-red-500 bg-red-50 animate-pulse ring-1 ring-red-200" : "text-gray-400 hover:text-emerald-600"
                }`}
                title={t(isListening ? "stopListening" : "startListening")}
              >
                {/* SVG MIC ICON */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </button>
              
              {/* CAMERA/UPLOAD FEATURE REMOVED FROM HERE */}
            </div>

            {/* Text Input */}
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 px-2 text-sm"
              placeholder={t("placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
              disabled={loading}
            />

            {/* Send Button: SVG added */}
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-2.5 font-semibold text-sm transition-all shadow-md shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                // SVG SEND ICON (Paper Airplane)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 -ml-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}