import { AppError } from "../../utils/appError.js";
import { asyncWrapper } from "../../utils/asyncwrapper.js";
import { searchservice } from "./search.service.js";

export const searchDocument = asyncWrapper(async(req,res)=>{
    const { documentId, question, limit } = req.body;
     if (!documentId) {
    throw new AppError(400, "documentId is required");
  }

  if (!question) {
    throw new AppError(400, "question is required");
  }

  const result = await searchservice.searchDocument(
    documentId,
    question,
    limit
  );

  res.json({
    success: true,
    data: result,
  });
})