import { aiService } from "../documents/ai.service.js";

export const searchservice={
     searchDocument: async (
    documentId: string,
    question: string,
    limit: number = 5
  ) => {
    return await aiService.search_document(
      documentId,
      question,
      limit
    );
}

}