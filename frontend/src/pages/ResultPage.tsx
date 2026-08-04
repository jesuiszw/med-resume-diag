import { useEffect, useState, type ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  AppBar,
  Toolbar,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Lightbulb as LightbulbIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { AnalysisResult, OptimizationSuggestion, JobMatch, JobMarketInfo, ExpectedDirection } from '../types';
import { DIRECTION_LABELS } from '../types';

/** Category labels for optimization suggestions */
const CATEGORY_LABELS: Record<string, string> = {
  content_gap: '内容缺失',
  expression: '表达优化',
  structure: '结构问题',
  keyword: '关键词补充',
};

/** Priority config: color and icon */
const PRIORITY_CONFIG: Record<string, { color: 'error' | 'warning' | 'info'; icon: ReactElement }> = {
  high: { color: 'error', icon: <ErrorIcon /> },
  medium: { color: 'warning', icon: <WarningIcon /> },
  low: { color: 'info', icon: <InfoIcon /> },
};

/** Priority label */
const PRIORITY_LABELS: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

/** Renders the resume optimization suggestions section */
function SuggestionsSection({ suggestions }: { suggestions: OptimizationSuggestion[] }) {
  // Sort by priority: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...suggestions].sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );

  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ color: '#1A73E8', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            简历优化建议
          </Typography>
          <Chip label={`${suggestions.length} 条`} size="small" sx={{ ml: 2, bgcolor: '#E8F0FE', color: '#1A73E8' }} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sorted.map((suggestion, idx) => {
            const priorityCfg = PRIORITY_CONFIG[suggestion.priority] || PRIORITY_CONFIG.low;
            return (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#FAFBFC',
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                  <Chip
                    label={CATEGORY_LABELS[suggestion.category] || suggestion.category}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#1A73E8', color: '#1A73E8' }}
                  />
                  <Chip
                    icon={priorityCfg.icon}
                    label={`优先级: ${PRIORITY_LABELS[suggestion.priority] || suggestion.priority}`}
                    size="small"
                    color={priorityCfg.color}
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                  问题：{suggestion.problem}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  建议：{suggestion.suggestion}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

/** Renders the job match recommendations section */
function JobMatchesSection({ jobMatches }: { jobMatches: JobMatch[] }) {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WorkIcon sx={{ color: '#1A73E8', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            匹配岗位推荐
          </Typography>
          <Chip label={`Top ${jobMatches.length}`} size="small" sx={{ ml: 2, bgcolor: '#E8F0FE', color: '#1A73E8' }} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {jobMatches.map((job, idx) => {
            const scoreColor =
              job.matchScore >= 80 ? '#34A853' : job.matchScore >= 60 ? '#1A73E8' : '#FBBC04';
            return (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#FAFBFC',
                  border: '1px solid #E0E0E0',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    {idx + 1}. {job.jobTitle}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ color: scoreColor, fontWeight: 700 }}>
                      {job.matchScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      /100
                    </Typography>
                  </Box>
                </Box>
                {/* Match score progress bar */}
                <LinearProgress
                  variant="determinate"
                  value={job.matchScore}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    mb: 1.5,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': { bgcolor: scoreColor },
                  }}
                />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ fontWeight: 600, color: '#1A73E8' }}>匹配理由：</Box>
                  {job.matchReason}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Box component="span" sx={{ fontWeight: 600, color: '#5F6368' }}>能力差距：</Box>
                  {job.gapAnalysis}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

/** Renders the job market information section */
function JobMarketSection({ jobMarket }: { jobMarket: JobMarketInfo }) {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ color: '#1A73E8', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            互联网岗位信息
          </Typography>
          <Chip label="联网搜索" size="small" sx={{ ml: 2, bgcolor: '#E8F0FE', color: '#1A73E8' }} />
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Summary */}
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#E8F0FE', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A73E8', mb: 0.5 }}>
            市场概况
          </Typography>
          <Typography variant="body2" color="text.primary">
            {jobMarket.summary}
          </Typography>
        </Paper>

        {/* Trends */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#333' }}>
            招聘趋势
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {jobMarket.trends}
          </Typography>
        </Box>

        {/* Salary Range */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#333' }}>
            薪资范围
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {jobMarket.salaryRange}
          </Typography>
        </Box>

        {/* Common Requirements */}
        {jobMarket.commonRequirements.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
              常见要求
            </Typography>
            <List dense>
              {jobMarket.commonRequirements.map((req, idx) => (
                <ListItem key={idx} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#34A853' }} />
                  </ListItemIcon>
                  <ListItemText primary={req} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Keywords */}
        {jobMarket.keywords.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
              热门关键词
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {jobMarket.keywords.map((kw, idx) => (
                <Chip key={idx} label={kw} size="small" sx={{ bgcolor: '#F1F3F4' }} />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [direction, setDirection] = useState<ExpectedDirection | null>(null);

  useEffect(() => {
    const state = location.state as { result?: AnalysisResult; direction?: ExpectedDirection } | null;
    if (state?.result) {
      setResult(state.result);
      if (state.direction) {
        setDirection(state.direction);
      }
    }
  }, [location.state]);

  /** Handles navigation back to upload page */
  const handleBack = () => {
    navigate('/upload');
  };

  // If no result (e.g. user navigated directly), show a prompt
  if (!result) {
    return (
      <div className="app-container">
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#1A73E8' }}>
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
          <Button variant="contained" onClick={handleBack} sx={{ bgcolor: '#1A73E8' }}>
            返回上传页面
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1A73E8' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            诊断结果
          </Typography>
          {direction && (
            <Chip
              label={`方向：${DIRECTION_LABELS[direction]}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Resume Optimization Suggestions */}
        <SuggestionsSection suggestions={result.suggestions} />

        {/* Job Match Recommendations */}
        <JobMatchesSection jobMatches={result.jobMatches} />

        {/* Job Market Info */}
        <JobMarketSection jobMarket={result.jobMarket} />

        {/* Action button */}
        <Box sx={{ textAlign: 'center', pb: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleBack}
            sx={{
              borderColor: '#1A73E8',
              color: '#1A73E8',
              '&:hover': { borderColor: '#1557B0', bgcolor: '#E8F0FE' },
              borderRadius: 3,
              px: 4,
            }}
          >
            重新诊断
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default ResultPage;
