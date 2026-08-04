import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Alert,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  Paid as PaidIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type {
  AnalysisResult,
  OptimizationSuggestion,
  JobMatch,
  JobMarketInfo,
  ScoreDimension,
  ScoreStatus,
  DiagnosisStats,
  SuggestionCategory,
  Priority,
} from '../types';
import { DIRECTION_LABELS, ExpectedDirection } from '../types';

// ════════════════════════════════════════════════════════
// Design Tokens
// ════════════════════════════════════════════════════════

const COLORS = {
  pageBg: '#F5F7FA',
  cardBg: '#FFFFFF',
  cardBorder: '#E8E8E8',
  sectionNumber: '#999999',
  sectionTitle: '#1A1A2E',
  sectionSubtitle: '#666666',
  bodyText: '#333333',
  secondaryText: '#666666',
  // Status colors
  excellent: '#2B7A4D',
  good: '#1A73E8',
  average: '#F59E0B',
  poor: '#DC2626',
  // Priority colors
  high: '#DC2626',
  medium: '#F59E0B',
  low: '#10B981',
} as const;

/** Direction keyword mapping for job title matching */
const DIRECTION_KEYWORDS: Record<ExpectedDirection, string[]> = {
  [ExpectedDirection.ProductManager]: ['产品经理', '产品'],
  [ExpectedDirection.MSL]: ['医学联络', 'MSL', '医学科学'],
  [ExpectedDirection.SalesSpecialist]: ['销售', '销售代表', '销售专员'],
  [ExpectedDirection.MarketingExecutive]: ['市场', '营销'],
  [ExpectedDirection.MarketAccess]: ['准入', '市场准入'],
  [ExpectedDirection.ClinicalTrial]: ['临床', 'CRA', 'CRC'],
  [ExpectedDirection.Pharmacovigilance]: ['药物警戒', 'PV', '警戒'],
  [ExpectedDirection.RegulatoryAffairs]: ['注册', 'RA', '注册事务'],
  [ExpectedDirection.BusinessDevelopment]: ['商务', 'BD', '商务拓展'],
  [ExpectedDirection.DeviceSales]: ['器械', '医疗器械', '设备'],
};

// ════════════════════════════════════════════════════════
// Helper Functions
// ════════════════════════════════════════════════════════

/**
 * Get the display color for a dimension status.
 * @param status - The score status (excellent / good / average / poor)
 * @returns Hex color string
 */
function getStatusColor(status: ScoreStatus): string {
  const map: Record<ScoreStatus, string> = {
    excellent: COLORS.excellent,
    good: COLORS.good,
    average: COLORS.average,
    poor: COLORS.poor,
  };
  return map[status] ?? '#999999';
}

/**
 * Get the display color for a job match score (0-100).
 * >=85 green, >=70 blue, >=50 yellow, <50 red.
 * @param score - Match score 0-100
 * @returns Hex color string
 */
function getScoreColor(score: number): string {
  if (score >= 85) return COLORS.excellent;
  if (score >= 70) return COLORS.good;
  if (score >= 50) return COLORS.average;
  return COLORS.poor;
}

/**
 * Get priority badge configuration.
 * @param priority - high / medium / low
 * @returns Object with label, background color, and text color
 */
function getPriorityConfig(priority: Priority): { label: string; bgColor: string; color: string } {
  const map: Record<Priority, { label: string; bgColor: string; color: string }> = {
    high: { label: '高优先级', bgColor: COLORS.high, color: '#FFFFFF' },
    medium: { label: '中优先级', bgColor: COLORS.medium, color: '#FFFFFF' },
    low: { label: '低优先级', bgColor: COLORS.low, color: '#FFFFFF' },
  };
  return map[priority] ?? { label: '未知', bgColor: '#999999', color: '#FFFFFF' };
}

/**
 * Get suggestion category configuration.
 * @param category - content_gap / expression / structure / keyword
 * @returns Object with label and color
 */
function getCategoryConfig(category: SuggestionCategory): { label: string; color: string } {
  const map: Record<SuggestionCategory, { label: string; color: string }> = {
    content_gap: { label: '内容缺失', color: COLORS.poor },
    expression: { label: '表达优化', color: COLORS.good },
    structure: { label: '结构问题', color: '#7B61FF' },
    keyword: { label: '关键词补充', color: '#FF6D00' },
  };
  return map[category] ?? { label: '其他', color: '#999999' };
}

/**
 * Generate an impact description based on suggestion category and priority.
 * @param category - Suggestion category
 * @param priority - Suggestion priority
 * @returns Impact description string with warning prefix
 */
function getImpactText(category: SuggestionCategory, priority: Priority): string {
  const impactMap: Record<SuggestionCategory, Record<Priority, string>> = {
    content_gap: {
      high: '⚠ 影响初筛通过率，缺失关键内容可能导致简历被直接过滤，建议优先处理',
      medium: '⚠ 影响简历完整度评分，内容不充分会降低竞争力',
      low: '⚠ 可提升简历完整度，增强整体印象',
    },
    expression: {
      high: '⚠ 影响面试邀约率，缺乏量化数据难以证明能力，建议优先处理',
      medium: '⚠ 影响简历专业度评分，表达不够精准',
      low: '⚠ 可提升简历说服力，让经历更有亮点',
    },
    structure: {
      high: '⚠ 影响阅读体验，结构混乱降低HR阅读效率，建议优先处理',
      medium: '⚠ 影响简历可读性，信息层次不够清晰',
      low: '⚠ 可优化排版体验，提升阅读流畅度',
    },
    keyword: {
      high: '⚠ 影响ATS关键词筛选通过率，缺少行业关键词可能被系统过滤，建议优先处理',
      medium: '⚠ 影响岗位匹配度评分，关键词覆盖不足',
      low: '⚠ 可提升关键词覆盖度，增强系统匹配',
    },
  };
  return impactMap[category]?.[priority] ?? '⚠ 影响简历整体竞争力';
}

/**
 * Generate an example fix text based on suggestion category.
 * @param category - Suggestion category
 * @returns Example string
 */
function getExampleText(category: SuggestionCategory): string {
  const exampleMap: Record<SuggestionCategory, string> = {
    content_gap: "示例：在'工作经历'板块补充具体职责和成果描述",
    expression:
      "示例：'负责产品推广' → '负责华东地区5个城市的IVD产品推广，覆盖120家医院，年销售额增长25%'",
    keyword: '示例：在技能栏添加 GCP、NMPA、KOL 等行业术语',
    structure: '示例：使用项目符号(•)组织经历，每条控制在1-2行',
  };
  return exampleMap[category] ?? '';
}

/**
 * Generate job match tags based on score, job title, and target direction.
 * @param score - Match score 0-100
 * @param jobTitle - Job title string
 * @param direction - Target direction (may be null)
 * @returns Array of tag objects with label and color
 */
function getJobTags(
  score: number,
  jobTitle: string,
  direction: ExpectedDirection | null
): { label: string; color: string }[] {
  const tags: { label: string; color: string }[] = [];

  // Score-based tags
  if (score >= 85) {
    tags.push({ label: '高潜信号', color: COLORS.excellent });
  } else if (score >= 60 && score <= 84) {
    tags.push({ label: '潜力岗位', color: COLORS.average });
  }

  if (score < 60) {
    tags.push({ label: '需补强', color: COLORS.poor });
  }

  // Direction match check
  if (direction) {
    const keywords = DIRECTION_KEYWORDS[direction];
    if (keywords && keywords.some((kw) => jobTitle.includes(kw))) {
      tags.push({ label: '核心匹配', color: COLORS.good });
    }
  }

  return tags;
}

/**
 * Get overall grade label and color based on overall score.
 * 90+=优秀, 75+=良好, 60+=一般, <60=需改进.
 * @param score - Overall score 0-100
 * @returns Object with label and color
 */
function getOverallGrade(score: number): { label: string; color: string } {
  if (score >= 90) return { label: '优秀', color: COLORS.excellent };
  if (score >= 75) return { label: '良好', color: COLORS.good };
  if (score >= 60) return { label: '一般', color: COLORS.average };
  return { label: '需改进', color: COLORS.poor };
}

// ════════════════════════════════════════════════════════
// Reusable Components
// ════════════════════════════════════════════════════════

/** Section header with numbered prefix, bold title, and subtitle. */
function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography sx={{ color: COLORS.sectionNumber, fontSize: '0.875rem', fontWeight: 600 }}>
          {number}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: COLORS.sectionNumber }}>/</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.sectionTitle }}>
          {title}
        </Typography>
      </Box>
      <Typography sx={{ color: COLORS.sectionSubtitle, fontSize: '0.875rem', mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

/** Styled card container for each numbered section. */
function SectionCard({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: COLORS.cardBg,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: '16px',
        p: { xs: 2.5, md: 3 },
        mb: 2.5,
      }}
    >
      {children}
    </Box>
  );
}

// ════════════════════════════════════════════════════════
// Section 01: Score
// ════════════════════════════════════════════════════════

/** Circular overall score display with grade label. */
function ScoreCircle({ score }: { score: number }) {
  const grade = getOverallGrade(score);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 130,
          height: 130,
          borderRadius: '50%',
          border: `6px solid ${grade.color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: grade.color, lineHeight: 1 }}>
          {score}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.secondaryText, mt: 0.5 }}>
          / 100
        </Typography>
      </Box>
      <Box
        sx={{
          px: 2,
          py: 0.4,
          borderRadius: '12px',
          bgcolor: grade.color,
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}
      >
        {grade.label}
      </Box>
    </Box>
  );
}

/** Single dimension progress bar with label, description, and score. */
function DimensionBar({ dimension }: { dimension: ScoreDimension }) {
  const color = getStatusColor(dimension.status);
  const percent = dimension.maxScore > 0 ? (dimension.score / dimension.maxScore) * 100 : 0;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 0.5,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: COLORS.bodyText }}>
            {dimension.name}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.secondaryText, mt: 0.2 }}>
            {dimension.description}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color,
            whiteSpace: 'nowrap',
            ml: 1,
          }}
        >
          {dimension.score}
          <Typography component="span" sx={{ fontSize: '0.7rem', color: COLORS.secondaryText }}>
            /{dimension.maxScore}
          </Typography>
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: '#F0F0F0',
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
        }}
      />
    </Box>
  );
}

/** Small metric card with large value and label. */
function MetricCard({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 80,
        textAlign: 'center',
        py: 1.5,
        px: 1,
        borderRadius: '12px',
        bgcolor: '#FAFAFA',
        border: '1px solid #F0F0F0',
      }}
    >
      <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color, lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.7rem', color: COLORS.secondaryText, mt: 0.3 }}>
        {label}
      </Typography>
    </Box>
  );
}

/** Section 01: Comprehensive Score with 5-dimension breakdown and metric cards. */
function ScoreSection({
  overallScore,
  dimensions,
  stats,
}: {
  overallScore: number;
  dimensions: ScoreDimension[];
  stats?: DiagnosisStats;
}) {
  const grade = getOverallGrade(overallScore);
  const safeStats: DiagnosisStats = stats ?? {
    totalSuggestions: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    keywordHits: 0,
    keywordTotal: 0,
  };

  return (
    <SectionCard>
      <SectionHeader
        number="01"
        title="简历综合评分"
        subtitle="基于5个维度的全面评估，量化简历质量"
      />

      {/* Score circle + dimension bars */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 4 },
          alignItems: { md: 'center' },
          mb: 3,
        }}
      >
        <ScoreCircle score={overallScore} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          {dimensions.map((dim) => (
            <DimensionBar key={dim.name} dimension={dim} />
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Metric cards */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <MetricCard
          value={safeStats.totalSuggestions}
          label="总建议数"
          color={COLORS.bodyText}
        />
        <MetricCard
          value={safeStats.highPriority}
          label="高优先级"
          color={COLORS.high}
        />
        <MetricCard
          value={`${safeStats.keywordHits}/${safeStats.keywordTotal}`}
          label="关键词覆盖"
          color={COLORS.good}
        />
        <MetricCard value={grade.label} label="综合评级" color={grade.color} />
      </Box>
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════
// Section 02: Suggestions
// ════════════════════════════════════════════════════════

/** Single suggestion card with priority/category badges, problem, suggestion, impact, and example. */
function SuggestionCard({
  suggestion,
  index,
}: {
  suggestion: OptimizationSuggestion;
  index: number;
}) {
  const priorityCfg = getPriorityConfig(suggestion.priority);
  const categoryCfg = getCategoryConfig(suggestion.category);
  const impact = getImpactText(suggestion.category, suggestion.priority);
  const example = getExampleText(suggestion.category);

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: '12px',
        bgcolor: '#FCFCFC',
        border: '1px solid #F0F0F0',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: '#D0D0D0' },
      }}
    >
      {/* Badges */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5, alignItems: 'center' }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.3,
            borderRadius: '6px',
            bgcolor: priorityCfg.bgColor,
            color: priorityCfg.color,
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          {priorityCfg.label}
        </Box>
        <Chip
          label={categoryCfg.label}
          size="small"
          variant="outlined"
          sx={{
            borderColor: categoryCfg.color,
            color: categoryCfg.color,
            fontSize: '0.7rem',
            fontWeight: 600,
            height: 22,
          }}
        />
        <Typography
          sx={{ fontSize: '0.7rem', color: COLORS.sectionNumber, ml: 'auto' }}
        >
          #{index + 1}
        </Typography>
      </Box>

      {/* Problem with colored left border */}
      <Box sx={{ borderLeft: `3px solid ${priorityCfg.bgColor}`, pl: 1.5, mb: 1.5 }}>
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.bodyText }}>
          {suggestion.problem}
        </Typography>
      </Box>

      {/* Suggestion */}
      <Typography
        sx={{ fontSize: '0.85rem', color: COLORS.secondaryText, pl: 1.5, mb: 1.5 }}
      >
        {suggestion.suggestion}
      </Typography>

      {/* Impact - warning icon + gray text */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          p: 1.5,
          borderRadius: '8px',
          bgcolor: '#FFF8E1',
          mb: 1,
        }}
      >
        <WarningIcon sx={{ fontSize: 16, color: COLORS.average, mt: 0.1, flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.75rem', color: '#5D4037' }}>{impact}</Typography>
      </Box>

      {/* Example - blue-tinted background */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          p: 1.5,
          borderRadius: '8px',
          bgcolor: '#F0F7FF',
        }}
      >
        <LightbulbIcon sx={{ fontSize: 16, color: COLORS.good, mt: 0.1, flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.75rem', color: COLORS.secondaryText }}>
          {example}
        </Typography>
      </Box>
    </Box>
  );
}

/** Section 02: Optimization Suggestions sorted by priority. */
function SuggestionsSection({ suggestions }: { suggestions: OptimizationSuggestion[] }) {
  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  const sorted = [...suggestions].sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );

  return (
    <SectionCard>
      <SectionHeader
        number="02"
        title="优化建议"
        subtitle="逐条诊断简历问题，给出针对性改进建议"
      />
      <Stack spacing={2}>
        {sorted.map((suggestion, idx) => (
          <SuggestionCard key={idx} suggestion={suggestion} index={idx} />
        ))}
      </Stack>
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════
// Section 03: Job Matches
// ════════════════════════════════════════════════════════

/** Single job match card with rank, score, tags, and analysis. */
function JobMatchCard({
  job,
  rank,
  direction,
}: {
  job: JobMatch;
  rank: number;
  direction: ExpectedDirection | null;
}) {
  const scoreColor = getScoreColor(job.matchScore);
  const tags = getJobTags(job.matchScore, job.jobTitle, direction);

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: '12px',
        bgcolor: '#FCFCFC',
        border: '1px solid #F0F0F0',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: '#D0D0D0' },
      }}
    >
      {/* Rank circle + Job title + Score */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: scoreColor,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {rank}
        </Box>
        <Typography
          sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.bodyText, flex: 1 }}
        >
          {job.jobTitle}
        </Typography>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: scoreColor }}>
          {job.matchScore}
          <Typography
            component="span"
            sx={{ fontSize: '0.8rem', color: COLORS.secondaryText }}
          >
            /100
          </Typography>
        </Typography>
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={job.matchScore}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: '#F0F0F0',
          mb: 1.5,
          '& .MuiLinearProgress-bar': { bgcolor: scoreColor, borderRadius: 3 },
        }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          {tags.map((tag, idx) => (
            <Box
              key={idx}
              sx={{
                px: 1,
                py: 0.2,
                borderRadius: '6px',
                bgcolor: `${tag.color}15`,
                color: tag.color,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              {tag.label}
            </Box>
          ))}
        </Box>
      )}

      {/* Match reason */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
        <CheckCircleIcon
          sx={{ fontSize: 16, color: COLORS.excellent, mt: 0.1, flexShrink: 0 }}
        />
        <Box>
          <Typography
            component="span"
            sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.bodyText }}
          >
            匹配理由：
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: '0.8rem', color: COLORS.secondaryText }}
          >
            {job.matchReason}
          </Typography>
        </Box>
      </Box>

      {/* Gap analysis */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <WarningIcon sx={{ fontSize: 16, color: COLORS.average, mt: 0.1, flexShrink: 0 }} />
        <Box>
          <Typography
            component="span"
            sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.bodyText }}
          >
            能力差距：
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: '0.8rem', color: COLORS.secondaryText }}
          >
            {job.gapAnalysis}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/** Section 03: Job Match Recommendations. */
function JobMatchesSection({
  jobMatches,
  direction,
}: {
  jobMatches: JobMatch[];
  direction: ExpectedDirection | null;
}) {
  return (
    <SectionCard>
      <SectionHeader
        number="03"
        title="岗位匹配"
        subtitle="基于简历内容匹配最适合的医药行业岗位"
      />
      <Stack spacing={2}>
        {jobMatches.map((job, idx) => (
          <JobMatchCard key={idx} job={job} rank={idx + 1} direction={direction} />
        ))}
      </Stack>
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════
// Section 04: Market Info
// ════════════════════════════════════════════════════════

/** Section 04: Market Intelligence with sub-sections. */
function MarketInfoSection({ jobMarket }: { jobMarket: JobMarketInfo }) {
  return (
    <SectionCard>
      <SectionHeader
        number="04"
        title="市场情报"
        subtitle="实时医药招聘市场趋势与薪资参考"
      />

      <Stack spacing={2}>
        {/* Market summary - light blue highlighted box */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: '#E3F2FD',
            border: '1px solid #BBDEFB',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
            <InfoIcon sx={{ fontSize: 18, color: COLORS.good }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.bodyText }}>
              市场概况
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: '0.8rem', color: COLORS.secondaryText, lineHeight: 1.6 }}
          >
            {jobMarket.summary}
          </Typography>
        </Box>

        {/* Trends - with trending icon */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: '#FAFAFA',
            border: '1px solid #F0F0F0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 18, color: COLORS.good }} />
            <Typography
              sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.bodyText }}
            >
              招聘趋势
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: '0.8rem', color: COLORS.secondaryText, lineHeight: 1.6 }}
          >
            {jobMarket.trends}
          </Typography>
        </Box>

        {/* Salary - with money icon, highlighted badge */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: '#FAFAFA',
            border: '1px solid #F0F0F0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
            <PaidIcon sx={{ fontSize: 18, color: COLORS.low }} />
            <Typography
              sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.bodyText }}
            >
              薪资范围
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'inline-block',
              px: 2,
              py: 0.8,
              borderRadius: '8px',
              bgcolor: '#E8F5E9',
              border: `1px solid ${COLORS.low}`,
            }}
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.low }}>
              {jobMarket.salaryRange}
            </Typography>
          </Box>
        </Box>

        {/* Common requirements - checklist with green check icons */}
        {jobMarket.commonRequirements.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: '#FAFAFA',
              border: '1px solid #F0F0F0',
            }}
          >
            <Typography
              sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.bodyText, mb: 1 }}
            >
              常见要求
            </Typography>
            <Stack spacing={0.8}>
              {jobMarket.commonRequirements.map((req, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 16, color: COLORS.low, mt: 0.1, flexShrink: 0 }}
                  />
                  <Typography sx={{ fontSize: '0.8rem', color: COLORS.secondaryText }}>
                    {req}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Keywords - grid of chips with hover effect */}
        {jobMarket.keywords.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: '#FAFAFA',
              border: '1px solid #F0F0F0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.2 }}>
              <SearchIcon sx={{ fontSize: 18, color: '#FF6D00' }} />
              <Typography
                sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.bodyText }}
              >
                热门关键词
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 1,
              }}
            >
              {jobMarket.keywords.map((kw, idx) => (
                <Box
                  key={idx}
                  sx={{
                    textAlign: 'center',
                    px: 1,
                    py: 0.8,
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #F0F0F0',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: COLORS.bodyText,
                    cursor: 'default',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#FFF3E0',
                      borderColor: '#FF6D00',
                      color: '#FF6D00',
                    },
                  }}
                >
                  {kw}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════
// Section 05: Summary
// ════════════════════════════════════════════════════════

/** Section 05: Diagnosis Summary with action buttons. */
function SummarySection({ summary, onRetry }: { summary: string; onRetry: () => void }) {
  return (
    <SectionCard>
      <SectionHeader
        number="05"
        title="诊断总结"
        subtitle="综合评估与下一步行动建议"
      />

      {/* Summary text in highlighted box */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: '12px',
          bgcolor: '#F5F7FA',
          border: '1px solid #E8EDF2',
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <InfoIcon sx={{ fontSize: 18, color: COLORS.good, mt: 0.1, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.85rem', color: COLORS.bodyText, lineHeight: 1.8 }}>
            {summary}
          </Typography>
        </Box>
      </Box>

      {/* Action buttons */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{
            borderColor: COLORS.cardBorder,
            color: COLORS.bodyText,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            '&:hover': { borderColor: COLORS.good, bgcolor: '#F0F7FF' },
          }}
        >
          重新诊断
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => {
            /* placeholder: download report */
          }}
          sx={{
            borderColor: COLORS.cardBorder,
            color: COLORS.bodyText,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            '&:hover': { borderColor: COLORS.good, bgcolor: '#F0F7FF' },
          }}
        >
          下载报告
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={() => {
            /* placeholder: share results */
          }}
          sx={{
            borderColor: COLORS.cardBorder,
            color: COLORS.bodyText,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            '&:hover': { borderColor: COLORS.good, bgcolor: '#F0F7FF' },
          }}
        >
          分享结果
        </Button>
      </Stack>
    </SectionCard>
  );
}

// ════════════════════════════════════════════════════════
// Main ResultPage Component
// ════════════════════════════════════════════════════════

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [direction, setDirection] = useState<ExpectedDirection | null>(null);

  useEffect(() => {
    const state = location.state as
      | { result?: AnalysisResult; direction?: ExpectedDirection }
      | null;
    if (state?.result) {
      setResult(state.result);
      if (state.direction) {
        setDirection(state.direction);
      }
    }
  }, [location.state]);

  /** Navigate back to the upload page. */
  const handleBack = (): void => {
    navigate('/upload');
  };

  // No result state — show alert + back button
  if (!result) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: COLORS.pageBg }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: COLORS.good }}>
          <Toolbar>
            <IconButton color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              诊断结果
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            暂无诊断结果，请先上传简历。
          </Alert>
          <Button variant="contained" onClick={handleBack} sx={{ bgcolor: COLORS.good }}>
            返回上传页面
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: COLORS.pageBg }}>
      {/* AppBar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: COLORS.good }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            诊断结果
          </Typography>
          {direction && (
            <Chip
              label={DIRECTION_LABELS[direction]}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Section 01: Comprehensive Score */}
        <ScoreSection
          overallScore={result.overallScore}
          dimensions={result.dimensions ?? []}
          stats={result.stats}
        />

        {/* Section 02: Optimization Suggestions */}
        <SuggestionsSection suggestions={result.suggestions ?? []} />

        {/* Section 03: Job Match Recommendations */}
        <JobMatchesSection jobMatches={result.jobMatches ?? []} direction={direction} />

        {/* Section 04: Market Intelligence */}
        <MarketInfoSection jobMarket={result.jobMarket} />

        {/* Section 05: Diagnosis Summary */}
        <SummarySection summary={result.summary} onRetry={handleBack} />

        {/* Bottom action button */}
        <Box sx={{ textAlign: 'center', pb: 4, pt: 1 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleBack}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: COLORS.good,
              color: COLORS.good,
              '&:hover': { borderColor: '#1557B0', bgcolor: '#F0F7FF' },
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.2,
            }}
          >
            重新诊断
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ResultPage;
