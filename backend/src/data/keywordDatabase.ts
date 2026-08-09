import { ExpectedDirection } from '../types';

/**
 * Keyword set for a specific career direction in the medical/device industry.
 */
export interface KeywordSet {
  /** Core industry keywords for this direction (10-20 Chinese keywords) */
  keywords: string[];
  /** Required / commonly expected skills */
  requiredSkills: string[];
  /** Typical job titles for this direction */
  typicalTitles: string[];
  /** Salary range description */
  salaryRange: string;
}

/**
 * Keyword database covering all 10 ExpectedDirection values.
 * Each entry contains curated, professionally-accurate terminology
 * used in the Chinese pharmaceutical and medical-device industry.
 */
export const keywordDatabase: Record<ExpectedDirection, KeywordSet> = {
  [ExpectedDirection.ProductManager]: {
    keywords: [
      '市场推广',
      '品牌管理',
      'KOL管理',
      '学术推广',
      '产品定位',
      '市场策略',
      'SFE',
      '数字营销',
      '竞品分析',
      '市场调研',
      '产品上市',
      '生命周期管理',
      '价格策略',
      'ROI分析',
      '产品线管理',
      '市场细分',
      '推广方案',
      '学术会议',
      '专家网络',
      '跨部门协作',
    ],
    requiredSkills: [
      '市场分析能力',
      '产品策划能力',
      '项目管理能力',
      '数据分析能力',
      '跨部门沟通能力',
      'PPT制作与演讲',
    ],
    typicalTitles: [
      '产品经理',
      '高级产品经理',
      '产品总监',
      '治疗领域经理',
      '市场部经理',
    ],
    salaryRange: '20K-50K/月（外资药企中高级）',
  },

  [ExpectedDirection.MSL]: {
    keywords: [
      '医学联络',
      '医学科学',
      'KOL互动',
      '学术交流',
      '临床证据',
      '医学策略',
      '专家网络',
      '医学教育',
      '医学支持',
      '文献检索',
      '医学演讲',
      '治疗领域',
      '药物机制',
      '临床试验数据',
      '医学咨询',
      '学术拜访',
      '医学沟通',
      '疾病领域知识',
      '循证医学',
      '医学事务',
    ],
    requiredSkills: [
      '医学/药学/生命科学硕士及以上',
      '学术演讲能力',
      '文献解读能力',
      'KOL管理能力',
      '跨部门协作能力',
    ],
    typicalTitles: [
      '医学联络官',
      '高级医学联络官',
      '医学事务经理',
      '医学顾问',
      'MSL Manager',
    ],
    salaryRange: '25K-60K/月（硕士起步，博士更优）',
  },

  [ExpectedDirection.SalesSpecialist]: {
    keywords: [
      '销售达成',
      '客户开发',
      '学术拜访',
      '终端覆盖',
      '销售指标',
      '客户关系管理',
      '渠道管理',
      '药剂科',
      '处方医生',
      '销售区域',
      '业绩增长',
      '客户拜访',
      '竞品应对',
      '进院开发',
      '销售报表',
      'CRM系统',
      '回款管理',
      '临床推广',
      '医院覆盖',
      '销售目标',
    ],
    requiredSkills: [
      '沟通表达能力',
      '客户开发与维护',
      '抗压能力',
      '目标导向',
      '医药相关知识',
    ],
    typicalTitles: [
      '医药代表',
      '销售专员',
      '高级医药代表',
      '区域销售经理',
      '销售代表',
    ],
    salaryRange: '10K-30K/月（底薪+提成）',
  },

  [ExpectedDirection.MarketingExecutive]: {
    keywords: [
      '市场策略',
      '营销策略',
      '推广策略',
      '销售策略',
      '市场规划',
      '市场推广',
      '产品推广',
      '学术推广',
      '品牌管理',
      '品牌建设',
      '品牌传播',
      '数字化营销',
      '数字营销',
      '全渠道',
      '全渠道营销',
      '线上线下',
      '线上推广',
      '线下活动',
      'SFE',
      '客户管理',
      '客户分级',
      '终端管理',
      '市场活动',
      '活动策划',
      '活动计划',
      '学术会议',
      '会议管理',
      '市场分析',
      '数据分析',
      '竞品分析',
      '市场调研',
      '市场洞察',
      '渠道管理',
      '区域管理',
      '资源管理',
      '资源规划',
      '预算管理',
      '预算控制',
      '费用管理',
      '营销预算',
      'KOL',
      'KOL管理',
      'KOL合作',
      '医生教育',
      '患者教育',
      '市场准入',
      '产品定位',
      '生命周期管理',
      '份额增长',
      '销售支持',
      '销售管理',
      '团队管理',
      '绩效管理',
      '指标管理',
      '指标设置',
      '奖金设计',
      '营销管理',
      '营销执行',
      '推广方案',
      '推广计划',
      '市场渗透',
      '市场覆盖',
      '区域覆盖',
    ],
    requiredSkills: [
      '市场策划与推广能力',
      '数据分析能力',
      '客户管理与分级能力',
      '跨部门协作能力',
      '预算与资源规划能力',
    ],
    typicalTitles: [
      '市场专员',
      '市场经理',
      '品牌经理',
      '市场推广经理',
      '数字化营销经理',
    ],
    salaryRange: '15K-40K/月',
  },

  [ExpectedDirection.MarketAccess]: {
    keywords: [
      '市场准入',
      '医保谈判',
      '药物经济学',
      '准入策略',
      '医保目录',
      '国家医保',
      'DRG/DIP',
      '招标采购',
      '集采',
      '定价策略',
      '报销政策',
      '卫生技术评估',
      'HTA',
      '证据生成',
      '价值医疗',
      '准入路径',
      '政策分析',
      '政府事务',
      '商保合作',
      '创新支付',
    ],
    requiredSkills: [
      '政策分析能力',
      '药物经济学知识',
      '谈判能力',
      '政府关系维护',
      '数据分析能力',
    ],
    typicalTitles: [
      '市场准入经理',
      '准入与政策总监',
      '药物经济学经理',
      '政府事务经理',
      '市场准入总监',
    ],
    salaryRange: '25K-60K/月（政策密集型岗位）',
  },

  [ExpectedDirection.ClinicalTrial]: {
    keywords: [
      '临床试验',
      'GCP',
      'CRA',
      '临床方案设计',
      '入组管理',
      '数据监查',
      '伦理审查',
      '研究者沟通',
      '试验药物管理',
      '不良事件',
      'SAE',
      '临床稽查',
      '临床运营',
      'CRO管理',
      '受试者招募',
      '临床试验方案',
      '知情同意书',
      '临床数据管理',
      '生物统计',
      '中心筛选',
    ],
    requiredSkills: [
      'GCP证书',
      '临床监查经验',
      '方案理解能力',
      '项目管理能力',
      '医学/药学背景',
    ],
    typicalTitles: [
      '临床监查员',
      '高级CRA',
      '临床项目经理',
      '临床运营经理',
      '临床试验总监',
    ],
    salaryRange: '15K-45K/月（CRA经验越高薪资越高）',
  },

  [ExpectedDirection.Pharmacovigilance]: {
    keywords: [
      '药物警戒',
      '不良反应报告',
      'ADR',
      'AE',
      'PSUR',
      'DSUR',
      '信号检测',
      '风险管理',
      'RMP',
      '个例报告',
      '文献监测',
      '安全性数据',
      '上市后监测',
      '药品安全',
      '定期安全性更新报告',
      '安全性分析',
      '合规报告',
      'E2B',
      '药物警戒体系',
      '安全信号',
    ],
    requiredSkills: [
      '药物警戒法规知识',
      '医学/药学背景',
      '报告撰写能力',
      '数据分析能力',
      '英文文献阅读',
    ],
    typicalTitles: [
      '药物警戒专员',
      '药物警戒经理',
      '药品安全经理',
      'PV经理',
      '药物警戒总监',
    ],
    salaryRange: '15K-40K/月',
  },

  [ExpectedDirection.RegulatoryAffairs]: {
    keywords: [
      '注册申报',
      'NMPA',
      'IND',
      'NDA',
      'CTD格式',
      '注册策略',
      '技术审评',
      '补充申请',
      '再注册',
      '注册资料',
      '法规事务',
      '药品注册',
      '医疗器械注册',
      '临床试验批件',
      '注册法规',
      '合规管理',
      '申报路径',
      '审评沟通',
      '一致性评价',
      '注册分类',
    ],
    requiredSkills: [
      '法规知识（药品/器械注册管理办法）',
      'CTD撰写能力',
      '英文读写能力',
      '注册策略制定',
      '跨部门协调',
    ],
    typicalTitles: [
      '注册专员',
      '注册经理',
      '注册事务总监',
      '法规事务经理',
      'RA Manager',
    ],
    salaryRange: '15K-45K/月',
  },

  [ExpectedDirection.BusinessDevelopment]: {
    keywords: [
      '商务拓展',
      'BD',
      'license in',
      'license out',
      '合作引进',
      '项目评估',
      '尽职调查',
      '交易结构',
      '商务谈判',
      '合作协议',
      '市场尽调',
      '管线评估',
      '技术引进',
      '授权交易',
      '估值模型',
      '行业洞察',
      '商务沟通',
      '战略合作',
      '并购',
      '投资评估',
    ],
    requiredSkills: [
      '商务谈判能力',
      '财务分析/估值能力',
      '行业洞察力',
      '英文沟通能力',
      '项目管理能力',
    ],
    typicalTitles: [
      'BD经理',
      '商务拓展总监',
      '投资并购经理',
      '授权引进经理',
      '战略合作经理',
    ],
    salaryRange: '25K-70K/月（资深BD薪资弹性大）',
  },

  [ExpectedDirection.DeviceSales]: {
    keywords: [
      '医疗器械销售',
      '设备招标',
      '终端开发',
      '渠道分销',
      '医院采购',
      '设备演示',
      '技术支持',
      '代理商管理',
      '设备装机',
      '售后服务',
      '招标投标',
      '设备科',
      '科室开发',
      '设备维护',
      '销售达成',
      '经销商管理',
      '招标文件',
      '设备推广',
      '耗材销售',
      '临床科室',
    ],
    requiredSkills: [
      '销售与客户开发',
      '医疗器械产品知识',
      '招标流程熟悉',
      '技术演示能力',
      '渠道管理能力',
    ],
    typicalTitles: [
      '医疗器械销售代表',
      '设备销售经理',
      '区域销售经理',
      '耗材销售代表',
      '大区销售总监',
    ],
    salaryRange: '10K-35K/月（底薪+提成，设备类提成较高）',
  },
};

/**
 * Returns the keyword set for the given direction.
 *
 * @param direction - The expected career direction
 * @returns The keyword set for that direction
 */
export function getKeywordSet(direction: ExpectedDirection): KeywordSet {
  return keywordDatabase[direction];
}

/**
 * Collects keywords from all directions into a flat array.
 * Useful for general industry keyword matching.
 *
 * @returns Array of all unique keywords across all directions
 */
export function getAllKeywords(): string[] {
  const allKeywords = new Set<string>();
  for (const set of Object.values(keywordDatabase)) {
    for (const kw of set.keywords) {
      allKeywords.add(kw);
    }
    for (const sk of set.requiredSkills) {
      allKeywords.add(sk);
    }
  }
  return Array.from(allKeywords);
}
