import { Router, Request, Response } from 'express';
import multer from 'multer';
import { parseDocx } from '../services/docxParser';
import { analyzeResume } from '../services/ruleEngineService';
import { matchJobs } from '../services/jobMatchService';
import { searchJobMarket } from '../services/webScrapeService';
import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import type { AnalysisResult } from '../types';

const router = Router();

/**
 * Multer configuration for file upload.
 * - Memory storage (no disk persistence)
 * - 10MB file size limit
 * - Only .docx files accepted
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.docx'];
    const fileExt = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (allowedExtensions.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 .docx 格式的 Word 文件'));
    }
  },
});

/**
 * Validates that the direction parameter is a valid ExpectedDirection value.
 *
 * @param direction - The direction string to validate
 * @returns True if valid, false otherwise
 */
function isValidDirection(direction: string): direction is ExpectedDirection {
  return Object.values(ExpectedDirection).includes(direction as ExpectedDirection);
}

/**
 * POST /api/analyze
 *
 * Receives a .docx resume file and an expected direction, then:
 * 1. Parses the Word document to extract text and structured data
 * 2. Runs rule-based analysis (suggestions + scores + job matching in parallel)
 * 3. Searches job market information (web scrape with database fallback)
 * 4. Returns the aggregated analysis result
 *
 * Request:
 *   - multipart/form-data
 *   - field "file": .docx file
 *   - field "direction": ExpectedDirection enum value
 *
 * Response:
 *   - 200: { result: AnalysisResult }
 *   - 400: { error: string } (invalid input)
 *   - 500: { error: string } (processing error)
 */
router.post('/analyze', upload.single('file'), async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: '请上传简历文件 (.docx)' });
    }

    // Validate direction parameter
    const directionParam = req.body.direction;
    if (!directionParam) {
      return res.status(400).json({ error: '请选择期望方向' });
    }
    if (!isValidDirection(directionParam)) {
      return res.status(400).json({
        error: `无效的期望方向: ${directionParam}`,
        detail: `可选值: ${Object.values(ExpectedDirection).join(', ')}`,
      });
    }

    const direction = directionParam as ExpectedDirection;
    const directionLabel = DIRECTION_LABELS[direction];

    console.log(`[Analyze] Starting analysis for direction: ${directionLabel}`);
    console.log(`[Analyze] File: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)`);

    // Step 1: Parse the .docx file
    console.log('[Analyze] Step 1/3: Parsing resume document...');
    const parsedResume = await parseDocx(req.file.buffer);
    console.log(`[Analyze] Resume parsed. Text length: ${parsedResume.rawText.length} chars`);

    if (parsedResume.rawText.trim().length < 50) {
      return res.status(400).json({
        error: '简历内容过短，请确保上传的文件包含有效的简历内容。',
      });
    }

    // Step 2: Run rule-based analysis (scores + suggestions + job matching in parallel)
    console.log('[Analyze] Step 2/3: Running analysis (scores + suggestions + job matching)...');

    const [analysisData, jobMatches] = await Promise.all([
      analyzeResume(parsedResume.rawText, parsedResume.structured, direction),
      matchJobs(parsedResume.rawText, direction),
    ]);

    console.log(
      `[Analyze] Got ${analysisData.suggestions.length} suggestions, ` +
      `overall score ${analysisData.overallScore}/100, ` +
      `${jobMatches.length} job matches`
    );

    // Step 3: Search job market (web scrape with database fallback)
    console.log('[Analyze] Step 3/3: Searching job market information...');
    const jobMarket = await searchJobMarket(direction);
    console.log('[Analyze] Job market info retrieved');

    // Assemble final result
    const result: AnalysisResult = {
      ...analysisData,
      jobMatches,
      jobMarket,
    };

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Analyze] Analysis complete in ${elapsed}s`);

    return res.status(200).json({ result });
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`[Analyze] Error after ${elapsed}s:`, error);

    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: '文件大小不能超过 10MB' });
      }
      return res.status(400).json({ error: `文件上传错误: ${error.message}` });
    }

    // Handle other errors
    const message = error instanceof Error ? error.message : '分析过程中发生未知错误';
    return res.status(500).json({
      error: message,
      detail: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

export default router;
