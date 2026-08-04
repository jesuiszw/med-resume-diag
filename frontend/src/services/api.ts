import axios from 'axios';
import type { AnalysisResult, ExpectedDirection } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Uploads a .docx resume file and the selected expected direction to the backend,
 * then receives the full analysis result.
 *
 * @param file - The .docx file to upload
 * @param direction - The expected career direction
 * @returns The complete analysis result
 */
export async function uploadAndAnalyze(
  file: File,
  direction: ExpectedDirection
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('direction', direction);

  const response = await axios.post<{ result: AnalysisResult }>(
    `${API_BASE_URL}/analyze`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes timeout for multiple LLM calls
    }
  );

  return response.data.result;
}
