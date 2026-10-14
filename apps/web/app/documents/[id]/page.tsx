"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { documentApi, DocumentItem } from "@/api/documentApi";
import { searchApi, SearchChunkSource } from "@/api/searchApi";
import Navbar from "@/components/Navbar";
import {
  FileText,
  ArrowLeft,
  Send,
  Sparkles,
  Bot,
  User,
  Quote,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: SearchChunkSource[];
  timestamp: string;
}

export default function DocumentChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.id as string;

  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [answering, setAnswering] = useState(false);
  const [expandedSources, setExpandedSources] = useState<{ [msgId: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch document details
  useEffect(() => {
    async function loadDocument() {
      try {
        setLoadingDoc(true);
        const res = await documentApi.getDocs();
        const docs: DocumentItem[] = res?.data ?? [];
        const found = docs.find((d) => d.id === documentId);
        if (found) {
          setDocument(found);
          // Set initial greeting
          setMessages([
            {
              id: "welcome",
              sender: "ai",
              text: `Hello! I have indexed **${found.originalName}**. You can ask me any question about its contents, request a summary, or look up specific details.`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load document", err);
      } finally {
        setLoadingDoc(false);
      }
    }

    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, answering]);

  const handleAsk = async (queryText?: string) => {
    const textToAsk = queryText || question;
    if (!textToAsk.trim() || answering) return;

    const userMsgId = "user-" + Date.now();
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: textToAsk,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!queryText) setQuestion("");
    setAnswering(true);

    try {
      const res = await searchApi.searchDocument(documentId, textToAsk, 5);
      const data = res?.data;

      const aiMsgId = "ai-" + Date.now();
      const aiResponse: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: data?.answer || "I could not generate an answer based on this document.",
        sources: data?.source ?? [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: any) {
      console.error("Search query error", err);
      const errorMsg: ChatMessage = {
        id: "error-" + Date.now(),
        sender: "ai",
        text:
          err?.response?.data?.message ||
          "Sorry, an error occurred while searching this document. Please verify the AI service is active and the document has finished indexing.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setAnswering(false);
    }
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const starterQuestions = [
    "Summarize this document in 3 key bullet points",
    "What are the main topics discussed?",
    "Extract any critical data or findings mentioned",
  ];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/documents"
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate max-w-md sm:max-w-xl">
                  {document?.originalName || "Document Workspace"}
                </h1>
              </div>
              {document && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{formatFileSize(document.size)}</span>
                  <span>•</span>
                  <span>Uploaded {new Date(document.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span
                    className={`font-semibold ${
                      document.status === "READY"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {document.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([])}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Main Chat Workspace Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[550px]">
          {/* Left Column: Document Overview Sidebar */}
          <div className="hidden lg:flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm h-full">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Document Context
            </h3>

            {document ? (
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {document.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format</span>
                    <span className="font-semibold uppercase text-slate-700 dark:text-slate-200">
                      PDF Document
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensions</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      384-vector
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Prompt Ideas
                  </h4>
                  <div className="space-y-2">
                    {starterQuestions.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAsk(prompt)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Loading metadata...
              </div>
            )}
          </div>

          {/* Right Column: Chat Stream & Message Input */}
          <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex-1">
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[60vh] lg:max-h-[650px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm ${
                      msg.sender === "user"
                        ? "bg-slate-700 dark:bg-slate-600"
                        : "bg-gradient-to-tr from-indigo-600 to-violet-600"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-sm shadow-indigo-600/20"
                        : "bg-slate-100 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Sources & Citations if available */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700">
                        <button
                          onClick={() => toggleSources(msg.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <Quote className="w-3.5 h-3.5" />
                          <span>
                            {expandedSources[msg.id]
                              ? "Hide Sources"
                              : `View ${msg.sources.length} Cited Sources`}
                          </span>
                          {expandedSources[msg.id] ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {expandedSources[msg.id] && (
                          <div className="mt-3 space-y-2.5 animate-in fade-in duration-150">
                            {msg.sources.map((source, i) => (
                              <div
                                key={source.chunk_id || i}
                                className="p-3 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                              >
                                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                    Chunk #{source.chunk_index}
                                  </span>
                                  {source.similarity !== undefined && (
                                    <span className="bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-medium">
                                      {(source.similarity * 100).toFixed(1)}% match
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                                  "{source.content}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {msg.sender === "ai" && (
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:opacity-100 flex items-center gap-1"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {answering && (
                <div className="flex gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shrink-0 text-white shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/70 rounded-2xl rounded-tl-none p-4 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span>Searching vector chunks & generating answer...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a question about this document..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={answering}
                  className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || answering}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
