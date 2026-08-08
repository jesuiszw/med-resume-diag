import type {
  OptimizationSuggestion,
  ResumeAnalysisData,
  ScoreDimension,
  StructuredResumeData,
  ExpectedDirection,
} from '../types';
import { DIRECTION_LABELS } from '../types';
import { getKeywordSet, getAllKeywords } from '../data/keywordDatabase';

/**
 * RuleEngineService — Pure rule-based resume analysis engine.
 *
 * Replaces llmService.analyzeResume with a deterministic, zero-API-key
 * scoring system across 5 dimensions (total 100 points):
 *   1. 完整性 (Completeness)           — 25%
 *   2. 行业匹配度 (Industry Match)     — 30%
 *   3. 量化表达 (Quantified Expression) — 15%
 *   4. 专业性 (Professionalism)         — 15%
 *   5. 结构清晰度 (Structure Clarity)   — 15%
 *
 * Weak dimensions generate targeted OptimizationSuggestion entries.
 */

/** Weight constants for each dimension. */
const WEIGHTS = {
  completeness: 25,
  industryMatch: 30,
  quantifiedExpression: 15,
  professionalism: 15,
  structure: 15,
} as const;

/** Regex patterns for detecting quantified expressions. */
const QUANTITY_PATTERNS: RegExp[] = [
  /\d+[%％]/,          // 百分比：30%, 50％
  /\d+万/,              // 金额/数量：50万
  /\d+亿/,              // 金额：1亿
  /\d+\.?\d*倍/,        // 倍数：3倍, 2.5倍
  /\d+人次/,            // 人次：500人次
  /\d+个/,              // 数量：20个
  /\d+篇/,              // 篇数：10篇
  /\d+项/,              // 项目数：5项
  /\d+场/,              // 场次：30场
  /\d+次/,              // 次数：100次
  /\d+名/,              // 人数：50名
  /\d+人/,              // 人数：50人
  /\d+家/,              // 机构数：10家
  /\d+天/,              // 天数：90天
  /\d+年/,              // 年限：5年
  /￥\d+/,              // 人民币：￥10000
  /\d+元/,              // 金额：5000元
  /RMB\s?\d+/i,         // RMB金额
];

/** Professional certification and qualification keywords. */
const CERTIFICATION_KEYWORDS: string[] = [
  'GCP证书',
  'GCP',
  '执业药师',
  '执业医师',
  '执业护士',
  'PMP',
  'CRA',
  'CRC',
  '六西格玛',
  'Six Sigma',
  'MBA',
  'MPH',
  'PhD',
  '博士',
  '硕士',
  '执业资格',
  '注册会计师',
  'CFA',
  'CPA',
  '药品GSP',
  'GSP',
  'GLP',
  'GMP',
  'ISO',
  'CFDA',
  'NMPA',
  'FDA',
  'EMA',
  'ICH',
];

/** Structural section header patterns. */
const SECTION_PATTERNS: RegExp[] = [
  /个人信息|基本信息|联系方式|Profile|Personal|Contact/i,
  /教育背景|教育经历|学历|Education|Academic/i,
  /工作经历|工作经验|工作履历|Work Experience|Employment|Professional Experience/i,
  /项目经历|项目经验|Project Experience|Projects/i,
  /技能|专业技能|核心技能|Skills|Technical Skills|Competencies/i,
  /自我评价|个人总结|Summary|Profile Summary|Objective/i,
];

/**
 * Scores the completeness of the structured resume data.
 * Checks whether each of the 5 main fields has meaningful content.
 *
 * @param structured - The structured resume data
 * @returns Dimension score with detail messages
 */
function scoreCompleteness(structured: StructuredResumeData): ScoreDimension {
  const maxScore = WEIGHTS.completeness;
  const fields: Array<{ key: keyof StructuredResumeData; label: string }> = [
    { key: 'basicInfo', label: '基本信息' },
    { key: 'education', label: '教育背景' },
    { key: 'workExperience', label: '工作经历' },
    { key: 'projectExperience', label: '项目经历' },
    { key: 'skills', label: '技能' },
  ];

  let filledCount = 0;
  const details: string[] = [];

  for (const field of fields) {
    const content = structured[field.key];
    const hasContent =
      content &&
      content.trim().length > 5 &&
      !content.includes('未能提取');
    if (hasContent) {
      filledCount++;
    } else {
      details.push(`缺少「${field.label}」部分或内容过少`);
    }
  }

  // Each field is worth maxScore / fields.length points
  const score = Math.round((filledCount / fields.length) * maxScore);
  return {
    name: '完整性',
    score,
    maxScore,
    details,
  };
}

/**
 * Flexible keyword matching: checks if keyword or its core stem appears in text.
 * For compound terms like "数据分析能力", also checks if the base "数据分析" exists.
 */
function flexibleIncludes(text: string, keyword: string): boolean {
  // Direct match
  if (text.includes(keyword)) return true;

  // For compound Chinese terms ending with 能力/技能/经验/管理/能力等, try base stem
  const suffixes = ['能力', '技能', '经验', '管理', '能力', '知识', '意识', '素质', '素养'];
  for (const suffix of suffixes) {
    if (keyword.endsWith(suffix) && keyword.length > suffix.length + 2) {
      const stem = keyword.slice(0, -suffix.length);
      if (text.includes(stem)) return true;
    }
  }

  return false;
}

/**
 * Scores industry keyword match for the given direction.
 * Counts how many direction-specific keywords appear in the resume text.
 *
 * @param rawText - The full resume text
 * @param direction - The expected career direction
 * @returns Dimension score with detail messages
 */
function scoreIndustryMatch(
  rawText: string,
  direction: ExpectedDirection
): ScoreDimension {
  const maxScore = WEIGHTS.industryMatch;
  const keywordSet = getKeywordSet(direction);
  const directionKeywords = keywordSet.keywords;
  const skillKeywords = keywordSet.requiredSkills;

  // Count matched direction keywords (flexible matching)
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of directionKeywords) {
    if (flexibleIncludes(rawText, kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  // Count matched required skills (flexible matching)
  const matchedSkills: string[] = [];
  for (const sk of skillKeywords) {
    if (flexibleIncludes(rawText, sk)) {
      matchedSkills.push(sk);
    }
  }

  // Scoring: each matched keyword gives 2 points, skills give 1 point each, capped at maxScore
  const score = Math.min(maxScore, matchedKeywords.length * 2 + matchedSkills.length * 1);

  const details: string[] = [];
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5);
    details.push(`可补充方向相关关键词：${topMissing.join('、')}${missingKeywords.length > 5 ? '等' : ''}`);
  }
  if (matchedKeywords.length === 0) {
    details.push('简历中几乎未出现该方向的核心行业术语');
  }

  return {
    name: '行业匹配度',
    score,
    maxScore,
    details,
  };
}

/**
 * Scores the use of quantified expressions in the resume.
 * Checks for numbers, percentages, amounts, and other metrics.
 *
 * @param rawText - The full resume text
 * @returns Dimension score with detail messages
 */
function scoreQuantifiedExpression(rawText: string): ScoreDimension {
  const maxScore = WEIGHTS.quantifiedExpression;

  let totalMatches = 0;
  const foundPatterns: string[] = [];

  for (const pattern of QUANTITY_PATTERNS) {
    const matches = rawText.match(new RegExp(pattern.source, 'gi'));
    if (matches && matches.length > 0) {
      totalMatches += matches.length;
      foundPatterns.push(pattern.source);
    }
  }

  // Score scaling: 0 matches = 0, 1-3 = 40%, 4-6 = 70%, 7-10 = 90%, 10+ = 100%
  let ratio: number;
  if (totalMatches === 0) {
    ratio = 0;
  } else if (totalMatches <= 3) {
    ratio = 0.4;
  } else if (totalMatches <= 6) {
    ratio = 0.7;
  } else if (totalMatches <= 10) {
    ratio = 0.9;
  } else {
    ratio = 1.0;
  }

  const score = Math.round(ratio * maxScore);
  const details: string[] = [];

  if (totalMatches === 0) {
    details.push('简历中几乎没有量化数据（如百分比、金额、人次等）');
  } else if (totalMatches <= 3) {
    details.push('量化数据偏少，建议在工作经历中增加更多具体数字');
  }

  return {
    name: '量化表达',
    score,
    maxScore,
    details,
  };
}

/**
 * Scores the professionalism of the resume.
 * Checks for professional terminology, certifications, and industry acronyms.
 *
 * @param rawText - The full resume text
 * @param direction - The expected career direction
 * @returns Dimension score with detail messages
 */
function scoreProfessionalism(
  rawText: string,
  direction: ExpectedDirection
): ScoreDimension {
  const maxScore = WEIGHTS.professionalism;

  // Check for certification keywords
  let certCount = 0;
  const foundCerts: string[] = [];
  for (const cert of CERTIFICATION_KEYWORDS) {
    if (rawText.includes(cert)) {
      certCount++;
      foundCerts.push(cert);
    }
  }

  // Check for general industry keywords (all directions)
  const allKeywords = getAllKeywords();
  let generalKwCount = 0;
  for (const kw of allKeywords) {
    if (rawText.includes(kw)) {
      generalKwCount++;
    }
  }

  // Cert score: up to 60% of dimension
  const certRatio = Math.min(certCount / 3, 1.0);
  // General keyword score: up to 40% of dimension
  const generalRatio = Math.min(generalKwCount / 10, 1.0);

  const score = Math.round((certRatio * 0.6 + generalRatio * 0.4) * maxScore);

  const details: string[] = [];
  if (certCount === 0) {
    details.push('简历中未提及相关职业资格证书或专业认证');
  }
  if (generalKwCount < 5) {
    details.push('专业术语使用偏少，建议增加行业专业词汇');
  }

  return {
    name: '专业性',
    score,
    maxScore,
    details,
  };
}

/**
 * Scores the structural clarity of the resume.
 * Checks overall length, section presence, and paragraph organization.
 *
 * @param rawText - The full resume text
 * @returns Dimension score with detail messages
 */
function scoreStructure(rawText: string): ScoreDimension {
  const maxScore = WEIGHTS.structure;
  const details: string[] = [];

  const textLength = rawText.length;
  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
  const lineCount = lines.length;

  let lengthScore: number;
  if (textLength < 300) {
    lengthScore = 0.3;
    details.push('简历内容过短（不足300字），建议补充更多经历细节');
  } else if (textLength < 800) {
    lengthScore = 0.6;
    details.push('简历篇幅偏短，建议适当补充工作或项目经历');
  } else if (textLength <= 3000) {
    lengthScore = 1.0;
  } else if (textLength <= 5000) {
    lengthScore = 0.8;
    details.push('简历内容较长，注意保持重点突出');
  } else {
    lengthScore = 0.5;
    details.push('简历内容过长（超过5000字），建议精简提炼');
  }

  // Check section headers presence
  let sectionCount = 0;
  for (const pattern of SECTION_PATTERNS) {
    if (pattern.test(rawText)) {
      sectionCount++;
    }
  }
  const sectionRatio = sectionCount / SECTION_PATTERNS.length;

  // Check paragraph structure (line breaks suggest structure)
  const avgLineLength = lineCount > 0 ? textLength / lineCount : 0;
  const structureBonus =
    lineCount >= 10 && avgLineLength <= 200 ? 0.2 : 0;

  const combinedRatio = Math.min(
    lengthScore * 0.5 + sectionRatio * 0.3 + structureBonus + 0.2,
    1.0
  );

  if (sectionCount < 4) {
    details.push(`简历结构不清晰，缺少明确的分段标题（检测到${sectionCount}个常见段落标题）`);
  }

  const score = Math.round(combinedRatio * maxScore);
  return {
    name: '结构清晰度',
    score,
    maxScore,
    details,
  };
}

/**
 * Generates a brief overall summary based on the scoring result.
 *
 * @param scores - The full scoring result
 * @returns Human-readable summary text
 */
function generateSummary(scores: ScoreDimension[]): string {
  const sortedDims = [...scores].sort((a, b) => b.score / b.maxScore - a.score / a.maxScore);
  const strongest = sortedDims[0];
  const weakest = sortedDims[sortedDims.length - 1];

  const strongRatio = strongest.score / strongest.maxScore;
  const weakRatio = weakest.score / weakest.maxScore;

  if (strongRatio >= 0.8 && weakRatio >= 0.8) {
    return `简历整体质量优秀。在「${strongest.name}」和「${weakest.name}」等多个维度表现突出，建议保持当前结构并持续优化亮点。`;
  } else if (weakRatio < 0.5) {
    return `简历整体有提升空间。「${strongest.name}」表现良好，但「${weakest.name}」维度需要重点加强，建议针对薄弱环节补充相关经历和成果数据。`;
  } else {
    return `简历整体质量良好，在「${strongest.name}」方面表现优秀，「${weakest.name}」维度仍有优化空间。建议加强数据量化和专业技能展示，进一步提升竞争力。`;
  }
}

/**
 * Generates optimization suggestions based on weak scoring dimensions.
 *
 * @param scores - The full scoring result
 * @param direction - The expected career direction
 * @returns Array of optimization suggestions
 */
function generateSuggestions(
  scores: ScoreDimension[],
  direction: ExpectedDirection
): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const directionLabel = DIRECTION_LABELS[direction];
  const keywordSet = getKeywordSet(direction);

  // Sort dimensions by score ratio (ascending = weakest first)
  const sortedDims = [...scores].sort((a, b) => {
    const ratioA = a.score / a.maxScore;
    const ratioB = b.score / b.maxScore;
    return ratioA - ratioB;
  });

  for (const dim of sortedDims) {
    const ratio = dim.score / dim.maxScore;

    // Skip dimensions that are already strong
    if (ratio >= 0.85) continue;

    // Determine priority based on weakness
    let priority: 'high' | 'medium' | 'low';
    if (ratio < 0.4) {
      priority = 'high';
    } else if (ratio < 0.7) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    // Generate suggestion based on dimension
    switch (dim.name) {
      case '完整性':
        if (dim.details.length > 0) {
          suggestions.push({
            problem: `简历完整性不足：${dim.details.join('；')}`,
            suggestion: `请补充缺失的简历模块。对于「${directionLabel}」方向，确保包含完整的基本信息、教育背景、工作经历、项目经历和技能描述，让HR能够全面了解您的背景。`,
            category: 'structure',
            priority,
          });
        }
        break;

      case '行业匹配度':
        suggestions.push({
          problem:
            dim.details.length > 0
              ? `行业关键词匹配度偏低：${dim.details.join('；')}`
              : `简历中「${directionLabel}」方向相关关键词较少`,
          suggestion: `建议在简历中自然融入该方向核心关键词，如：${keywordSet.keywords.slice(0, 6).join('、')}等。可以在工作经历描述、技能列表和项目经历中体现这些专业术语，提高ATS系统和HR的筛选通过率。`,
          category: 'keyword',
          priority,
        });
        break;

      case '量化表达':
        suggestions.push({
          problem:
            dim.details.length > 0
              ? dim.details[0]
              : '工作经历中缺少量化成果展示',
          suggestion:
            '建议用具体数字描述工作成果，例如：「负责XX产品线，年度销售额达XX万元，同比增长XX%」「管理XX人的团队，覆盖XX家医院」「组织XX场学术会议，触达XX名目标医生」。量化数据能让HR快速感知您的能力和业绩。',
          category: 'expression',
          priority,
        });
        break;

      case '专业性':
        suggestions.push({
          problem:
            dim.details.length > 0
              ? `专业性体现不足：${dim.details.join('；')}`
              : '简历专业术语和资质认证展示不够',
          suggestion: `建议补充相关职业资格证书（如GCP证书、执业药师、PMP等），并在经历中使用行业专业术语。对于「${directionLabel}」方向，可强调以下技能：${keywordSet.requiredSkills.slice(0, 3).join('、')}等。`,
          category: 'content_gap',
          priority,
        });
        break;

      case '结构清晰度':
        suggestions.push({
          problem:
            dim.details.length > 0
              ? `简历结构有待优化：${dim.details.join('；')}`
              : '简历结构不够清晰',
          suggestion:
            '建议使用明确的段落标题（如「基本信息」「教育背景」「工作经历」「项目经历」「技能与证书」「自我评价」），每个段落聚焦一个主题。控制简历在1-2页（约800-3000字），重点突出与目标方向相关的经历。',
          category: 'structure',
          priority,
        });
        break;
    }
  }

  // Always ensure at least 3 suggestions
  if (suggestions.length < 3) {
    suggestions.push({
      problem: '简历整体竞争力有提升空间',
      suggestion: `针对「${directionLabel}」方向，建议进一步突出与该岗位最相关的经历和技能，调整描述顺序，将最有价值的信息放在简历前半部分。同时确保联系方式、求职意向等基本信息完整准确。`,
      category: 'expression',
      priority: 'low',
    });
  }

  // Cap at 8 suggestions
  return suggestions.slice(0, 8);
}

/**
 * Analyzes a resume using the rule-based scoring engine.
 *
 * Scores the resume across 5 dimensions (total 100 points) and generates
 * targeted optimization suggestions for weak areas.
 *
 * @param rawText - The raw resume text
 * @param structured - The structured resume data
 * @param direction - The expected career direction
 * @returns Full ResumeAnalysisData with totalScore, dimensions, summary, suggestions
 */
export async function analyzeResume(
  rawText: string,
  structured: StructuredResumeData,
  direction: ExpectedDirection
): Promise<ResumeAnalysisData> {
  console.log('[RuleEngine] Starting rule-based resume analysis...');

  // Score each dimension
  const completeness = scoreCompleteness(structured);
  const industryMatch = scoreIndustryMatch(rawText, direction);
  const quantifiedExpression = scoreQuantifiedExpression(rawText);
  const professionalism = scoreProfessionalism(rawText, direction);
  const structure = scoreStructure(rawText);

  const dimensions: ScoreDimension[] = [
    completeness,
    industryMatch,
    quantifiedExpression,
    professionalism,
    structure,
  ];

  const totalScore = dimensions.reduce((sum, d) => sum + d.score, 0);

  console.log('[RuleEngine] Scoring results:');
  for (const dim of dimensions) {
    const ratio = ((dim.score / dim.maxScore) * 100).toFixed(0);
    console.log(`  ${dim.name}: ${dim.score}/${dim.maxScore} (${ratio}%)`);
  }
  console.log(`[RuleEngine] Total score: ${totalScore}/100`);

  // Generate summary and suggestions based on scoring
  const summary = generateSummary(dimensions);
  const suggestions = generateSuggestions(dimensions, direction);

  console.log(`[RuleEngine] Generated ${suggestions.length} suggestions`);
  return {
    totalScore,
    dimensions,
    summary,
    suggestions,
  };
}