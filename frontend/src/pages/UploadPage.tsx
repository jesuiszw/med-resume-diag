import { useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  AppBar,
  Toolbar,
  Chip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ExpectedDirection, DIRECTION_LABELS } from '../types';
import { uploadAndAnalyze } from '../services/api';

/** All available direction options for the dropdown */
const DIRECTION_OPTIONS = Object.values(ExpectedDirection);

/** Loading status messages shown during analysis */
const LOADING_STEPS = [
  '正在解析简历文档…',
  'AI正在分析简历优化建议…',
  'AI正在匹配医疗行业岗位…',
  'AI正在搜索互联网岗位信息…',
  '正在汇总分析结果…',
];

function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [direction, setDirection] = useState<ExpectedDirection>(ExpectedDirection.ProductManager);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  /** Handles file selection validation */
  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx')) {
      setError('仅支持 .docx 格式的 Word 文件');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过 10MB');
      return;
    }
    setError(null);
    setSelectedFile(file);
  }, []);

  /** Handles drag over event */
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  /** Handles drag leave event */
  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  /** Handles file drop */
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  /** Handles click on the upload area */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /** Handles file input change */
  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  /** Simulates progress through loading steps */
  const startLoadingProgress = useCallback(() => {
    let step = 0;
    setLoadingStep(0);
    const interval = setInterval(() => {
      step += 1;
      if (step < LOADING_STEPS.length) {
        setLoadingStep(step);
      } else {
        clearInterval(interval);
      }
    }, 8000);
    return interval;
  }, []);

  /** Handles upload and analysis submission */
  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError('请先选择简历文件');
      return;
    }
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setIsLoading(true);
    setError(null);
    const progressInterval = startLoadingProgress();

    try {
      const result = await uploadAndAnalyze(selectedFile, direction);
      clearInterval(progressInterval);
      navigate('/result', { state: { result, direction } });
    } catch (err: unknown) {
      clearInterval(progressInterval);
      let message = '分析失败，请重试';
      if (err instanceof Error) {
        message = err.message;
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as Record<string, unknown>).response === 'object' &&
        (err as Record<string, unknown>).response !== null
      ) {
        const response = (err as { response: { data?: { error?: string } } }).response;
        message = response.data?.error || message;
      }
      setError(message || '分析失败，请检查网络或稍后重试');
    } finally {
      clearInterval(progressInterval);
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [selectedFile, direction, navigate, startLoadingProgress]);

  return (
    <div className="app-container">
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#334155' }}>
        <Toolbar>
          <DescriptionIcon sx={{ mr: 1, color: '#D97706' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: '#F1F5F9' }}>
            医药简历诊断工具
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#1E293B', fontWeight: 700 }}>
            简历智能诊断
          </Typography>
          <Typography variant="body1" sx={{ color: '#475569' }}>
            上传您的 Word 简历，选择期望方向，获取专业的优化建议与岗位匹配
          </Typography>
        </Box>

        {/* Upload Area */}
        <Paper
          elevation={isDragging ? 8 : 1}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 3,
            textAlign: 'center',
            cursor: 'pointer',
            border: isDragging ? '3px dashed #D97706' : '2px dashed #CBD5E1',
            bgcolor: isDragging ? '#FEF3C7' : '#FFFFFF',
            transition: 'all 0.3s ease',
            borderRadius: 2,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            hidden
            onChange={handleFileInputChange}
          />
          <CloudUploadIcon sx={{ fontSize: 64, color: '#64748B', mb: 2 }} />
          {selectedFile ? (
            <Box>
              <Typography variant="h6" sx={{ color: '#334155' }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB · 点击重新选择
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#1E293B' }}>
                拖拽简历文件到此处，或点击选择
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                仅支持 .docx 格式，文件大小不超过 10MB
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Direction Selector */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="direction-label">期望方向</InputLabel>
          <Select
            labelId="direction-label"
            value={direction}
            label="期望方向"
            onChange={(e) => setDirection(e.target.value as ExpectedDirection)}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
            }}
          >
            {DIRECTION_OPTIONS.map((dir) => (
              <MenuItem key={dir} value={dir}>
                {DIRECTION_LABELS[dir]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading Progress */}
        {isLoading && (
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #D1D5DB' }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#334155' }}>
              {LOADING_STEPS[loadingStep]}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={((loadingStep + 1) / LOADING_STEPS.length) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#E5E7EB',
                '& .MuiLinearProgress-bar': { bgcolor: '#D97706' },
              }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {LOADING_STEPS.map((step, idx) => (
                <Chip
                  key={idx}
                  label={step}
                  size="small"
                  sx={{
                    bgcolor: idx < loadingStep ? '#D1FAE5' : idx === loadingStep ? '#FEF3C7' : '#F3F4F6',
                    color: idx < loadingStep ? '#059669' : idx === loadingStep ? '#D97706' : '#9CA3AF',
                    border: 'none',
                  }}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Upload Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            bgcolor: '#334155',
            '&:hover': { bgcolor: '#1E293B' },
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {isLoading ? '分析中…' : '开始诊断'}
        </Button>

        {/* Footer note */}
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#9CA3AF' }}
        >
          本工具使用 AI 进行分析，结果仅供参考。您的简历内容不会被存储。
        </Typography>
      </Container>
    </div>
  );
}

export default UploadPage;
