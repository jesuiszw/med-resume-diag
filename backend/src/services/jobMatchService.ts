import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import type { JobMatch } from '../types';
import { JOB_DATABASE } from '../data/jobDatabase';
import { extractResumeKeywords } from './ruleEngineService';

/**
 * Match resume against the curated job database using keyword overlap.
 * Returns Top-5 job matches with scores and gap analysis.
 *
 * Algorithm:
 *  - Jaccard similarity (40%) + coverage ratio (60%)
 *  - Same-direction jobs get 1.3x weight bonus
 *  - Returns up to 3 same-direction + 2 cross-direction jobs
 */
export async function matchJobs(
  rawText: string,
  direction: ExpectedDirection
): Promise<JobMatch[]> {
  const resumeKeywords = extractResumeKeywords(rawText);
  const resumeKeywordSet = new Set(resumeKeywords);

  // Score every job in the database
  const scored = JOB_DATABASE.map((job) => {
    const jobKeywordSet = new Set(job.keywords);

    const intersection = [...jobKeywordSet].filter((kw) => resumeKeywordSet.has(kw));
    const union = new Set([...jobKeywordSet, ...resumeKeywordSet]);

    const jaccard = union.size > 0 ? intersection.length / union.size : 0;
    const coverage = jobKeywordSet.size > 0 ? intersection.length / jobKeywordSet.size : 0;

    let score = (jaccard * 0.4 + coverage * 0.6) * 100;

    if (job.direction === direction) {
      score *= 1.3;
    }

    score = Math.min(Math.round(score), 100);

    return {
      job,
      score,
      intersection,
      missing: [...jobKeywordSet].filter((kw) => !resumeKeywordSet.has(kw)),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // Prioritise same-direction jobs, then fill with cross-direction
  const sameDirection = scored.filter((s) => s.job.direction === direction);
  const otherDirection = scored.filter((s) => s.job.direction !== direction);

  const topResults = [...sameDirection.slice(0, 3), ...otherDirection.slice(0, 2)]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Fill if not enough
  if (topResults.length < 5) {
    const used = new Set(topResults.map((r) => r.job.id));
    const remaining = scored.filter((s) => !used.has(s.job.id));
    topResults.push(...remaining.slice(0, 5 - topResults.length));
  }

  return topResults.map(({ job, score, intersection, missing }) => {
    const matchedKeywords = intersection.slice(0, 4);

    let matchReason: string;
    if (matchedKeywords.length > 0) {
      matchReason =
        `简历中包含"${matchedKeywords.join('、')}"等关键词` +
        (job.direction === direction ? '，与目标方向高度匹配' : '') +
        `。${job.company}，${job.location}，${job.salaryRange}。`;
    } else {
      matchReason =
        `该岗位为${DIRECTION_LABELS[job.direction]}方向，${job.company}，` +
        `${job.location}，${job.salaryRange}。可作为职业发展参考。`;
    }

    const missingKeywords = missing.slice(0, 3);
    let gapAnalysis: string;
    if (missingKeywords.length > 0) {
      gapAnalysis =
        `岗位要求中简历未体现的关键能力：${missingKeywords.join('、')}。` +
        `建议在简历中补充相关经验或技能描述。` +
        (job.experienceLevel === '管理'
          ? '该岗位为管理岗，需突出团队管理和跨部门协作经验。'
          : '');
    } else {
      gapAnalysis = '简历关键词覆盖较好，建议进一步细化经历描述以增强竞争力。';
    }

    return {
      jobTitle: `${job.title} - ${job.company}（${job.location}）`,
      matchScore: score,
      matchReason,
      gapAnalysis,
    };
  });
}
