import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import type {
  OptimizationSuggestion,
  StructuredResumeData,
  SuggestionCategory,
  Priority,
} from '../types';
import { KEYWORD_DATABASE } from '../data/keywordDatabase';

/**
 * Extract keywords from resume text that match the keyword database.
 * Returns a list of matched keywords across all directions.
 */
export function extractResumeKeywords(rawText: string): string[] {
  const allKeywords: string[] = [];
  for (const data of Object.values(KEYWORD_DATABASE)) {
    allKeywords.push(...data.keywords);
  }
  const uniqueKeywords = [...new Set(allKeywords)];
  return uniqueKeywords.filter((kw) => rawText.includes(kw));
}

/**
 * Rule-based resume analysis engine.
 * Scores the resume across 5 dimensions (total 100 points) and generates
 * optimization suggestions for weak areas.
 *
 * Dimensions:
 *  1. Completeness (25pts) — checks structured resume sections
 *  2. Industry keyword match (30pts) — keyword hits vs keyword database
 *  3. Quantification (15pts) — numeric/percentage/amount patterns
 *  4. Professionalism (15pts) — industry terms & certificates
 *  5. Structure clarity (15pts) — length, paragraphs, bullets
 */
export async function analyzeResume(
  rawText: string,
  structured: StructuredResumeData,
  direction: ExpectedDirection
): Promise<OptimizationSuggestion[]> {
  const suggestions: OptimizationSuggestion[] = [];

  // ── 1. Completeness (25pts) ──────────────────────────
  const fields: { key: keyof StructuredResumeData; label: string }[] = [
    { key: 'basicInfo', label: '基本信息' },
    { key: 'education', label: '教育背景' },
    { key: 'workExperience', label: '工作经历' },
    { key: 'projectExperience', label: '项目经历' },
    { key: 'skills', label: '专业技能' },
  ];
  let completenessScore = 0;
  const missingFields: string[] = [];
  for (const field of fields) {
    const content = structured[field.key];
    if (content && content.trim().length > 20 && !content.includes('未能提取')) {
      completenessScore += 5;
    } else {
      missingFields.push(field.label);
    }
  }
  const completenessRate = completenessScore / 25;

  // ── 2. Industry keyword match (30pts) ────────────────
  const directionData = KEYWORD_DATABASE[direction];
  const directionKeywords = directionData.keywords;
  const directionHits = directionKeywords.filter((kw) => rawText.includes(kw));
  const directionScore = Math.min(directionHits.length * 2, 20);

  let otherHits = 0;
  for (const [dir, data] of Object.entries(KEYWORD_DATABASE)) {
    if (dir !== direction) {
      otherHits += data.keywords.filter((kw) => rawText.includes(kw)).length;
    }
  }
  const otherScore = Math.min(otherHits, 10);
  const industryScore = directionScore + otherScore;
  const industryRate = industryScore / 30;

  // ── 3. Quantification (15pts) ────────────────────────
  const quantPatterns = [
    /\d+[%％]/g,
    /\d+万/g,
    /\d+亿/g,
    /\d+人/g,
    /\d+个/g,
    /\d+次/g,
    /\d+场/g,
    /\d+项/g,
    /\d+篇/g,
    /\d+年/g,
    /\d+月/g,
    /¥\d+/g,
    /\d+k/gi,
    /\d+,\d{3}/g,
    /\d+元/g,
    /\d+分/g,
    /\d+期/g,
  ];
  let quantCount = 0;
  for (const pattern of quantPatterns) {
    const matches = rawText.match(pattern);
    if (matches) quantCount += matches.length;
  }
  const quantScore = Math.min(quantCount * 2, 15);
  const quantRate = quantScore / 15;

  // ── 4. Professionalism (15pts) ───────────────────────
  const professionalTerms = [
    'GCP', 'NMPA', 'KOL', 'SFE', 'CTD', 'eCTD', 'IND', 'NDA', 'ANDA',
    'AE', 'SAE', 'PSUR', 'CRA', 'CRC', 'DRG', 'DIP', 'OTC',
    'license-in', 'license-out', 'BD',
  ];
  const certificateKeywords = [
    '执业药师', 'GCP证书', '执业医师', '注册会计师',
    'PMP', '六西格玛', 'CFA',
    '执业护士', '药师资格证', '医药代表资格',
  ];
  let profCount = 0;
  const lowerText = rawText.toLowerCase();
  for (const term of professionalTerms) {
    if (lowerText.includes(term.toLowerCase())) profCount++;
  }
  for (const cert of certificateKeywords) {
    if (rawText.includes(cert)) profCount++;
  }
  const profScore = Math.min(profCount * 2, 15);
  const profRate = profScore / 15;

  // ── 5. Structure clarity (15pts) ─────────────────────
  const textLength = rawText.length;
  let structureScore = 0;
  if (textLength >= 500 && textLength <= 3000) {
    structureScore += 8;
  } else if (textLength >= 300 && textLength <= 5000) {
    structureScore += 5;
  } else if (textLength >= 100) {
    structureScore += 2;
  }
  const newlineCount = (rawText.match(/\n/g) || []).length;
  if (newlineCount >= 10) structureScore += 4;
  else if (newlineCount >= 5) structureScore += 2;
  const bulletCount = (rawText.match(/[•\-\*]\s/g) || []).length;
  if (bulletCount >= 3) structureScore += 3;
  else if (bulletCount >= 1) structureScore += 1;
  structureScore = Math.min(structureScore, 15);
  const structureRate = structureScore / 15;

  // ── Generate suggestions ─────────────────────────────

  // Completeness
  if (completenessRate < 0.6 && missingFields.length > 0) {
    suggestions.push({
      problem: `简历缺少以下关键板块：${missingFields.join('、')}`,
      suggestion: `建议补充${missingFields.join('、')}等内容，完整的简历结构应包含基本信息、教育背景、工作经历、项目经历和专业技能五个板块。`,
      category: 'content_gap',
      priority: 'high',
    });
  } else if (completenessRate < 0.8 && missingFields.length > 0) {
    suggestions.push({
      problem: `简历中${missingFields.join('、')}板块内容不够充实`,
      suggestion: `建议完善${missingFields.join('、')}部分的内容，确保每个板块都有实质性信息。`,
      category: 'content_gap',
      priority: 'medium',
    });
  }

  // Industry keywords
  if (industryRate < 0.6) {
    const missingKeywords = directionKeywords.filter((kw) => !rawText.includes(kw)).slice(0, 5);
    suggestions.push({
      problem: `简历中与${DIRECTION_LABELS[direction]}方向相关的行业关键词较少（命中${directionHits.length}/${directionKeywords.length}个）`,
      suggestion: `建议在简历中增加以下行业关键词：${missingKeywords.join('、')}，以提升与目标岗位的匹配度。`,
      category: 'keyword',
      priority: 'high',
    });
  } else if (industryRate < 0.8) {
    const missingKeywords = directionKeywords.filter((kw) => !rawText.includes(kw)).slice(0, 3);
    suggestions.push({
      problem: `简历中${DIRECTION_LABELS[direction]}方向的行业关键词覆盖不够全面`,
      suggestion: `建议补充以下关键词：${missingKeywords.join('、')}，使简历更贴合该方向岗位要求。`,
      category: 'keyword',
      priority: 'medium',
    });
  }

  // Quantification
  if (quantRate < 0.6) {
    suggestions.push({
      problem: '简历中缺乏量化数据支撑工作成果',
      suggestion:
        '建议在工作经历和项目经历中增加量化表述，如"销售额增长30%"、"管理15人团队"、"年推广活动20场"等，用数据证明能力。',
      category: 'expression',
      priority: quantRate < 0.3 ? 'high' : 'medium',
    });
  }

  // Professionalism
  if (profRate < 0.6) {
    suggestions.push({
      problem: '简历中行业专业术语和资格证书的呈现不足',
      suggestion:
        '建议增加医药行业专业术语（如GCP、NMPA、KOL、SFE等）和相关证书信息（如执业药师、GCP证书等），体现专业素养。',
      category: 'expression',
      priority: 'medium',
    });
  }

  // Structure
  if (structureRate < 0.6) {
    if (textLength < 500) {
      suggestions.push({
        problem: `简历内容偏短（${textLength}字），信息量不足`,
        suggestion:
          '建议扩充工作经历和项目经历的描述，简历总字数建议在500-3000字之间，确保充分展示个人能力。',
        category: 'structure',
        priority: 'high',
      });
    } else if (textLength > 3000) {
      suggestions.push({
        problem: `简历内容过长（${textLength}字），重点不突出`,
        suggestion:
          '建议精简简历内容，聚焦核心经历和成果，总字数控制在3000字以内，确保招聘方能快速抓住重点。',
        category: 'structure',
        priority: 'medium',
      });
    } else {
      suggestions.push({
        problem: '简历结构不够清晰，缺乏段落分隔和项目符号',
        suggestion:
          '建议使用项目符号（•）和清晰的段落分隔来组织内容，提升简历的可读性。',
        category: 'structure',
        priority: 'medium',
      });
    }
  }

  // Ensure at least 4 suggestions
  if (suggestions.length < 4) {
    suggestions.push({
      problem: '简历各维度表现较为均衡，但部分经历描述可以更加具体',
      suggestion:
        '建议在工作经历中使用STAR法则（情境-任务-行动-结果）来描述项目，使经历更具说服力。',
      category: 'expression',
      priority: 'low',
    });
  }

  // Sort by priority: high > medium > low
  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions.slice(0, 8);
}
