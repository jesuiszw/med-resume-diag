import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import type { JobMatch } from '../types';
import { getKeywordSet } from '../data/keywordDatabase';
import { getAllJobs, type CuratedJob } from '../data/jobDatabase';

/**
 * JobMatchService — Pure rule-based job matching engine.
 *
 * Replaces llmService.matchJobs with a keyword-overlap algorithm:
 *   1. Extract keywords from resume text (matched against keyword database)
 *   2. Compute Jaccard similarity between resume keywords and each job's keywords
 *   3. Apply direction weighting (same direction gets a boost)
 *   4. Return Top-5 matches with matchReason and gapAnalysis
 */

/** Direction match boost factor (jobs in the same direction get this multiplier). */
const DIRECTION_BOOST = 1.3;

/** Score cap for job matches (0-100). */
const MAX_SCORE = 95;

/** Score floor for displayed matches. */
const MIN_DISPLAY_SCORE = 20;

/**
 * Extracts industry keywords from the resume text by matching against
 * the full keyword database.
 *
 * @param rawText - The full resume text
 * @param direction - The expected career direction (for prioritized keywords)
 * @returns Set of matched keywords
 */
function extractResumeKeywords(
  rawText: string,
  direction: ExpectedDirection
): Set<string> {
  const matchedKeywords = new Set<string>();

  // Match against the target direction's keywords and skills
  const targetSet = getKeywordSet(direction);
  for (const kw of targetSet.keywords) {
    if (rawText.includes(kw)) {
      matchedKeywords.add(kw);
    }
  }
  for (const sk of targetSet.requiredSkills) {
    if (rawText.includes(sk)) {
      matchedKeywords.add(sk);
    }
  }

  // Also match keywords from all other directions (for cross-direction matching)
  for (const dir of Object.values(ExpectedDirection)) {
    if (dir === direction) continue;
    const dirSet = getKeywordSet(dir as ExpectedDirection);
    for (const kw of dirSet.keywords) {
      if (rawText.includes(kw)) {
        matchedKeywords.add(kw);
      }
    }
    for (const sk of dirSet.requiredSkills) {
      if (rawText.includes(sk)) {
        matchedKeywords.add(sk);
      }
    }
  }

  return matchedKeywords;
}

/**
 * Computes the Jaccard similarity coefficient between two sets.
 * Jaccard = |A ∩ B| / |A ∪ B|
 *
 * @param setA - First set
 * @param setB - Second set
 * @returns Similarity coefficient between 0 and 1
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++;
    }
  }

  const unionCount = setA.size + setB.size - intersectionCount;
  if (unionCount === 0) return 0;

  return intersectionCount / unionCount;
}

/**
 * Computes the overlap ratio (how many of the job's keywords are in the resume).
 * This is asymmetric: |A ∩ B| / |B| (resume coverage of job requirements).
 *
 * @param resumeKeywords - Keywords found in the resume
 * @param jobKeywords - Keywords required by the job
 * @returns Coverage ratio between 0 and 1
 */
function coverageRatio(
  resumeKeywords: Set<string>,
  jobKeywords: string[]
): number {
  if (jobKeywords.length === 0) return 0;

  let matchCount = 0;
  for (const kw of jobKeywords) {
    if (resumeKeywords.has(kw)) {
      matchCount++;
    }
  }

  return matchCount / jobKeywords.length;
}

/**
 * Computes the final match score for a job.
 * Combines Jaccard similarity, coverage ratio, and direction weighting.
 *
 * @param resumeKeywords - Keywords found in the resume
 * @param job - The curated job to score
 * @param direction - The expected career direction
 * @returns Match score between 0 and 100
 */
function computeMatchScore(
  resumeKeywords: Set<string>,
  job: CuratedJob,
  direction: ExpectedDirection
): { score: number; matchedKeywords: string[]; missingKeywords: string[] } {
  const jobKeywordSet = new Set(job.keywords);
  const jobReqKeywords = extractRequirementKeywords(job.requirements);

  // Merge job keywords and requirement-derived keywords
  for (const kw of jobReqKeywords) {
    jobKeywordSet.add(kw);
  }

  // Compute Jaccard similarity
  const jaccard = jaccardSimilarity(resumeKeywords, jobKeywordSet);

  // Compute coverage ratio (resume covers how much of the job)
  const coverage = coverageRatio(resumeKeywords, Array.from(jobKeywordSet));

  // Combined base score: weighted average of jaccard (40%) and coverage (60%)
  // Coverage is weighted higher because it reflects how well the resume meets job needs
  let baseScore = jaccard * 0.4 + coverage * 0.6;

  // Apply direction boost
  if (job.direction === direction) {
    baseScore *= DIRECTION_BOOST;
  }

  // Clamp to [0, 1]
  baseScore = Math.min(baseScore, 1.0);

  // Scale to 0-100 with a minimum display floor
  let score = Math.round(baseScore * MAX_SCORE);
  if (score > 0 && score < MIN_DISPLAY_SCORE) {
    score = MIN_DISPLAY_SCORE;
  }

  // Track matched and missing keywords
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of job.keywords) {
    if (resumeKeywords.has(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  return { score, matchedKeywords, missingKeywords };
}

/**
 * Extracts recognizable keywords from a job's requirement strings.
 * Matches against the global keyword database.
 *
 * @param requirements - Array of requirement strings
 * @returns Set of matched keywords
 */
function extractRequirementKeywords(requirements: string[]): Set<string> {
  const keywords = new Set<string>();

  // Common requirement keywords to look for in requirement text
  const requirementKeywordPatterns: string[] = [
    '市场策略',
    '产品管理',
    '学术推广',
    'KOL',
    '临床试验',
    'GCP',
    'CRA',
    '注册',
    'NMPA',
    'IND',
    'NDA',
    'CTD',
    '药物警戒',
    'ADR',
    'AE',
    'PSUR',
    '市场准入',
    '医保',
    '药物经济学',
    '商务拓展',
    'BD',
    'license',
    '尽职调查',
    '估值',
    '销售',
    '招标',
    '渠道',
    '医疗器械',
    '设备',
    '数字营销',
    '品牌',
    '项目管理',
    '数据分析',
    '跨部门',
    'PMP',
    '硕士',
    '博士',
    'MBA',
  ];

  const fullText = requirements.join(' ');
  for (const pattern of requirementKeywordPatterns) {
    if (fullText.includes(pattern)) {
      keywords.add(pattern);
    }
  }

  return keywords;
}

/**
 * Generates a human-readable match reason for a job.
 *
 * @param job - The curated job
 * @param matchedKeywords - Keywords that matched between resume and job
 * @param direction - The expected career direction
 * @returns Match reason string
 */
function generateMatchReason(
  job: CuratedJob,
  matchedKeywords: string[],
  direction: ExpectedDirection
): string {
  const directionLabel = DIRECTION_LABELS[direction];
  const parts: string[] = [];

  if (job.direction === direction) {
    parts.push(`该岗位与您期望的「${directionLabel}」方向完全匹配`);
  } else {
    const jobDirectionLabel = DIRECTION_LABELS[job.direction];
    parts.push(`该岗位属于「${jobDirectionLabel}」方向，与您的「${directionLabel}」方向有交叉`);
  }

  if (matchedKeywords.length > 0) {
    const topKeywords = matchedKeywords.slice(0, 5);
    parts.push(`您的简历中包含该岗位所需的关键能力：${topKeywords.join('、')}`);
  } else {
    parts.push('该岗位为相关方向，可作为转型或拓展选择');
  }

  parts.push(`${job.company}，${job.location}，${job.salaryRange}`);

  return parts.join('。');
}

/**
 * Generates a human-readable gap analysis for a job.
 *
 * @param job - The curated job
 * @param missingKeywords - Keywords the job requires but resume lacks
 * @returns Gap analysis string
 */
function generateGapAnalysis(
  job: CuratedJob,
  missingKeywords: string[]
): string {
  const parts: string[] = [];

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 4);
    parts.push(`建议补充以下能力或经历：${topMissing.join('、')}`);
  }

  // Add experience level gap note
  if (job.experienceLevel === '管理') {
    parts.push('该岗位为管理岗，需要有团队管理经验');
  } else if (job.experienceLevel === '高级') {
    parts.push('该岗位要求较丰富的行业经验（通常5年以上）');
  }

  // Add requirement gap
  if (job.requirements.length > 0) {
    const firstReq = job.requirements[0];
    parts.push(`岗位要求：${firstReq}`);
  }

  if (parts.length === 0) {
    return '您的简历与该岗位匹配度较高，建议直接投递。';
  }

  return parts.join('；') + '。';
}

/**
 * Matches a resume to the top-5 most suitable medical industry jobs
 * using keyword-overlap algorithm with direction weighting.
 *
 * @param rawText - The raw resume text
 * @param direction - The expected career direction
 * @returns Top-5 job matches with scores and analysis
 */
export async function matchJobs(
  rawText: string,
  direction: ExpectedDirection
): Promise<JobMatch[]> {
  console.log('[JobMatch] Starting rule-based job matching...');

  // Extract keywords from resume
  const resumeKeywords = extractResumeKeywords(rawText, direction);
  console.log(`[JobMatch] Extracted ${resumeKeywords.size} keywords from resume`);

  // Score all jobs
  const allJobs = getAllJobs();
  const scoredJobs = allJobs.map((job) => {
    const { score, matchedKeywords, missingKeywords } = computeMatchScore(
      resumeKeywords,
      job,
      direction
    );
    return { job, score, matchedKeywords, missingKeywords };
  });

  // Sort by score descending
  scoredJobs.sort((a, b) => b.score - a.score);

  // Prioritize same-direction jobs: ensure at least 2 jobs from the target direction
  const sameDirectionJobs = scoredJobs.filter(
    (s) => s.job.direction === direction && s.score > 0
  );
  const otherDirectionJobs = scoredJobs.filter(
    (s) => s.job.direction !== direction
  );

  // Build top-5: take top same-direction jobs first, then fill with others
  let topJobs: typeof scoredJobs;

  if (sameDirectionJobs.length >= 3) {
    // Take top 3 same-direction + top 2 other-direction
    topJobs = [
      ...sameDirectionJobs.slice(0, 3),
      ...otherDirectionJobs.slice(0, 2),
    ];
  } else if (sameDirectionJobs.length > 0) {
    // Take all same-direction + fill with others
    topJobs = [
      ...sameDirectionJobs,
      ...otherDirectionJobs.slice(0, 5 - sameDirectionJobs.length),
    ];
  } else {
    // No same-direction matches, take overall top 5
    topJobs = scoredJobs.slice(0, 5);
  }

  // If we still have fewer than 5, pad from remaining
  if (topJobs.length < 5) {
    const usedIds = new Set(topJobs.map((t) => t.job.id));
    const remaining = scoredJobs.filter((s) => !usedIds.has(s.job.id));
    topJobs = [...topJobs, ...remaining.slice(0, 5 - topJobs.length)];
  }

  // Convert to JobMatch[]
  const jobMatches: JobMatch[] = topJobs.slice(0, 5).map(({ job, score, matchedKeywords, missingKeywords }) => {
    return {
      jobTitle: job.title,
      matchScore: Math.max(score, 10), // Ensure minimum visible score
      matchReason: generateMatchReason(job, matchedKeywords, direction),
      gapAnalysis: generateGapAnalysis(job, missingKeywords),
    };
  });

  console.log(
    `[JobMatch] Top matches: ${jobMatches.map((j) => `${j.jobTitle}(${j.matchScore})`).join(', ')}`
  );

  return jobMatches;
}
