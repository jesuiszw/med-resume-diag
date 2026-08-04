import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import type {
  OptimizationSuggestion,
  StructuredResumeData,
  SuggestionCategory,
  Priority,
  ScoreDimension,
  ScoreStatus,
  AnalysisStats,
  ResumeAnalysisData,
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
 * Determine the score status based on the rate (score / maxScore).
 * - excellent: rate >= 0.8
 * - good:      rate >= 0.6
 * - average:   rate >= 0.4
 * - poor:      rate < 0.4
 */
function getScoreStatus(rate: number): ScoreStatus {
  if (rate >= 0.8) return 'excellent';
  if (rate >= 0.6) return 'good';
  if (rate >= 0.4) return 'average';
  return 'poor';
}

/**
 * Generate improvement tips for the completeness dimension.
 */
function generateCompletenessTips(rate: number, missingFields: string[]): string[] {
  const tips: string[] = [];
  if (rate >= 0.8) {
    tips.push('各板块内容完整充实，保持当前水平即可');
  } else if (rate >= 0.6) {
    tips.push(`进一步充实${missingFields.length > 0 ? missingFields.join('、') : '部分'}板块的内容，增加具体细节`);
    tips.push('确保每个板块都包含时间、职责和成果三要素');
  } else if (rate >= 0.4) {
    tips.push(`完善${missingFields.length > 0 ? missingFields.join('、') : '缺失'}板块，确保每个板块有50字以上实质性信息`);
    tips.push('参考标准简历模板，逐板块检查内容完整性');
  } else {
    tips.push(`优先补充缺失板块：${missingFields.length > 0 ? missingFields.join('、') : '基本信息、教育背景等'}`);
    tips.push('完整的简历应包含基本信息、教育背景、工作经历、项目经历、专业技能五大板块');
  }
  return tips;
}

/**
 * Generate improvement tips for the industry keyword dimension.
 */
function generateIndustryTips(rate: number, missingKeywords: string[]): string[] {
  const tips: string[] = [];
  if (rate >= 0.8) {
    tips.push('行业关键词覆盖全面，与目标岗位匹配度高');
  } else if (rate >= 0.6) {
    tips.push(`补充少量遗漏的关键词：${missingKeywords.slice(0, 3).join('、')}`);
    tips.push('在工作经历中自然融入行业术语，避免生硬堆砌');
  } else if (rate >= 0.4) {
    tips.push(`增加目标方向行业关键词，建议补充：${missingKeywords.slice(0, 4).join('、')}`);
    tips.push('参考目标岗位JD，提取高频关键词融入简历');
  } else {
    tips.push(`大幅增加行业关键词，优先补充：${missingKeywords.slice(0, 5).join('、')}`);
    tips.push('在技能、工作经历、项目经历等板块全面覆盖目标方向核心术语');
  }
  return tips;
}

/**
 * Generate improvement tips for the quantification dimension.
 */
function generateQuantTips(rate: number): string[] {
  const tips: string[] = [];
  if (rate >= 0.8) {
    tips.push('数据量化充分，成果表述有说服力');
  } else if (rate >= 0.6) {
    tips.push('补充更多量化数据，关注关键成果的数据化表达');
    tips.push('每段工作经历建议包含2-3个量化指标');
  } else if (rate >= 0.4) {
    tips.push('在工作经历中增加量化表述，如销售额、增长率、覆盖范围等');
    tips.push('使用百分比、金额、人数、场次等具体数据支撑成果');
  } else {
    tips.push('用数据量化工作成果，如"销售额增长30%"、"管理15人团队"');
    tips.push('在每段经历中至少添加2个量化指标，用数据证明能力');
  }
  return tips;
}

/**
 * Generate improvement tips for the professionalism dimension.
 */
function generateProfTips(rate: number): string[] {
  const tips: string[] = [];
  if (rate >= 0.8) {
    tips.push('专业术语使用充分，体现了扎实的行业素养');
  } else if (rate >= 0.6) {
    tips.push('进一步丰富专业术语，突出行业资质和认证');
    tips.push('在技能板块列出GCP、NMPA等行业认证信息');
  } else if (rate >= 0.4) {
    tips.push('增加行业专业术语，如GCP、NMPA、KOL、SFE等');
    tips.push('添加相关资格证书信息，如执业药师、GCP证书等');
  } else {
    tips.push('增加行业专业术语的使用，如GCP、NMPA、KOL、IND、NDA等');
    tips.push('在技能或教育板块添加相关资格证书（执业药师、GCP证书、PMP等）');
  }
  return tips;
}

/**
 * Generate improvement tips for the structure dimension.
 */
function generateStructureTips(rate: number, textLength: number): string[] {
  const tips: string[] = [];
  if (rate >= 0.8) {
    tips.push('结构清晰，排版规范，便于HR快速阅读');
  } else if (rate >= 0.6) {
    tips.push('增加项目符号和段落分隔，提升可读性');
    tips.push('确保重点信息突出，使用加粗或项目符号标注关键成果');
  } else if (rate >= 0.4) {
    if (textLength < 500) {
      tips.push('扩充简历内容至500-3000字，充分展示个人能力');
    } else if (textLength > 3000) {
      tips.push('精简简历内容至3000字以内，聚焦核心经历和成果');
    }
    tips.push('使用项目符号（•）组织内容，增加段落分隔提升可读性');
  } else {
    tips.push('优化简历整体结构，控制字数在500-3000字之间');
    tips.push('使用项目符号和清晰的段落分隔组织内容，便于HR快速抓取重点');
  }
  return tips;
}

/**
 * Generate an AI-style summary paragraph based on the analysis results.
 */
function generateSummary(
  overallScore: number,
  dimensions: ScoreDimension[],
  suggestions: OptimizationSuggestion[],
  directionLabel: string,
  stats: AnalysisStats
): string {
  const level =
    overallScore >= 80 ? '优秀'
    : overallScore >= 60 ? '良好'
    : overallScore >= 40 ? '一般'
    : '待改进';

  const sortedByRate = [...dimensions].sort(
    (a, b) => a.score / a.maxScore - b.score / b.maxScore
  );
  const weakest = sortedByRate[0];
  const strongest = sortedByRate[sortedByRate.length - 1];

  const keywordCoverage =
    stats.keywordTotal > 0
      ? Math.round((stats.keywordHits / stats.keywordTotal) * 100)
      : 0;

  const parts: string[] = [];
  parts.push(
    `综合评分 ${overallScore}/100，简历整体质量${level}。`
  );
  parts.push(
    `在${directionLabel}方向上，简历在「${strongest.name}」维度表现最佳（${strongest.score}/${strongest.maxScore}），`
  );
  parts.push(
    `而「${weakest.name}」维度有待提升（${weakest.score}/${weakest.maxScore}）。`
  );
  parts.push(
    `行业关键词覆盖率为${keywordCoverage}%（${stats.keywordHits}/${stats.keywordTotal}），`
  );
  parts.push(
    `共发现${stats.totalSuggestions}条优化建议，其中${stats.highPriority}条高优先级问题需重点关注。`
  );
  parts.push(
    `建议优先改进「${weakest.name}」，可显著提升简历竞争力和岗位匹配度。`
  );

  return parts.join('');
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
 *
 * @returns ResumeAnalysisData containing suggestions, overallScore, dimensions, summary, and stats
 */
export async function analyzeResume(
  rawText: string,
  structured: StructuredResumeData,
  direction: ExpectedDirection
): Promise<ResumeAnalysisData> {
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
  const missingKeywords = directionKeywords.filter((kw) => !rawText.includes(kw)).slice(0, 5);

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
    suggestions.push({
      problem: `简历中与${DIRECTION_LABELS[direction]}方向相关的行业关键词较少（命中${directionHits.length}/${directionKeywords.length}个）`,
      suggestion: `建议在简历中增加以下行业关键词：${missingKeywords.join('、')}，以提升与目标岗位的匹配度。`,
      category: 'keyword',
      priority: 'high',
    });
  } else if (industryRate < 0.8) {
    suggestions.push({
      problem: `简历中${DIRECTION_LABELS[direction]}方向的行业关键词覆盖不够全面`,
      suggestion: `建议补充以下关键词：${missingKeywords.slice(0, 3).join('、')}，使简历更贴合该方向岗位要求。`,
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

  const finalSuggestions = suggestions.slice(0, 8);

  // ── Build dimensions array ───────────────────────────
  const dimensions: ScoreDimension[] = [
    {
      name: '内容完整性',
      score: completenessScore,
      maxScore: 25,
      weight: 0.25,
      description: '简历包含5个关键板块：基本信息、教育背景、工作经历、项目经历、专业技能',
      status: getScoreStatus(completenessRate),
      tips: generateCompletenessTips(completenessRate, missingFields),
    },
    {
      name: '行业关键词',
      score: industryScore,
      maxScore: 30,
      weight: 0.30,
      description: '简历中包含的目标方向行业关键词数量和覆盖度',
      status: getScoreStatus(industryRate),
      tips: generateIndustryTips(industryRate, missingKeywords),
    },
    {
      name: '数据量化',
      score: quantScore,
      maxScore: 15,
      weight: 0.15,
      description: '工作经历和项目经历中使用数据量化成果的程度',
      status: getScoreStatus(quantRate),
      tips: generateQuantTips(quantRate),
    },
    {
      name: '专业术语',
      score: profScore,
      maxScore: 15,
      weight: 0.15,
      description: '简历中行业专业术语和资格证书的呈现情况',
      status: getScoreStatus(profRate),
      tips: generateProfTips(profRate),
    },
    {
      name: '结构清晰',
      score: structureScore,
      maxScore: 15,
      weight: 0.15,
      description: '简历的整体长度、段落分隔和项目符号使用情况',
      status: getScoreStatus(structureRate),
      tips: generateStructureTips(structureRate, textLength),
    },
  ];

  // ── Compute overall score ────────────────────────────
  const overallScore =
    completenessScore + industryScore + quantScore + profScore + structureScore;

  // ── Compute stats ────────────────────────────────────
  const stats: AnalysisStats = {
    totalSuggestions: finalSuggestions.length,
    highPriority: finalSuggestions.filter((s) => s.priority === 'high').length,
    mediumPriority: finalSuggestions.filter((s) => s.priority === 'medium').length,
    lowPriority: finalSuggestions.filter((s) => s.priority === 'low').length,
    keywordHits: directionHits.length,
    keywordTotal: directionKeywords.length,
  };

  // ── Generate summary ─────────────────────────────────
  const summary = generateSummary(
    overallScore,
    dimensions,
    finalSuggestions,
    DIRECTION_LABELS[direction],
    stats
  );

  return {
    suggestions: finalSuggestions,
    overallScore,
    dimensions,
    summary,
    stats,
  };
}
