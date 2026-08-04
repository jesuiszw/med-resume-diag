/**
 * Shared type definitions for the Medical Resume Diagnosis MVP.
 * These types are used by both frontend and backend.
 */

/** 期望方向枚举 — 医药/器械行业岗位方向 */
export enum ExpectedDirection {
  ProductManager = 'product_manager',
  MSL = 'msl',
  SalesSpecialist = 'sales_specialist',
  MarketingExecutive = 'marketing_executive',
  MarketAccess = 'market_access',
  ClinicalTrial = 'clinical_trial',
  Pharmacovigilance = 'pharmacovigilance',
  RegulatoryAffairs = 'regulatory_affairs',
  BusinessDevelopment = 'business_development',
  DeviceSales = 'device_sales',
}

/** 期望方向的显示标签映射 */
export const DIRECTION_LABELS: Record<ExpectedDirection, string> = {
  [ExpectedDirection.ProductManager]: '产品经理 (Product Manager)',
  [ExpectedDirection.MSL]: '医学联络官 (MSL)',
  [ExpectedDirection.SalesSpecialist]: '销售专员 (Sales Specialist)',
  [ExpectedDirection.MarketingExecutive]: '市场营销 (Marketing Executive)',
  [ExpectedDirection.MarketAccess]: '市场准入 (Market Access)',
  [ExpectedDirection.ClinicalTrial]: '临床试验 (Clinical Trial)',
  [ExpectedDirection.Pharmacovigilance]: '药物警戒 (Pharmacovigilance)',
  [ExpectedDirection.RegulatoryAffairs]: '注册事务 (Regulatory Affairs)',
  [ExpectedDirection.BusinessDevelopment]: '商务拓展 (Business Development)',
  [ExpectedDirection.DeviceSales]: '医疗器械销售 (Device Sales)',
};

/** 优化建议分类 */
export type SuggestionCategory =
  | 'content_gap'
  | 'expression'
  | 'structure'
  | 'keyword';

/** 优先级 */
export type Priority = 'high' | 'medium' | 'low';

/** 简历优化建议 */
export interface OptimizationSuggestion {
  /** 问题描述 */
  problem: string;
  /** 具体建议 */
  suggestion: string;
  /** 建议分类 */
  category: SuggestionCategory;
  /** 优先级 */
  priority: Priority;
}

/** 匹配岗位结果 */
export interface JobMatch {
  /** 岗位名称 */
  jobTitle: string;
  /** 匹配度评分 0-100 */
  matchScore: number;
  /** 匹配理由 */
  matchReason: string;
  /** 能力差距分析 */
  gapAnalysis: string;
}

/** 岗位市场信息 */
export interface JobMarketInfo {
  /** 招聘趋势描述 */
  trends: string;
  /** 常见要求列表 */
  commonRequirements: string[];
  /** 薪资范围 */
  salaryRange: string;
  /** 关键词聚合 */
  keywords: string[];
  /** 市场概况总结 */
  summary: string;
}

/** 结构化简历数据 */
export interface StructuredResumeData {
  /** 基本信息 */
  basicInfo: string;
  /** 教育背景 */
  education: string;
  /** 工作经历 */
  workExperience: string;
  /** 项目经历 */
  projectExperience: string;
  /** 技能 */
  skills: string;
}

/** 评分维度状态 */
export type ScoreStatus = 'excellent' | 'good' | 'average' | 'poor';

/** 评分维度详情 */
export interface ScoreDimension {
  /** 维度名称 */
  name: string;
  /** 得分 */
  score: number;
  /** 满分 */
  maxScore: number;
  /** 权重 */
  weight: number;
  /** 维度描述 */
  description: string;
  /** 评估状态 */
  status: ScoreStatus;
  /** 改进建议 */
  tips: string[];
}

/** 分析统计信息 */
export interface AnalysisStats {
  /** 总建议数 */
  totalSuggestions: number;
  /** 高优先级建议数 */
  highPriority: number;
  /** 中优先级建议数 */
  mediumPriority: number;
  /** 低优先级建议数 */
  lowPriority: number;
  /** 命中关键词数 */
  keywordHits: number;
  /** 关键词总数 */
  keywordTotal: number;
}

/** 诊断统计（与 AnalysisStats 等价，新代码推荐使用） */
export interface DiagnosisStats {
  /** 总建议数 */
  totalSuggestions: number;
  /** 高优先级建议数 */
  highPriority: number;
  /** 中优先级建议数 */
  mediumPriority: number;
  /** 低优先级建议数 */
  lowPriority: number;
  /** 命中关键词数 */
  keywordHits: number;
  /** 关键词总数 */
  keywordTotal: number;
}

/** 完整分析结果 */
export interface AnalysisResult {
  /** 优化建议列表 */
  suggestions: OptimizationSuggestion[];
  /** 匹配岗位 Top-5 */
  jobMatches: JobMatch[];
  /** 岗位市场信息 */
  jobMarket: JobMarketInfo;
  /** 综合得分 0-100 */
  overallScore: number;
  /** 5 维度评分详情 */
  dimensions: ScoreDimension[];
  /** AI 生成的总结文字 */
  summary: string;
  /** 诊断统计信息 */
  stats: DiagnosisStats;
}

/** 上传响应 */
export interface UploadResponse {
  /** 分析结果 */
  result: AnalysisResult;
}

/** API错误响应 */
export interface ApiErrorResponse {
  error: string;
  detail?: string;
}
