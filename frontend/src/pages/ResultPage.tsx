import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Button, Divider, IconButton } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assessment as AssessmentIcon,
  Lightbulb as LightbulbIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  CompareArrows as CompareIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type {
  AnalysisResult,
  OptimizationSuggestion,
  JobMatch,
  JobMarketInfo,
  ScoreDimension,
  ExpectedDirection,
} from '../types';
import { DIRECTION_LABELS } from '../types';

/* ──────────────────────── Mock fallback data ──────────────────────── */

const MOCK_SCORE_DATA = {
  totalScore: 85,
  dimensions: [
    { name: '完整性', score: 92, maxScore: 25, details: ['所有简历模块齐全'] },
    { name: '行业匹配度', score: 88, maxScore: 30, details: ['方向匹配度高'] },
    { name: '量化表达', score: 75, maxScore: 15, details: ['量化数据可加强'] },
    { name: '专业性', score: 86, maxScore: 15, details: ['专业术语使用良好'] },
    { name: '结构清晰度', score: 82, maxScore: 15, details: ['结构基本清晰'] },
  ] as ScoreDimension[],
  summary: '简历整体质量良好，在完整性和行业匹配度方面表现优秀，建议加强数据量化表达。',
};

/* ──────────────────────── Helper components ──────────────────────── */

/** Circular score ring using SVG */
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{score}</div>
        <div style={{ fontSize: 10, color: '#64748B' }}>满分100</div>
      </div>
    </div>
  );
}

/** Horizontal score bar */
function ScoreBar({ score, maxScore = 100, color = '#D97706' }: { score: number; maxScore?: number; color?: string }) {
  const pct = Math.min((score / maxScore) * 100, 100);
  return (
    <div className="score-bar-track">
      <div className="score-bar-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

/** Sidebar navigation item */
function NavItem({
  icon,
  label,
  active,
  dotColor,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  dotColor?: string;
  onClick?: () => void;
}) {
  return (
    <div className={`sidebar-nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {dotColor && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: dotColor,
            flexShrink: 0,
          }}
        />
      )}
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/** Priority to color mapping */
function getPriorityConfig(priority: string) {
  switch (priority) {
    case 'high':
      return { color: '#DC2626', bg: '#FEE2E2', label: '需优化', icon: <ErrorIcon sx={{ fontSize: 16 }} /> };
    case 'medium':
      return { color: '#D97706', bg: '#FEF3C7', label: '建议关注', icon: <WarningIcon sx={{ fontSize: 16 }} /> };
    case 'low':
      return { color: '#059669', bg: '#D1FAE5', label: '表现良好', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
    default:
      return { color: '#64748B', bg: '#F1F5F9', label: '参考', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
  }
}

/** Category labels */
const CATEGORY_LABELS: Record<string, string> = {
  content_gap: '内容缺失',
  expression: '表达优化',
  structure: '结构问题',
  keyword: '关键词补充',
};

/* ──────────────────────── Section components ──────────────────────── */

/** Score overview card with bars and ring */
function ScoreOverviewCard({
  totalScore,
  dimensions,
}: {
  totalScore: number;
  dimensions: ScoreDimension[];
}) {
  return (
    <div className="dash-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          {dimensions.map((dim, idx) => {
            const pct = Math.round((dim.score / dim.maxScore) * 100);
            const barColor = pct >= 80 ? '#059669' : pct >= 60 ? '#D97706' : '#DC2626';
            return (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{dim.name}</span>
                  <span style={{ fontSize: 13, color: '#111827', fontWeight: 700 }}>{dim.score}<span style={{ color: '#9CA3AF', fontWeight: 400 }}>/{dim.maxScore}</span></span>
                </div>
                <ScoreBar score={dim.score} maxScore={dim.maxScore} color={barColor} />
              </div>
            );
          })}
        </div>
        <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ScoreRing score={totalScore} size={90} />
          <span style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>综合评分</span>
        </div>
      </div>
    </div>
  );
}

/** Optimization suggestions section */
function SuggestionsSection({ suggestions }: { suggestions: OptimizationSuggestion[] }) {
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const sorted = [...suggestions].sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );

  return (
    <div className="dash-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <LightbulbIcon sx={{ fontSize: 20, color: '#D97706' }} />
        <h3 className="dash-card-title" style={{ margin: 0 }}>优化建议</h3>
        <span className="status-pill pill-gray" style={{ marginLeft: 4 }}>{suggestions.length} 条</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map((suggestion, idx) => {
          const cfg = getPriorityConfig(suggestion.priority);
          return (
            <div
              key={idx}
              style={{
                padding: 14,
                backgroundColor: '#FAFBFC',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                <span className="status-pill" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                  {cfg.label}
                </span>
                <span className="status-pill pill-gray">
                  {CATEGORY_LABELS[suggestion.category] || suggestion.category}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                {suggestion.problem}
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                {suggestion.suggestion}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>优化进度</span>
          <span style={{ fontSize: 12, color: '#D97706', fontWeight: 600 }}>65%</span>
        </div>
        <ScoreBar score={65} color="#D97706" />
      </div>
    </div>
  );
}

/** Job matches section */
function JobMatchesSection({ jobMatches }: { jobMatches: JobMatch[] }) {
  return (
    <div className="dash-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <WorkIcon sx={{ fontSize: 20, color: '#334155' }} />
        <h3 className="dash-card-title" style={{ margin: 0 }}>岗位匹配</h3>
        <span className="status-pill pill-gray" style={{ marginLeft: 4 }}>Top {jobMatches.length}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {jobMatches.map((job, idx) => {
          const scoreColor = job.matchScore >= 80 ? '#059669' : job.matchScore >= 60 ? '#D97706' : '#DC2626';
          const matchLabel = job.matchScore >= 80 ? '匹配度高' : job.matchScore >= 60 ? '匹配度中' : '匹配度低';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: 14,
                backgroundColor: '#FAFBFC',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
                    {idx + 1}. {job.jobTitle}
                  </span>
                  <span
                    className="status-pill"
                    style={{
                      backgroundColor: scoreColor,
                      color: '#FFF',
                    }}
                  >
                    {matchLabel} {job.matchScore}%
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 4, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>匹配理由：</span>
                  {job.matchReason}
                </div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: '#475569' }}>能力差距：</span>
                  {job.gapAnalysis}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                <IconButton size="small" sx={{ color: '#9CA3AF' }}>
                  <AssessmentIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Job market info section */
function JobMarketSection({ jobMarket }: { jobMarket: JobMarketInfo }) {
  return (
    <div className="dash-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <TrendingUpIcon sx={{ fontSize: 20, color: '#334155' }} />
        <h3 className="dash-card-title" style={{ margin: 0 }}>市场情报</h3>
        <span className="status-pill pill-gray">联网搜索</span>
      </div>

      <div
        style={{
          padding: 14,
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 6,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>市场概况</div>
        <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{jobMarket.summary}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>招聘趋势</div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{jobMarket.trends}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>薪资范围</div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{jobMarket.salaryRange}</div>
        </div>
      </div>

      {jobMarket.commonRequirements.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>常见要求</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {jobMarket.commonRequirements.map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: '#059669' }} />
                <span style={{ fontSize: 13, color: '#475569' }}>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {jobMarket.keywords.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>热门关键词</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {jobMarket.keywords.map((kw, i) => (
              <span key={i} className="status-pill pill-gray">{kw}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────── Right panel components ──────────────────────── */

/** Right panel: score overview with checklist */
function RightScoreOverview({ dimensions }: { dimensions: ScoreDimension[] }) {
  return (
    <div className="dash-card">
      <h3 className="dash-card-title">评分总览</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {dimensions.map((dim, idx) => {
          const pct = Math.round((dim.score / dim.maxScore) * 100);
          const barColor = pct >= 80 ? '#059669' : pct >= 60 ? '#D97706' : '#DC2626';
          return (
            <div key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={pct >= 60}
                  readOnly
                  style={{ accentColor: pct >= 60 ? '#059669' : '#DC2626' }}
                />
                <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{dim.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{pct}</span>
              </div>
              <ScoreBar score={pct} color={barColor} />
            </div>
          );
        })}
      </div>

      <Divider sx={{ my: 1.5, borderColor: '#E5E7EB' }} />

      <div style={{ fontSize: 13, fontWeight: 600, color: '#DC2626', marginBottom: 8 }}>
        <ErrorIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
        未达标项
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {dimensions
          .filter((d) => (d.score / d.maxScore) * 100 < 60)
          .map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#DC2626' }} />
              <span style={{ fontSize: 12, color: '#DC2626' }}>{d.name}得分偏低</span>
            </div>
          ))}
        {dimensions.filter((d) => (d.score / d.maxScore) * 100 < 60).length === 0 && (
          <span style={{ fontSize: 12, color: '#059669' }}>所有维度均达标</span>
        )}
      </div>
    </div>
  );
}

/** Right panel: diagnostic stats */
function DiagnosticStats({ dimensions, totalScore }: { dimensions: ScoreDimension[]; totalScore: number }) {
  const stats = [
    { label: '综合评分', value: `${totalScore}`, color: '#059669' },
    { label: '评估维度', value: `${dimensions.length}`, color: '#3B82F6' },
    { label: '优秀维度', value: `${dimensions.filter((d) => (d.score / d.maxScore) >= 0.8).length}`, color: '#059669' },
    { label: '待优化项', value: `${dimensions.filter((d) => (d.score / d.maxScore) < 0.6).length}`, color: '#D97706' },
    { label: '最低维度', value: dimensions.length > 0 ? [...dimensions].sort((a, b) => a.score / a.maxScore - b.score / b.maxScore)[0].name : '-', color: '#8B5CF6' },
    { label: '最高维度', value: dimensions.length > 0 ? [...dimensions].sort((a, b) => b.score / a.maxScore - a.score / a.maxScore)[0].name : '-', color: '#14B8A6' },
  ];

  return (
    <div className="dash-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h3 className="dash-card-title" style={{ margin: 0, flex: 1 }}>诊断统计</h3>
        <ExpandMoreIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: stat.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: '#475569', flex: 1 }}>{stat.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────── Main ResultPage ──────────────────────── */

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [direction, setDirection] = useState<ExpectedDirection | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const sectionRefs = {
    overview: useRef<HTMLDivElement>(null),
    suggestions: useRef<HTMLDivElement>(null),
    jobs: useRef<HTMLDivElement>(null),
    market: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const state = location.state as { result?: AnalysisResult; direction?: ExpectedDirection } | null;
    if (state?.result) {
      setResult(state.result);
      if (state.direction) {
        setDirection(state.direction);
      }
    }
  }, [location.state]);

  const handleBack = () => navigate('/upload');

  // Scroll to section
  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const ref = sectionRefs[section as keyof typeof sectionRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!result) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <AssessmentIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#475569', mb: 2 }}>
            暂无诊断结果，请先上传简历
          </Typography>
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1E293B' }, textTransform: 'none' }}
          >
            返回上传页面
          </Button>
        </div>
      </div>
    );
  }

  // Use real data if available, fallback to mock
  const totalScore = result.totalScore ?? MOCK_SCORE_DATA.totalScore;
  const dimensions = result.dimensions?.length > 0 ? result.dimensions : MOCK_SCORE_DATA.dimensions;
  const summary = result.summary || MOCK_SCORE_DATA.summary;
  const suggestions = result.suggestions || [];
  const jobMatches = result.jobMatches || [];
  const jobMarket = result.jobMarket || { trends: '', commonRequirements: [], salaryRange: '', keywords: [], summary: '' };

  // Score level
  const scoreLevel = totalScore >= 80 ? { label: '良好', color: '#059669', bg: '#D1FAE5' } : totalScore >= 60 ? { label: '中等', color: '#D97706', bg: '#FEF3C7' } : { label: '待提升', color: '#DC2626', bg: '#FEE2E2' };

  return (
    <div className="dashboard-root">
      {/* ──────────── Left Sidebar ──────────── */}
      <div className="dashboard-sidebar">
        {/* Logo */}
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AssessmentIcon sx={{ fontSize: 18, color: '#FFF' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>医药简历诊断</span>
        </div>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Navigation */}
        <div style={{ flex: 1, padding: '12px 0' }}>
          <NavItem
            icon={<AssessmentIcon sx={{ fontSize: 18 }} />}
            label="综合评分"
            active={activeSection === 'overview'}
            dotColor="#D97706"
            onClick={() => scrollToSection('overview')}
          />
          <NavItem
            icon={<LightbulbIcon sx={{ fontSize: 18 }} />}
            label="优化建议"
            active={activeSection === 'suggestions'}
            dotColor="#E8A598"
            onClick={() => scrollToSection('suggestions')}
          />
          <NavItem
            icon={<WorkIcon sx={{ fontSize: 18 }} />}
            label="岗位匹配"
            active={activeSection === 'jobs'}
            dotColor="#90A4AE"
            onClick={() => scrollToSection('jobs')}
          />
          <NavItem
            icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
            label="市场情报"
            active={activeSection === 'market'}
            dotColor="#A8C6A8"
            onClick={() => scrollToSection('market')}
          />
        </div>

        {/* User info */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonIcon sx={{ fontSize: 18, color: '#CBD5E1' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#E2E8F0' }}>用户已登录</div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>
                {direction ? DIRECTION_LABELS[direction].split(' ')[0] : '诊断完成'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── Center Main Area ──────────── */}
      <div className="dashboard-main">
        {/* Header card */}
        <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconButton onClick={handleBack} sx={{ color: '#475569' }}>
            <ArrowBackIcon />
          </IconButton>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>简历诊断报告</div>
            {direction && (
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                方向：{DIRECTION_LABELS[direction]}
              </div>
            )}
          </div>
          <span className="status-pill" style={{ backgroundColor: scoreLevel.bg, color: scoreLevel.color }}>
            {scoreLevel.label}
          </span>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{
              borderColor: '#D1D5DB',
              color: '#475569',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { borderColor: '#9CA3AF', bgcolor: '#F9FAFB' },
            }}
          >
            导出报告
          </Button>
        </div>

        {/* Summary text */}
        <div className="dash-card" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>总体评语</div>
          <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{summary}</div>
        </div>

        {/* 01 - Score Overview */}
        <div ref={sectionRefs.overview}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginLeft: 4 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>01</span>
            <span style={{ fontSize: 12, color: '#D1D5DB' }}>/</span>
            <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>综合评分</span>
          </div>
          <ScoreOverviewCard totalScore={totalScore} dimensions={dimensions} />
        </div>

        {/* 02 - Optimization Suggestions */}
        <div ref={sectionRefs.suggestions}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginLeft: 4 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>02</span>
            <span style={{ fontSize: 12, color: '#D1D5DB' }}>/</span>
            <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>优化建议</span>
          </div>
          <SuggestionsSection suggestions={suggestions} />
        </div>

        {/* 03 - Job Matches */}
        <div ref={sectionRefs.jobs}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginLeft: 4 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>03</span>
            <span style={{ fontSize: 12, color: '#D1D5DB' }}>/</span>
            <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>岗位匹配</span>
          </div>
          <JobMatchesSection jobMatches={jobMatches} />
        </div>

        {/* 04 - Job Market Info */}
        <div ref={sectionRefs.market}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginLeft: 4 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>04</span>
            <span style={{ fontSize: 12, color: '#D1D5DB' }}>/</span>
            <span style={{ fontSize: 14, color: '#334155', fontWeight: 600 }}>市场情报</span>
          </div>
          <JobMarketSection jobMarket={jobMarket} />
        </div>

        {/* Action button */}
        <div style={{ textAlign: 'center', paddingBottom: 24, paddingTop: 8 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleBack}
            sx={{
              borderColor: '#334155',
              color: '#334155',
              '&:hover': { borderColor: '#1E293B', bgcolor: '#F8FAFC' },
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
            }}
          >
            重新诊断
          </Button>
        </div>
      </div>

      {/* ──────────── Right Panel ──────────── */}
      <div className="dashboard-right">
        <RightScoreOverview dimensions={dimensions} />
        <DiagnosticStats dimensions={dimensions} totalScore={totalScore} />

        {/* Bottom action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={<AssessmentIcon />}
            sx={{
              bgcolor: '#334155',
              '&:hover': { bgcolor: '#1E293B' },
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            查看完整报告
          </Button>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<CompareIcon />}
            sx={{
              borderColor: '#334155',
              color: '#334155',
              '&:hover': { borderColor: '#1E293B', bgcolor: '#F8FAFC' },
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            对比岗位
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
