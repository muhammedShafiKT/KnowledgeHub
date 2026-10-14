import { API } from "./api";

export interface SearchChunkSource {
  chunk_id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  similarity: number;
}

export interface SearchResponse {
  success: boolean;
  question: string;
  answer: string;
  source: SearchChunkSource[];
}

export const searchApi = {
  searchDocument: (
    documentId: string,
    question: string,
    limit: number = 5
  ): Promise<{ success: boolean; data: SearchResponse }> => {
    return API.post("search/document", {
      documentId,
      question,
      limit,
    }).then((res) => res.data);
  },
};
