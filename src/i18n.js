import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// The translation strings
const resources = {
  en: {
    translation: {
      title: "LokSahayak",
      docAssist: "Document Assistant",
      uploadTitle: "Upload Document",
      docPreviewTitle: "Document preview",
      docPreviewBody:
        "After you upload a document, its text will appear here and you can ask questions about it in the chat.",
      tipsTitle: "Tips",
      tip1: "Upload PDFs or images",
      tip2: 'Try: "Summarize the document"',
      menuHistory: "History",
      menuProfile: "Profile",
      historyTitle: "Conversation history",
      historyEmpty: "No messages",
      chatTitle: "Chat",
      chatSubtitle: "Ask questions about your document",
      initialBotMessage:
        "Hi! Upload a document on the left and ask questions about it.",
      demoBotReply: "This is an automated reply. Replace with your AI call.",
      micTitle: "Voice",
      imgTitle: "Upload image",
      placeholder: "Type your message...",
      send: "Send",
      stopListening: "Stop listening",
      startListening: "Start listening",
    },
  },
  hi: {
    translation: {
      title: "लोक सहायक",
      docAssist: "दस्तावेज़ सहायक",
      uploadTitle: "दस्तावेज़ अपलोड करें",
      docPreviewTitle: "दस्तावेज़ पूर्वावलोकन",
      docPreviewBody:
        "दस्तावेज़ अपलोड करने के बाद, उसका टेक्स्ट यहाँ दिखाई देगा और आप चैट में उसके बारे में प्रश्न पूछ सकते हैं।",
      tipsTitle: "सुझाव",
      tip1: "पीडीएफ या छवियां अपलोड करें",
      tip2: 'प्रयास करें: "दस्तावेज़ को सारांशित करें"',
      menuHistory: "इतिहास",
      menuProfile: "प्रोफ़ाइल",
      historyTitle: "बातचीत का इतिहास",
      historyEmpty: "कोई संदेश नहीं",
      chatTitle: "चैट",
      chatSubtitle: "अपने दस्तावेज़ के बारे में प्रश्न पूछें",
      initialBotMessage:
        "नमस्ते! बाईं ओर एक दस्तावेज़ अपलोड करें और उसके बारे में प्रश्न पूछें।",
      demoBotReply:
        "यह एक स्वचालित उत्तर है। इसे अपने एआई कॉल से बदलें।",
      micTitle: "आवाज़",
      imgTitle: "छवि अपलोड करें",
      placeholder: "अपना संदेश टाइप करें...",
      send: "भेजें",
      stopListening: " सुनना बंद करें",
      startListening: "सुनना शुरू करें",
    },
  },
  // === NEW LANGUAGE ADDED HERE ===
  bn: {
    translation: {
      title: "লোক সহায়ক",
      docAssist: "ডকুমেন্ট অ্যাসিস্ট্যান্ট",
      uploadTitle: "ডকুমেন্ট আপলোড করুন",
      docPreviewTitle: "ডকুমেন্ট প্রিভিউ",
      docPreviewBody:
        "আপনি একটি ডকুমেন্ট আপলোড করার পরে, তার টেক্সট এখানে উপস্থিত হবে এবং আপনি চ্যাটে এটি সম্পর্কে প্রশ্ন জিজ্ঞাসা করতে পারেন।",
      tipsTitle: "টিপস",
      tip1: "পিডিএফ বা ছবি আপলোড করুন",
      tip2: 'চেষ্টা করুন: "ডকুমেন্টটি সংক্ষিপ্ত করুন"',
      menuHistory: "ইতিহাস",
      menuProfile: "প্রোফাইল",
      historyTitle: "কথোপকথনের ইতিহাস",
      historyEmpty: "কোনো মেসেজ নেই",
      chatTitle: "চ্যাট",
      chatSubtitle: "আপনার ডকুমেন্ট সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন",
      initialBotMessage:
        "হাই! বাম দিকে একটি ডকুমেন্ট আপলোড করুন এবং এটি সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন।",
      demoBotReply: "এটি একটি স্বয়ংক্রিয় উত্তর। আপনার এআই কল দিয়ে প্রতিস্থাপন করুন।",
      micTitle: "ভয়েস",
      imgTitle: "ছবি আপলোড করুন",
      placeholder: "আপনার বার্তা টাইপ করুন...",
      send: "পাঠান",
      stopListening: "শোনা বন্ধ করুন",
      startListening: "শোনা শুরু করুন",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;