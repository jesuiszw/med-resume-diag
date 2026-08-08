import { ExpectedDirection } from '../types';

/**
 * A curated job entry in the medical/device industry job database.
 */
export interface CuratedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  direction: ExpectedDirection;
  requirements: string[];
  keywords: string[];
  experienceLevel: '初级' | '中级' | '高级' | '管理';
}

/**
 * Curated job database — at least 30 jobs covering all 10 ExpectedDirection values.
 * Each direction has 3+ entries spanning different experience levels.
 */
export const jobDatabase: CuratedJob[] = [
  // ===== Product Manager (4) =====
  {
    id: 'pm-001',
    title: '产品经理（心血管线）',
    company: '某外资药企',
    location: '上海',
    salaryRange: '25K-40K/月',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '医药/生物相关专业本科及以上',
      '3年以上处方药产品管理经验',
      '具备市场策略制定与落地能力',
      '熟悉心血管治疗领域',
      '优秀的数据分析与PPT演讲能力',
    ],
    keywords: ['市场策略', '产品定位', '竞品分析', '市场调研', '学术推广', 'KOL管理', '产品上市'],
    experienceLevel: '中级',
  },
  {
    id: 'pm-002',
    title: '高级产品经理（肿瘤线）',
    company: '某国内创新药企',
    location: '北京',
    salaryRange: '35K-55K/月',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '药学/医学硕士及以上',
      '5年以上肿瘤领域产品管理经验',
      '有新产品上市经验者优先',
      '熟悉免疫治疗或靶向治疗领域',
      '具备跨部门项目领导能力',
    ],
    keywords: ['市场推广', '生命周期管理', '品牌管理', '价格策略', 'ROI分析', '数字营销', '跨部门协作'],
    experienceLevel: '高级',
  },
  {
    id: 'pm-003',
    title: '产品总监（代谢疾病领域）',
    company: '某上市药企',
    location: '上海',
    salaryRange: '50K-80K/月',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '硕士及以上学历',
      '8年以上医药行业市场经验',
      '3年以上团队管理经验',
      '有完整产品线管理经验',
      '具备国际视野与战略思维',
    ],
    keywords: ['产品线管理', '市场细分', '推广方案', '市场策略', '生命周期管理', 'SFE'],
    experienceLevel: '管理',
  },
  {
    id: 'pm-004',
    title: '助理产品经理（呼吸线）',
    company: '某合资药企',
    location: '广州',
    salaryRange: '15K-22K/月',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '医药相关专业本科',
      '1-2年市场或销售经验',
      '有向产品管理方向发展的意愿',
      '良好的沟通与学习能力',
    ],
    keywords: ['市场调研', '竞品分析', '推广物料', '学术会议', '市场推广'],
    experienceLevel: '初级',
  },

  // ===== MSL (4) =====
  {
    id: 'msl-001',
    title: '医学联络官（肿瘤领域）',
    company: '某外资药企',
    location: '上海',
    salaryRange: '30K-50K/月',
    direction: ExpectedDirection.MSL,
    requirements: [
      '医学/药学/生命科学博士',
      '具备肿瘤领域学术背景',
      '优秀的学术演讲与沟通能力',
      '能独立开展KOL互动与学术交流',
      '英文文献阅读与总结能力',
    ],
    keywords: ['医学联络', 'KOL互动', '学术交流', '医学策略', '临床证据', '医学演讲', '循证医学'],
    experienceLevel: '中级',
  },
  {
    id: 'msl-002',
    title: '高级医学联络官（免疫领域）',
    company: '某国内生物药企',
    location: '北京',
    salaryRange: '35K-55K/月',
    direction: ExpectedDirection.MSL,
    requirements: [
      '临床医学或免疫学博士',
      '3年以上MSL经验',
      '熟悉自身免疫疾病治疗领域',
      '具备医学教育项目策划能力',
      '良好的跨部门协作能力',
    ],
    keywords: ['医学科学', '专家网络', '医学教育', '医学支持', '文献检索', '疾病领域知识'],
    experienceLevel: '高级',
  },
  {
    id: 'msl-003',
    title: 'MSL Manager（心血管领域）',
    company: '某外资药企',
    location: '上海',
    salaryRange: '45K-70K/月',
    direction: ExpectedDirection.MSL,
    requirements: [
      '医学博士',
      '5年以上医学事务经验',
      '2年以上MSL团队管理经验',
      '熟悉心血管治疗领域',
      '具备医学策略制定能力',
    ],
    keywords: ['医学事务', '医学策略', '专家网络', '临床试验数据', '药物机制', '医学沟通'],
    experienceLevel: '管理',
  },
  {
    id: 'msl-004',
    title: '医学联络官（罕见病领域）',
    company: '某跨国药企',
    location: '北京',
    salaryRange: '28K-45K/月',
    direction: ExpectedDirection.MSL,
    requirements: [
      '医学/遗传学/药学硕士及以上',
      '有罕见病或基因治疗相关背景',
      '学术交流与KOL互动能力',
      '能适应频繁出差',
    ],
    keywords: ['医学联络', '学术拜访', '医学咨询', '循证医学', '临床证据'],
    experienceLevel: '中级',
  },

  // ===== Sales Specialist (4) =====
  {
    id: 'ss-001',
    title: '医药代表（内分泌线）',
    company: '某外资药企',
    location: '上海',
    salaryRange: '12K-20K/月+提成',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '医药/生物相关专业大专及以上',
      '1-3年处方药销售经验',
      '熟悉当地医院网络',
      '持有医药代表备案',
      '目标导向，抗压能力强',
    ],
    keywords: ['销售达成', '学术拜访', '终端覆盖', '客户关系管理', '处方医生', '进院开发'],
    experienceLevel: '初级',
  },
  {
    id: 'ss-002',
    title: '高级医药代表（抗感染线）',
    company: '某国内药企',
    location: '广州',
    salaryRange: '15K-25K/月+提成',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '医药相关专业本科',
      '3年以上医院销售经验',
      '有抗感染产品线经验',
      '能独立开发新医院',
      '具备竞品应对策略能力',
    ],
    keywords: ['销售指标', '客户开发', '渠道管理', '药剂科', '业绩增长', 'CRM系统', '回款管理'],
    experienceLevel: '中级',
  },
  {
    id: 'ss-003',
    title: '区域销售经理（华东区）',
    company: '某上市药企',
    location: '上海',
    salaryRange: '25K-40K/月+奖金',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '医药相关专业本科',
      '5年以上医药销售经验',
      '2年以上团队管理经验',
      '熟悉华东区市场',
      '具备区域策略规划能力',
    ],
    keywords: ['销售区域', '销售报表', '客户关系管理', '医院覆盖', '销售目标', '竞品应对'],
    experienceLevel: '管理',
  },
  {
    id: 'ss-004',
    title: '医药代表（中枢神经线）',
    company: '某合资药企',
    location: '成都',
    salaryRange: '10K-18K/月+提成',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '医药相关专业大专及以上',
      '1年以上处方药推广经验',
      '熟悉成都地区医院',
      '良好的沟通与执行能力',
    ],
    keywords: ['学术拜访', '终端覆盖', '临床推广', '客户拜访', '销售达成'],
    experienceLevel: '初级',
  },

  // ===== Marketing Executive (3) =====
  {
    id: 'me-001',
    title: '市场推广经理（数字营销方向）',
    company: '某外资药企',
    location: '上海',
    salaryRange: '20K-35K/月',
    direction: ExpectedDirection.MarketingExecutive,
    requirements: [
      '市场营销/医药相关专业本科',
      '3年以上医药行业市场推广经验',
      '熟悉数字化营销工具与平台',
      '具备内容策划与数据分析能力',
      '有线上学术活动运营经验',
    ],
    keywords: ['数字营销', '内容营销', '线上活动', '营销ROI', '推广策划', '多渠道营销'],
    experienceLevel: '中级',
  },
  {
    id: 'me-002',
    title: '品牌经理（患者教育方向）',
    company: '某国内创新药企',
    location: '北京',
    salaryRange: '18K-30K/月',
    direction: ExpectedDirection.MarketingExecutive,
    requirements: [
      '市场营销/传播学本科',
      '3年以上品牌管理经验',
      '有患者教育或疾病认知项目经验',
      '具备社交媒体运营能力',
      '创意思维与项目管理能力',
    ],
    keywords: ['品牌传播', '品牌建设', '患者教育', '疾病 awareness', '社交媒体', '整合营销'],
    experienceLevel: '中级',
  },
  {
    id: 'me-003',
    title: '市场部总监',
    company: '某上市药企',
    location: '上海',
    salaryRange: '45K-70K/月',
    direction: ExpectedDirection.MarketingExecutive,
    requirements: [
      '硕士及以上学历',
      '8年以上医药市场营销经验',
      '3年以上市场团队管理经验',
      '有大型学术会议策划经验',
      '具备品牌战略与市场洞察能力',
    ],
    keywords: ['市场活动', '推广策略', '市场洞察', '品牌建设', '学术会议', '营销自动化'],
    experienceLevel: '管理',
  },

  // ===== Market Access (3) =====
  {
    id: 'ma-001',
    title: '市场准入经理',
    company: '某外资药企',
    location: '北京',
    salaryRange: '30K-50K/月',
    direction: ExpectedDirection.MarketAccess,
    requirements: [
      '公共卫生/药学/卫生经济学硕士',
      '3年以上市场准入或政府事务经验',
      '熟悉国家医保谈判流程',
      '具备药物经济学评价能力',
      '良好的政策分析与谈判能力',
    ],
    keywords: ['市场准入', '医保谈判', '药物经济学', '准入策略', '医保目录', '卫生技术评估'],
    experienceLevel: '中级',
  },
  {
    id: 'ma-002',
    title: '准入与政策总监',
    company: '某国内创新药企',
    location: '上海',
    salaryRange: '50K-80K/月',
    direction: ExpectedDirection.MarketAccess,
    requirements: [
      '卫生经济学/药学/公共卫生硕士',
      '8年以上市场准入经验',
      '有医保谈判成功案例',
      '熟悉DRG/DIP支付改革',
      '具备政府关系网络',
    ],
    keywords: ['准入策略', '集采', '定价策略', '政府事务', 'DRG/DIP', '创新支付', '价值医疗'],
    experienceLevel: '管理',
  },
  {
    id: 'ma-003',
    title: '药物经济学经理',
    company: '某合资药企',
    location: '北京',
    salaryRange: '25K-40K/月',
    direction: ExpectedDirection.MarketAccess,
    requirements: [
      '卫生经济学/统计学/药学硕士',
      '2年以上HEOR或药物经济学经验',
      '具备经济模型构建能力',
      '熟悉NICE等国际评估框架',
      '英文文献阅读与写作能力',
    ],
    keywords: ['药物经济学', '证据生成', 'HTA', '卫生技术评估', '报销政策', '价值医疗'],
    experienceLevel: '中级',
  },

  // ===== Clinical Trial (4) =====
  {
    id: 'ct-001',
    title: '临床监查员（CRA）',
    company: '某CRO公司',
    location: '上海',
    salaryRange: '12K-20K/月',
    direction: ExpectedDirection.ClinicalTrial,
    requirements: [
      '医药/护理/生物相关专业本科',
      '1-3年CRA经验',
      '持有GCP证书',
      '能适应频繁出差',
      '熟悉临床试验监查流程',
    ],
    keywords: ['临床试验', 'GCP', 'CRA', '数据监查', '伦理审查', '研究者沟通', '中心筛选'],
    experienceLevel: '初级',
  },
  {
    id: 'ct-002',
    title: '高级临床监查员',
    company: '某外资药企',
    location: '北京',
    salaryRange: '20K-35K/月',
    direction: ExpectedDirection.ClinicalTrial,
    requirements: [
      '医药相关专业本科',
      '4年以上CRA经验',
      '有II/III期临床试验经验',
      '能独立管理多个研究中心',
      '熟悉SAE报告流程',
    ],
    keywords: ['CRA', '临床试验', '方案设计', '入组管理', '不良事件', 'SAE', '稽查', 'CRO管理'],
    experienceLevel: '高级',
  },
  {
    id: 'ct-003',
    title: '临床项目经理',
    company: '某国内创新药企',
    location: '上海',
    salaryRange: '30K-50K/月',
    direction: ExpectedDirection.ClinicalTrial,
    requirements: [
      '医药/生命科学硕士',
      '5年以上临床研究经验',
      '2年以上项目管理经验',
      '有跨国临床试验项目经验',
      'PMP认证优先',
    ],
    keywords: ['临床运营', '临床试验方案', '受试者招募', 'CRO管理', '数据管理', '生物统计'],
    experienceLevel: '管理',
  },
  {
    id: 'ct-004',
    title: '临床数据管理员',
    company: '某CRO公司',
    location: '成都',
    salaryRange: '12K-22K/月',
    direction: ExpectedDirection.ClinicalTrial,
    requirements: [
      '医药/统计/计算机相关本科',
      '2年以上临床数据管理经验',
      '熟悉EDC系统操作',
      '了解CDISC标准',
      '具备数据质量控制能力',
    ],
    keywords: ['数据管理', '临床试验', 'GCP', '数据监查', '生物统计'],
    experienceLevel: '中级',
  },

  // ===== Pharmacovigilance (3) =====
  {
    id: 'pv-001',
    title: '药物警戒专员',
    company: '某外资药企',
    location: '上海',
    salaryRange: '15K-25K/月',
    direction: ExpectedDirection.Pharmacovigilance,
    requirements: [
      '药学/医学/生命科学本科',
      '1-3年药物警戒或药品安全经验',
      '熟悉ADR/AE报告流程',
      '了解E2B传输标准',
      '英文读写能力',
    ],
    keywords: ['药物警戒', '不良反应报告', 'ADR', 'AE', '个例报告', '文献监测', 'E2B'],
    experienceLevel: '初级',
  },
  {
    id: 'pv-002',
    title: '药物警戒经理',
    company: '某国内药企',
    location: '北京',
    salaryRange: '25K-40K/月',
    direction: ExpectedDirection.Pharmacovigilance,
    requirements: [
      '药学/医学硕士',
      '4年以上药物警戒经验',
      '具备PSUR/DSUR撰写能力',
      '熟悉信号检测方法',
      '有药物警戒体系搭建经验',
    ],
    keywords: ['药物警戒', 'PSUR', 'DSUR', '信号检测', '风险管理', 'RMP', '安全性数据', '上市后监测'],
    experienceLevel: '中级',
  },
  {
    id: 'pv-003',
    title: '药品安全总监',
    company: '某上市药企',
    location: '上海',
    salaryRange: '40K-60K/月',
    direction: ExpectedDirection.Pharmacovigilance,
    requirements: [
      '药学/医学博士',
      '8年以上药物警戒经验',
      '5年以上团队管理经验',
      '熟悉国内外PV法规',
      '具备全球药物警戒体系管理经验',
    ],
    keywords: ['药物警戒体系', '安全性分析', '合规报告', '风险管理', 'RMP', '药品安全'],
    experienceLevel: '管理',
  },

  // ===== Regulatory Affairs (3) =====
  {
    id: 'ra-001',
    title: '注册专员（药品）',
    company: '某国内药企',
    location: '上海',
    salaryRange: '12K-22K/月',
    direction: ExpectedDirection.RegulatoryAffairs,
    requirements: [
      '药学/化学/生物相关本科',
      '1-3年药品注册经验',
      '熟悉NMPA注册法规与流程',
      '能独立撰写CTD格式资料',
      '英文读写能力',
    ],
    keywords: ['注册申报', 'NMPA', 'CTD格式', '注册资料', '注册法规', '再注册'],
    experienceLevel: '初级',
  },
  {
    id: 'ra-002',
    title: '注册经理（创新药）',
    company: '某国内创新药企',
    location: '北京',
    salaryRange: '25K-45K/月',
    direction: ExpectedDirection.RegulatoryAffairs,
    requirements: [
      '药学/医学硕士',
      '5年以上药品注册经验',
      '有IND/NDA申报经验',
      '熟悉中美双报流程优先',
      '具备注册策略制定能力',
    ],
    keywords: ['注册申报', 'IND', 'NDA', '注册策略', '技术审评', '审评沟通', '申报路径'],
    experienceLevel: '高级',
  },
  {
    id: 'ra-003',
    title: '注册事务总监',
    company: '某外资药企',
    location: '上海',
    salaryRange: '45K-70K/月',
    direction: ExpectedDirection.RegulatoryAffairs,
    requirements: [
      '药学/医学硕士',
      '10年以上注册事务经验',
      '5年以上团队管理经验',
      '有多个产品获批经验',
      '熟悉国际注册法规',
    ],
    keywords: ['法规事务', '注册策略', 'NMPA', '一致性评价', '注册分类', '合规管理', '审评沟通'],
    experienceLevel: '管理',
  },

  // ===== Business Development (3) =====
  {
    id: 'bd-001',
    title: 'BD经理（License-in方向）',
    company: '某国内创新药企',
    location: '上海',
    salaryRange: '30K-55K/月',
    direction: ExpectedDirection.BusinessDevelopment,
    requirements: [
      '药学/生物/MBA硕士',
      '3年以上医药BD经验',
      '有License-in交易经验',
      '具备管线评估与估值能力',
      '优秀的商务谈判与英文沟通能力',
    ],
    keywords: ['商务拓展', 'BD', 'license in', '项目评估', '尽职调查', '估值模型', '商务谈判'],
    experienceLevel: '中级',
  },
  {
    id: 'bd-002',
    title: '商务拓展总监',
    company: '某上市药企',
    location: '北京',
    salaryRange: '50K-80K/月',
    direction: ExpectedDirection.BusinessDevelopment,
    requirements: [
      '药学/生物/MBA硕士',
      '8年以上医药行业BD经验',
      '有大型交易落地经验',
      '熟悉国内外医药管线格局',
      '具备战略规划与团队管理能力',
    ],
    keywords: ['license out', '合作引进', '交易结构', '战略合作', '并购', '投资评估', '行业洞察'],
    experienceLevel: '管理',
  },
  {
    id: 'bd-003',
    title: '授权引进经理',
    company: '某生物药企',
    location: '上海',
    salaryRange: '25K-40K/月',
    direction: ExpectedDirection.BusinessDevelopment,
    requirements: [
      '药学/生命科学硕士',
      '2年以上BD或项目评估经验',
      '具备技术尽调能力',
      '熟悉创新药管线评估方法',
      '英文工作能力',
    ],
    keywords: ['技术引进', '授权交易', '项目评估', '市场尽调', '商务沟通', '合作协议'],
    experienceLevel: '中级',
  },

  // ===== Device Sales (3) =====
  {
    id: 'ds-001',
    title: '医疗器械销售代表（影像设备）',
    company: '某跨国器械公司',
    location: '上海',
    salaryRange: '12K-25K/月+提成',
    direction: ExpectedDirection.DeviceSales,
    requirements: [
      '生物医学工程/机械/电子相关本科',
      '1-3年医疗器械销售经验',
      '熟悉大型设备招标流程',
      '能独立完成设备演示与装机协调',
      '良好的客户关系维护能力',
    ],
    keywords: ['医疗器械销售', '设备招标', '终端开发', '设备演示', '设备科', '设备装机'],
    experienceLevel: '初级',
  },
  {
    id: 'ds-002',
    title: '区域销售经理（高值耗材）',
    company: '某国内器械公司',
    location: '广州',
    salaryRange: '20K-35K/月+提成',
    direction: ExpectedDirection.DeviceSales,
    requirements: [
      '医学/生物医学工程相关本科',
      '4年以上高值耗材销售经验',
      '2年以上团队管理经验',
      '熟悉分销商管理体系',
      '有省级招标经验',
    ],
    keywords: ['渠道分销', '代理商管理', '耗材销售', '招标投标', '经销商管理', '临床科室'],
    experienceLevel: '管理',
  },
  {
    id: 'ds-003',
    title: '设备销售工程师（IVD方向）',
    company: '某体外诊断公司',
    location: '成都',
    salaryRange: '10K-20K/月+提成',
    direction: ExpectedDirection.DeviceSales,
    requirements: [
      '生物/检验/生物医学工程相关大专及以上',
      '1-2年IVD或检验科销售经验',
      '熟悉体外诊断产品',
      '能提供基础技术支持',
      '能适应区域内出差',
    ],
    keywords: ['设备推广', '终端开发', '设备维护', '售后服务', '设备演示', '技术支持'],
    experienceLevel: '初级',
  },
];

/**
 * Returns all jobs for the given direction.
 *
 * @param direction - The expected career direction
 * @returns Array of curated jobs in that direction
 */
export function getJobsByDirection(direction: ExpectedDirection): CuratedJob[] {
  return jobDatabase.filter((job) => job.direction === direction);
}

/**
 * Returns all jobs in the database.
 *
 * @returns The full job database array
 */
export function getAllJobs(): CuratedJob[] {
  return jobDatabase;
}
