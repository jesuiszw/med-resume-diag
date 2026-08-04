import { ExpectedDirection } from '../types';

/**
 * 方向关键词数据接口
 */
export interface DirectionKeywordData {
  /** 对应的期望方向 */
  direction: ExpectedDirection;
  /** 核心中文关键词（10-20个） */
  keywords: string[];
  /** 常见技能要求（5-10个） */
  requiredSkills: string[];
  /** 典型岗位头衔（中英文，3-5个） */
  typicalTitles: string[];
  /** 参考薪资范围 */
  salaryRange: string;
  /** 方向描述 */
  description: string;
}

/**
 * 医药/器械行业关键词库
 * 按 10 个 ExpectedDirection 方向分类，覆盖产品经理、医学联络官、销售、市场、
 * 准入、临床、药物警戒、注册、商务拓展、器械销售等核心岗位方向。
 */
export const KEYWORD_DATABASE: Record<ExpectedDirection, DirectionKeywordData> = {
  // ──────────────────────────────────────────────
  // 1. 产品经理 (Product Manager)
  // ──────────────────────────────────────────────
  [ExpectedDirection.ProductManager]: {
    direction: ExpectedDirection.ProductManager,
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
      '推广活动',
      '学术会议',
      '专家网络',
      '宣传物料',
      '推广效果',
      'ROI分析',
      '跨部门协作',
    ],
    requiredSkills: [
      '市场分析能力',
      '项目管理',
      '跨部门沟通',
      '数据分析',
      'PPT制作',
      '演讲能力',
      'KOL资源管理',
      '策略制定',
    ],
    typicalTitles: [
      '产品经理 (Product Manager)',
      '高级产品经理 (Senior Product Manager)',
      '产品组经理 (Product Group Manager)',
      '市场经理 (Marketing Manager)',
      '品牌经理 (Brand Manager)',
    ],
    salaryRange: '15-40K·14薪',
    description:
      '负责药品或器械产品的市场策略制定、学术推广执行与生命周期管理，是连接医学、销售、市场准入等部门的枢纽角色。',
  },

  // ──────────────────────────────────────────────
  // 2. 医学联络官 (MSL)
  // ──────────────────────────────────────────────
  [ExpectedDirection.MSL]: {
    direction: ExpectedDirection.MSL,
    keywords: [
      '医学联络',
      '学术交流',
      'KOL维护',
      '医学策略',
      '循证医学',
      '文献检索',
      '学术演讲',
      '医学教育',
      '临床证据',
      '医学信息',
      '专家关系',
      '学术会议',
      '医学培训',
      '疾病领域知识',
      '产品医学定位',
    ],
    requiredSkills: [
      '医学/药学硕博学历',
      '学术演讲能力',
      '文献检索与解读',
      'KOL关系维护',
      '跨部门沟通',
      '疾病领域专业知识',
      '医学写作',
    ],
    typicalTitles: [
      '医学联络官 (Medical Science Liaison)',
      '高级医学联络官 (Senior MSL)',
      '医学顾问 (Medical Advisor)',
      '医学事务经理 (Medical Affairs Manager)',
    ],
    salaryRange: '20-50K·14薪',
    description:
      '作为企业与外部医学专家的学术桥梁，负责KOL学术交流、临床证据传递及医学策略支持，需具备扎实的医学/药学专业背景。',
  },

  // ──────────────────────────────────────────────
  // 3. 销售专员 (Sales Specialist)
  // ──────────────────────────────────────────────
  [ExpectedDirection.SalesSpecialist]: {
    direction: ExpectedDirection.SalesSpecialist,
    keywords: [
      '销售管理',
      '客户开发',
      '渠道管理',
      '招投标',
      '区域管理',
      '销售目标',
      '客户关系',
      '终端覆盖',
      '学术推广',
      '销售策略',
      '销售预测',
      '费用管理',
      '经销商管理',
      '终端动销',
    ],
    requiredSkills: [
      '客户关系管理',
      '区域市场规划',
      '销售谈判技巧',
      '学术推广能力',
      '目标导向',
      '抗压能力',
      '数据分析',
    ],
    typicalTitles: [
      '医药代表 (Medical Representative)',
      '高级医药代表 (Senior Medical Representative)',
      '区域销售经理 (Regional Sales Manager)',
      '销售专员 (Sales Specialist)',
    ],
    salaryRange: '10-30K·13薪',
    description:
      '负责指定区域内的药品销售与客户维护，通过学术推广和终端覆盖达成销售目标，是药企市场一线核心力量。',
  },

  // ──────────────────────────────────────────────
  // 4. 市场营销 (Marketing Executive)
  // ──────────────────────────────────────────────
  [ExpectedDirection.MarketingExecutive]: {
    direction: ExpectedDirection.MarketingExecutive,
    keywords: [
      '市场推广',
      '品牌传播',
      '内容营销',
      '活动策划',
      '数字营销',
      '社交媒体营销',
      '市场调研',
      '消费者洞察',
      '整合营销',
      '品牌定位',
      '推广策略',
      '市场分析',
      '营销预算',
      '效果监测',
    ],
    requiredSkills: [
      '品牌策划能力',
      '数字营销工具',
      '活动项目管理',
      '数据分析',
      '创意文案',
      '跨渠道整合',
      '预算管理',
    ],
    typicalTitles: [
      '市场专员 (Marketing Executive)',
      '市场推广经理 (Marketing Promotion Manager)',
      '品牌经理 (Brand Manager)',
      '数字营销经理 (Digital Marketing Manager)',
    ],
    salaryRange: '12-35K·14薪',
    description:
      '负责品牌传播、市场推广活动策划与执行，整合线上线下渠道开展营销，以数据驱动提升品牌影响力和市场渗透率。',
  },

  // ──────────────────────────────────────────────
  // 5. 市场准入 (Market Access)
  // ──────────────────────────────────────────────
  [ExpectedDirection.MarketAccess]: {
    direction: ExpectedDirection.MarketAccess,
    keywords: [
      '市场准入',
      '医保谈判',
      '集采',
      '省采',
      'DRG/DIP',
      '准入策略',
      '政府事务',
      '政策解读',
      '价格谈判',
      '医保目录',
      '招标采购',
      '卫生经济学',
      '药物经济学',
      '准入路径',
    ],
    requiredSkills: [
      '政策解读能力',
      '政府事务经验',
      '卫生经济学/药物经济学知识',
      '价格谈判技巧',
      '策略制定',
      '跨部门协调',
      '数据分析',
    ],
    typicalTitles: [
      '市场准入经理 (Market Access Manager)',
      '市场准入总监 (Market Access Director)',
      '政府事务经理 (Government Affairs Manager)',
      '准入策略经理 (Access Strategy Manager)',
    ],
    salaryRange: '20-50K·14薪',
    description:
      '负责药品/器械的医保目录准入、集采投标及价格谈判策略，是产品商业化落地的关键角色，需深刻理解医改政策与准入路径。',
  },

  // ──────────────────────────────────────────────
  // 6. 临床试验 (Clinical Trial)
  // ──────────────────────────────────────────────
  [ExpectedDirection.ClinicalTrial]: {
    direction: ExpectedDirection.ClinicalTrial,
    keywords: [
      '临床试验',
      'GCP',
      '临床研究',
      '试验方案',
      'CRC',
      'CRA',
      '伦理审查',
      '入组管理',
      '数据管理',
      '统计分析',
      '中心筛选',
      '监查访视',
      '安全性报告',
      '临床报告',
    ],
    requiredSkills: [
      'GCP认证知识',
      '临床研究方案设计',
      '项目管理',
      '数据管理',
      '法规合规意识',
      '统计分析基础',
      '沟通协调能力',
    ],
    typicalTitles: [
      '临床监查员 CRA (Clinical Research Associate)',
      '临床研究协调员 CRC (Clinical Research Coordinator)',
      '临床项目经理 (Clinical Project Manager)',
      '临床研究经理 (Clinical Research Manager)',
    ],
    salaryRange: '12-35K·14薪',
    description:
      '负责临床试验项目的执行管理，涵盖方案设计、中心筛选、入组管理、监查访视和数据管理，确保研究符合GCP规范。',
  },

  // ──────────────────────────────────────────────
  // 7. 药物警戒 (Pharmacovigilance)
  // ──────────────────────────────────────────────
  [ExpectedDirection.Pharmacovigilance]: {
    direction: ExpectedDirection.Pharmacovigilance,
    keywords: [
      '药物警戒',
      '不良反应报告',
      'AE',
      'SAE',
      'PSUR',
      '信号检测',
      '风险管理',
      '安全监测',
      '个例报告',
      '定期安全报告',
      '药物警戒体系',
      '风险评估',
    ],
    requiredSkills: [
      '药物警戒法规知识',
      '医学/药学背景',
      'AE/SAE评估',
      '信号检测分析',
      '英文文献阅读',
      '报告撰写',
      '跨部门协作',
    ],
    typicalTitles: [
      '药物警戒专员 (Pharmacovigilance Specialist)',
      '药物警戒经理 (Pharmacovigilance Manager)',
      '安全监测经理 (Drug Safety Manager)',
      'PV负责人 (Head of Pharmacovigilance)',
    ],
    salaryRange: '12-35K·14薪',
    description:
      '负责药品上市后安全监测与不良反应报告管理，建立药物警戒体系，开展信号检测和风险评估，保障用药安全合规。',
  },

  // ──────────────────────────────────────────────
  // 8. 注册事务 (Regulatory Affairs)
  // ──────────────────────────────────────────────
  [ExpectedDirection.RegulatoryAffairs]: {
    direction: ExpectedDirection.RegulatoryAffairs,
    keywords: [
      '药品注册',
      'NMPA',
      '注册申报',
      'CTD',
      'eCTD',
      '注册策略',
      '补充申请',
      'ANDA',
      'NDA',
      'IND',
      '注册检验',
      '技术审评',
      '注册法规',
    ],
    requiredSkills: [
      '药品注册法规知识',
      'CTD/eCTD格式',
      '技术审评理解',
      '申报材料撰写',
      '项目管理',
      '跨部门协调',
      '英语读写',
    ],
    typicalTitles: [
      '注册专员 (Regulatory Affairs Specialist)',
      '注册经理 (Regulatory Affairs Manager)',
      '注册总监 (Regulatory Affairs Director)',
      '注册事务高级经理 (Senior RA Manager)',
    ],
    salaryRange: '12-40K·14薪',
    description:
      '负责药品/器械注册申报的全流程管理，制定注册策略，撰写和提交CTD/eCTD申报材料，与NMPA沟通技术审评事宜。',
  },

  // ──────────────────────────────────────────────
  // 9. 商务拓展 (Business Development)
  // ──────────────────────────────────────────────
  [ExpectedDirection.BusinessDevelopment]: {
    direction: ExpectedDirection.BusinessDevelopment,
    keywords: [
      '商务拓展',
      'BD',
      'license-in',
      'license-out',
      '项目评估',
      '尽职调查',
      '合作谈判',
      '技术转移',
      '专利许可',
      '投资并购',
      '管线分析',
      '估值建模',
      '战略合作',
    ],
    requiredSkills: [
      '项目评估能力',
      '财务建模与估值',
      '尽职调查',
      '商务谈判',
      '行业洞察',
      '英文商务沟通',
      '法律合同审阅',
    ],
    typicalTitles: [
      '商务拓展经理 (Business Development Manager)',
      'BD总监 (BD Director)',
      '战略合作经理 (Strategic Partnership Manager)',
      '投资并购经理 (M&A Manager)',
    ],
    salaryRange: '20-60K·14薪',
    description:
      '负责企业对外合作与管线拓展，开展license-in/out交易、项目评估、尽职调查和合作谈判，驱动企业战略增长。',
  },

  // ──────────────────────────────────────────────
  // 10. 医疗器械销售 (Device Sales)
  // ──────────────────────────────────────────────
  [ExpectedDirection.DeviceSales]: {
    direction: ExpectedDirection.DeviceSales,
    keywords: [
      '医疗器械销售',
      '渠道管理',
      '经销商管理',
      '招投标',
      '终端覆盖',
      '产品培训',
      '售后支持',
      '装机管理',
      '耗材销售',
      '设备维护',
      '渠道开发',
      '价格管理',
    ],
    requiredSkills: [
      '医疗器械产品知识',
      '渠道开发与管理',
      '招投标经验',
      '客户关系维护',
      '售后支持能力',
      '销售谈判',
      '区域管理',
    ],
    typicalTitles: [
      '医疗器械销售代表 (Medical Device Sales Representative)',
      '区域销售经理 (Regional Sales Manager)',
      '渠道经理 (Channel Manager)',
      '大客户经理 (Key Account Manager)',
    ],
    salaryRange: '10-30K·13薪',
    description:
      '负责医疗器械产品的区域销售与渠道管理，涵盖经销商开发、招投标、装机和售后支持，需兼具设备与耗材销售能力。',
  },
};
