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

/** 单维度评分 */
export interface ScoreDimension {
  /** 维度名称（中文） */
  name: string;
  /** 实际得分 */
  score: number;
  /** 满分 */
  maxScore: number;
  /** 维度详细反馈 */
  details: string[];
}

/** 规则引擎返回的完整评分数据 */
export interface ResumeAnalysisData {
  /** 总分 0-100 */
  totalScore: number;
  /** 5 个维度评分 */
  dimensions: ScoreDimension[];
  /** 总体评语 */
  summary: string;
  /** 优化建议 */
  suggestions: OptimizationSuggestion[];
}

/** 完整分析结果 */
export interface AnalysisResult {
  /** 总分 0-100 */
  totalScore: number;
  /** 各维度评分 */
  dimensions: ScoreDimension[];
  /** 总体评语 */
  summary: string;
  /** 优化建议列表 */
  suggestions: OptimizationSuggestion[];
  /** 匹配岗位 Top-5 */
  jobMatches: JobMatch[];
  /** 岗位市场信息 */
  jobMarket: JobMarketInfo;
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
