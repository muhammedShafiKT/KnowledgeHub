"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { documentApi, DocumentItem } from "@/api/documentApi";
import { searchApi, SearchResponse, SearchChunkSource } from "@/api/searchApi";
import Navbar from "@/components/Navbar";
import {
  Search,
  Sparkles,
  FileText,
  Quote,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Layers,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [query, setQuery] = useState(initialQuery);
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await documentApi.getDocs();
        const docs: DocumentItem[] = res?.data ?? [];
        setDocuments(docs);
        if (docs.length > 0) {
          // Default to first ready document or first document
          const ready = docs.find((d) => d.status === "READY");
          setSelectedDocId(ready ? ready.id : docs[0].id);
        }
      } catch (err) {
        console.error("Failed to load documents for search", err);
      }
    }
    loadDocs();
  }, []);

  // If query was passed in URL, trigger search once docs are loaded
  useEffect(() => {
    if (initialQuery && selectedDocId && !result && !searching) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, selectedDocId]);

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim() || !selectedDocId) return;

    setSearching(true);
    setError(null);
    setResult(null);

    try {
      const res = await searchApi.searchDocument(selectedDocId, q, 5);
      setResult(res?.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to execute semantic search. Make sure the document is ready and the AI service is online."
      );
    } finally {
      setSearching(false);
    }
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Vector Search & RAG
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Ask Your Knowledge Base
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Retrieve answers grounded directly in your uploaded PDF documents with exact similarity matches.
          </p>
        </div>

        {/* Search Controls Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Target Document Selector */}
            <div className="sm:w-1/3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Search Target
              </label>
              <div className="relative">
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {documents.length === 0 ? (
                    <option value="">No documents available</option>
                  ) : (
                    documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.originalName} ({doc.status})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Question Input */}
            <div className="sm:w-2/3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Question or Query
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="relative flex items-center"
              >
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g., What are the terms of the agreement?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={searching || !query.trim() || !selectedDocId}
                  className="absolute right-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {searching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Search</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {selectedDoc && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>Searching: <strong>{selectedDoc.originalName}</strong></span>
              </div>
              <Link
                href={`/documents/${selectedDoc.id}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open in Chat Workspace</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Container */}
        {searching ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Extracting relevant chunks & generating answer...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Executing vector similarity search against 384-dimensional embeddings.
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* AI Synthesized Answer Card */}
            <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-6 md:p-8 shadow-md">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                AI Generated Answer
              </div>

              <div className="text-base md:text-lg text-slate-900 dark:text-slate-100 leading-relaxed font-normal whitespace-pre-wrap">
                {result.answer}
              </div>
            </div>

            {/* Retrieved Sources Section */}
            {result.source && result.source.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Quote className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Retrieved Knowledge Chunks ({result.source.length})
                </h3>

                <div className="space-y-3">
                  {result.source.map((chunk, idx) => (
                    <div
                      key={chunk.chunk_id || idx}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          Chunk #{chunk.chunk_index}
                        </span>
                        {chunk.similarity !== undefined && (
                          <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
                            {(chunk.similarity * 100).toFixed(1)}% similarity
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Prompt Starter State */
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              Select a document and ask a question
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our AI service will semantically locate relevant paragraphs and synthesize a grounded answer.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
