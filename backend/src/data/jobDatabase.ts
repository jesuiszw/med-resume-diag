import { ExpectedDirection } from '../types';

/**
 * 精选岗位数据接口
 */
export interface CuratedJob {
  /** 岗位唯一标识 */
  id: string;
  /** 岗位名称 */
  title: string;
  /** 公司类型（外资药企、国内创新药企、医疗器械公司等） */
  company: string;
  /** 工作地点 */
  location: string;
  /** 薪资范围 */
  salaryRange: string;
  /** 对应的期望方向 */
  direction: ExpectedDirection;
  /** 岗位要求关键词（5-8个） */
  requirements: string[];
  /** 岗位职责（3-5条） */
  responsibilities: string[];
  /** 匹配关键词（用于算法匹配，8-12个） */
  keywords: string[];
  /** 经验级别 */
  experienceLevel: '初级' | '中级' | '高级' | '管理';
  /** 岗位简述 */
  description: string;
}

/**
 * 精选岗位数据库
 * 覆盖 10 个方向，每个方向至少 3 个岗位，共计 33 个岗位。
 * 包含外资药企、国内创新药企、医疗器械公司等不同类型，
 * 地点覆盖北上广深及新一线城市，经验级别从初级到管理级。
 */
export const JOB_DATABASE: CuratedJob[] = [
  // ══════════════════════════════════════════════
  // 产品经理 (ProductManager) — 4 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'pm-001',
    title: '产品经理 - 心血管线',
    company: '外资药企',
    location: '上海',
    salaryRange: '25-40K·14薪',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '3年以上药企产品管理经验',
      '心血管领域知识',
      '市场策略制定能力',
      'KOL管理经验',
      '本科以上药学/医学相关学历',
    ],
    responsibilities: [
      '制定产品年度市场策略和推广计划',
      '管理KOL关系和学术合作',
      '组织全国学术会议和推广活动',
      '竞品分析和市场洞察',
      '跨部门协作推进产品目标',
    ],
    keywords: ['市场推广', '产品定位', 'KOL管理', '学术推广', '市场策略', '竞品分析', '心血管', '学术会议', '生命周期管理', '推广效果'],
    experienceLevel: '高级',
    description: '负责心血管产品线的市场策略制定与推广执行，需要扎实的心血管领域知识和丰富的KOL资源。',
  },
  {
    id: 'pm-002',
    title: '高级产品经理 - 肿瘤线',
    company: '国内创新药企',
    location: '北京',
    salaryRange: '30-50K·14薪',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '5年以上肿瘤领域产品管理经验',
      '硕士以上医学/药学学历',
      '创新药上市经验优先',
      'KOL网络资源丰富',
      '英文流利',
    ],
    responsibilities: [
      '主导肿瘤创新药上市策略和市场定位',
      '搭建和维护全国KOL专家网络',
      '策划和执行全国学术推广活动',
      '开展竞品追踪和市场趋势分析',
      '与医学事务、市场准入团队协同推进产品目标',
    ],
    keywords: ['市场策略', 'KOL管理', '学术推广', '产品定位', '产品上市', '竞品分析', '肿瘤', '学术会议', '品牌管理', 'ROI分析'],
    experienceLevel: '高级',
    description: '负责肿瘤创新药的市场策略和上市推广，需要深厚的肿瘤领域背景和丰富的专家资源。',
  },
  {
    id: 'pm-003',
    title: '产品经理 - 内分泌线',
    company: '外资药企',
    location: '广州',
    salaryRange: '18-30K·14薪',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '2年以上药企产品管理或市场推广经验',
      '内分泌或慢病领域经验优先',
      '本科以上药学/医学/市场营销学历',
      '良好的数据分析能力',
      '熟练使用PPT等办公软件',
    ],
    responsibilities: [
      '执行产品市场推广计划和学术活动',
      '协助维护KOL专家关系',
      '制作推广物料和培训资料',
      '跟踪推广效果并进行ROI分析',
      '支持区域销售团队开展学术推广',
    ],
    keywords: ['市场推广', '学术推广', '推广活动', '宣传物料', '市场调研', '数字营销', '内分泌', 'KOL管理', 'SFE', '推广效果'],
    experienceLevel: '中级',
    description: '负责内分泌产品线的市场推广执行与KOL维护，适合有2-3年药企市场经验的候选人。',
  },
  {
    id: 'pm-004',
    title: '产品组经理 - 自身免疫',
    company: '国内创新药企',
    location: '上海',
    salaryRange: '35-60K·15薪',
    direction: ExpectedDirection.ProductManager,
    requirements: [
      '7年以上药企市场管理经验',
      '自身免疫或生物药领域经验',
      '团队管理经验',
      '硕士以上学历优先',
      '英文商务沟通能力',
    ],
    responsibilities: [
      '管理自身免疫产品线组合策略',
      '领导产品经理团队制定市场计划',
      '统筹全国学术会议和品牌活动',
      '制定价格策略和生命周期管理方案',
      '与公司管理层沟通战略方向',
    ],
    keywords: ['市场策略', '品牌管理', '产品定位', '生命周期管理', '价格策略', 'KOL管理', '学术会议', '跨部门协作', 'ROI分析', '市场调研'],
    experienceLevel: '管理',
    description: '负责自身免疫产品线组合的市场战略和团队管理，需要资深的产品管理经验和领导力。',
  },

  // ══════════════════════════════════════════════
  // 医学联络官 (MSL) — 4 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'msl-001',
    title: '医学联络官 - 肿瘤线',
    company: '外资药企',
    location: '上海',
    salaryRange: '30-50K·14薪',
    direction: ExpectedDirection.MSL,
    requirements: [
      '医学/药学博士学历',
      '肿瘤领域研究背景',
      '学术演讲和文献解读能力',
      '英文文献阅读能力',
      '可接受高频出差',
    ],
    responsibilities: [
      '与KOL建立和维护学术合作关系',
      '传递产品最新临床证据和医学信息',
      '参与全国及区域学术会议',
      '收集专家医学需求并反馈至医学团队',
      '支持临床研究和医学教育项目',
    ],
    keywords: ['医学联络', 'KOL维护', '学术交流', '循证医学', '临床证据', '医学策略', '学术演讲', '肿瘤', '文献检索', '专家关系'],
    experienceLevel: '高级',
    description: '作为肿瘤产品线的医学事务桥梁，负责KOL学术交流和临床证据传递，需医学博士背景。',
  },
  {
    id: 'msl-002',
    title: '高级医学联络官 - 中枢神经',
    company: '国内创新药企',
    location: '北京',
    salaryRange: '25-45K·14薪',
    direction: ExpectedDirection.MSL,
    requirements: [
      '医学/药学硕士以上学历',
      '3年以上MSL经验',
      '中枢神经领域知识',
      '学术演讲经验丰富',
      '良好的KOL资源',
    ],
    responsibilities: [
      '负责区域内KOL学术关系维护',
      '开展医学策略支持和临床证据传递',
      '组织区域医学教育和学术交流活动',
      '参与临床试验中心和研究者沟通',
      '收集并分析医学情报反馈策略',
    ],
    keywords: ['医学联络', '学术交流', 'KOL维护', '医学策略', '医学教育', '学术演讲', '中枢神经', '专家关系', '疾病领域知识', '临床证据'],
    experienceLevel: '高级',
    description: '负责中枢神经产品线的医学联络和KOL维护，需具备3年以上MSL经验和领域知识。',
  },
  {
    id: 'msl-003',
    title: '医学联络官 - 代谢线',
    company: '外资药企',
    location: '广州',
    salaryRange: '20-35K·14薪',
    direction: ExpectedDirection.MSL,
    requirements: [
      '医学/药学硕士学历',
      '代谢或内分泌领域知识',
      '良好的沟通和演讲能力',
      '应届博士亦可考虑',
    ],
    responsibilities: [
      '建立区域KOL学术合作网络',
      '向专家传递产品医学信息',
      '参与学术会议和医学教育',
      '支持区域临床研究项目',
      '收集专家反馈并撰写医学报告',
    ],
    keywords: ['医学联络', 'KOL维护', '学术交流', '医学信息', '医学教育', '学术演讲', '代谢', '文献检索', '疾病领域知识', '产品医学定位'],
    experienceLevel: '中级',
    description: '负责代谢产品线的医学联络工作，适合硕士学历、有领域知识基础的候选人。',
  },
  {
    id: 'msl-004',
    title: '医学事务经理 - 免疫线',
    company: '国内创新药企',
    location: '上海',
    salaryRange: '35-55K·15薪',
    direction: ExpectedDirection.MSL,
    requirements: [
      '医学/药学博士学历',
      '5年以上医学事务经验',
      '免疫领域研究背景',
      '团队管理经验',
      '英文流利',
    ],
    responsibilities: [
      '制定免疫产品线医学策略',
      '管理MSL团队和KOL专家网络',
      '主导医学教育项目和学术合作',
      '参与产品医学定位和证据生成计划',
      '与注册、临床团队协作推进策略',
    ],
    keywords: ['医学策略', 'KOL维护', '学术交流', '循证医学', '医学教育', '学术演讲', '免疫', '专家关系', '疾病领域知识', '产品医学定位'],
    experienceLevel: '管理',
    description: '负责免疫产品线医学事务策略和MSL团队管理，需博士学历和资深医学事务背景。',
  },

  // ══════════════════════════════════════════════
  // 销售专员 (SalesSpecialist) — 4 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'sales-001',
    title: '医药代表 - 心血管线',
    company: '外资药企',
    location: '上海',
    salaryRange: '12-20K·13薪',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '1年以上医药销售经验',
      '本科以上学历',
      '心血管或慢病领域经验优先',
      '良好的沟通和客户关系能力',
    ],
    responsibilities: [
      '负责区域内目标医院心血管产品推广',
      '开发和维护目标客户关系',
      '执行学术推广活动和终端覆盖',
      '达成区域销售目标',
      '管理区域销售费用和报告',
    ],
    keywords: ['销售管理', '客户开发', '区域管理', '学术推广', '终端覆盖', '客户关系', '销售目标', '心血管', '费用管理', '终端动销'],
    experienceLevel: '初级',
    description: '负责上海区域心血管产品的学术推广和销售目标达成，适合1-2年经验的医药代表。',
  },
  {
    id: 'sales-002',
    title: '高级医药代表 - 肿瘤线',
    company: '国内创新药企',
    location: '北京',
    salaryRange: '15-28K·14薪',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '3年以上肿瘤领域销售经验',
      '本科以上药学/医学学历',
      '丰富的三甲医院客户资源',
      '学术推广能力强',
    ],
    responsibilities: [
      '负责北京区域肿瘤产品销售和客户维护',
      '开展终端医院学术推广和覆盖',
      '管理区域销售渠道和经销商',
      '制定区域销售策略和预测',
      '达成季度和年度销售目标',
    ],
    keywords: ['销售管理', '客户开发', '渠道管理', '学术推广', '终端覆盖', '销售策略', '销售目标', '肿瘤', '区域管理', '客户关系'],
    experienceLevel: '中级',
    description: '负责北京区域肿瘤产品的销售管理和学术推广，需3年以上肿瘤领域销售经验。',
  },
  {
    id: 'sales-003',
    title: '区域销售经理 - 呼吸线',
    company: '外资药企',
    location: '成都',
    salaryRange: '20-35K·14薪',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '5年以上医药销售经验',
      '2年以上团队管理经验',
      '呼吸或慢病领域经验',
      '本科以上学历',
    ],
    responsibilities: [
      '管理西南区域销售团队和目标',
      '制定区域销售策略和资源分配',
      '开发区域重点医院和客户',
      '管理经销商渠道和招投标',
      '辅导和考核销售代表绩效',
    ],
    keywords: ['销售管理', '区域管理', '销售策略', '渠道管理', '经销商管理', '销售目标', '销售预测', '客户开发', '终端覆盖', '招投标'],
    experienceLevel: '高级',
    description: '负责西南区域呼吸产品的销售管理和团队带教，需5年以上销售经验和团队管理背景。',
  },
  {
    id: 'sales-004',
    title: '医药代表 - 消化线',
    company: '国内创新药企',
    location: '广州',
    salaryRange: '10-18K·13薪',
    direction: ExpectedDirection.SalesSpecialist,
    requirements: [
      '应届或1年以内医药销售经验',
      '大专以上药学/医学/生物相关学历',
      '沟通能力强',
      '有志于医药销售长期发展',
    ],
    responsibilities: [
      '负责广州区域消化产品终端推广',
      '开发区域目标客户和覆盖终端',
      '执行公司学术推广计划',
      '收集市场信息和竞品动态',
      '完成销售目标和日常报告',
    ],
    keywords: ['客户开发', '终端覆盖', '学术推广', '客户关系', '销售目标', '消化', '区域管理', '销售管理', '终端动销', '费用管理'],
    experienceLevel: '初级',
    description: '负责广州区域消化产品的终端推广，适合应届或有志转型医药销售的候选人。',
  },

  // ══════════════════════════════════════════════
  // 市场营销 (MarketingExecutive) — 3 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'mkt-001',
    title: '市场推广经理 - 数字营销',
    company: '外资药企',
    location: '上海',
    salaryRange: '20-35K·14薪',
    direction: ExpectedDirection.MarketingExecutive,
    requirements: [
      '3年以上市场推广或数字营销经验',
      '药企或大健康行业背景优先',
      '熟悉数字营销工具和平台',
      '本科以上市场营销/传媒学历',
    ],
    responsibilities: [
      '制定数字营销策略和执行方案',
      '管理社交媒体和线上推广渠道',
      '策划线上线下整合营销活动',
      '监测推广效果并优化ROI',
      '管理营销预算和供应商',
    ],
    keywords: ['数字营销', '市场推广', '内容营销', '社交媒体营销', '品牌传播', '效果监测', '推广策略', '整合营销', '市场分析', '营销预算'],
    experienceLevel: '高级',
    description: '负责药品数字营销策略和社交媒体推广，需要3年以上数字营销经验。',
  },
  {
    id: 'mkt-002',
    title: '市场专员 - 活动策划',
    company: '国内创新药企',
    location: '北京',
    salaryRange: '12-20K·13薪',
    direction: ExpectedDirection.MarketingExecutive,
    requirements: [
      '2年以上活动策划或市场推广经验',
      '药企行业背景优先',
      '创意策划和执行能力强',
      '熟练使用设计软件和PPT',
    ],
    responsibilities: [
      '策划和执行产品学术会议和推广活动',
      '制作宣传物料和推广内容',
      '协调供应商和活动执行团队',
      '跟踪活动效果和反馈',
      '协助品牌传播策略执行',
    ],
    keywords: ['活动策划', '市场推广', '品牌传播', '内容营销', '推广策略', '效果监测', '市场分析', '品牌定位', '推广活动', '消费者洞察'],
    experienceLevel: '中级',
    description: '负责学术会议和推广活动的策划与执行，适合2-3年市场活动经验。',
  },
  {
    id: 'mkt-003',
    title: '品牌经理 - OTC线',
    company: '外资药企',
    location: '上海',
    salaryRange: '25-40K·14薪',
    direction: ExpectedDirection.MarketingExecutive,
    requirements: [
      '5年以上品牌管理经验',
      'OTC或消费品行业背景',
      '整合营销和品牌策略能力',
      '本科以上学历',
    ],
    responsibilities: [
      '制定OTC品牌长期策略和年度计划',
      '管理品牌定位和传播策略',
      '整合线上线下营销渠道',
      '开展市场调研和消费者洞察',
      '管理品牌预算和效果评估',
    ],
    keywords: ['品牌管理', '品牌定位', '品牌传播', '整合营销', '市场调研', '消费者洞察', '推广策略', '内容营销', '数字营销', '效果监测'],
    experienceLevel: '高级',
    description: '负责OTC产品线的品牌策略和整合营销管理，需5年以上品牌管理经验。',
  },

  // ══════════════════════════════════════════════
  // 市场准入 (MarketAccess) — 3 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'access-001',
    title: '市场准入经理 - 医保谈判',
    company: '外资药企',
    location: '北京',
    salaryRange: '25-45K·14薪',
    direction: ExpectedDirection.MarketAccess,
    requirements: [
      '3年以上市场准入或政府事务经验',
      '医保谈判经验优先',
      '政策解读和分析能力',
      '本科以上学历',
    ],
    responsibilities: [
      '制定产品医保谈判和准入策略',
      '开展医保目录和集采政策分析',
      '与医保局和政府机构沟通协调',
      '准备医保谈判材料和技术文件',
      '协同销售团队推动准入落地',
    ],
    keywords: ['市场准入', '医保谈判', '医保目录', '准入策略', '政策解读', '政府事务', '价格谈判', '集采', '药物经济学', '准入路径'],
    experienceLevel: '高级',
    description: '负责创新药医保谈判和准入策略制定，需3年以上市场准入或政府事务经验。',
  },
  {
    id: 'access-002',
    title: '准入策略经理 - 集采应对',
    company: '国内创新药企',
    location: '上海',
    salaryRange: '20-35K·14薪',
    direction: ExpectedDirection.MarketAccess,
    requirements: [
      '2年以上市场准入或政策研究经验',
      '了解集采和DRG/DIP政策',
      '数据分析能力',
      '本科以上药学/公共卫生学历',
    ],
    responsibilities: [
      '分析集采和省采政策趋势',
      '制定产品集采投标和准入策略',
      '评估DRG/DIP对产品影响',
      '与准入团队协同制定省区策略',
      '撰写准入策略报告和建议',
    ],
    keywords: ['市场准入', '集采', '省采', 'DRG/DIP', '准入策略', '政策解读', '招标采购', '准入路径', '卫生经济学', '价格谈判'],
    experienceLevel: '中级',
    description: '负责集采和DRG/DIP政策应对策略，适合2-3年准入或政策研究经验。',
  },
  {
    id: 'access-003',
    title: '市场准入总监',
    company: '外资药企',
    location: '北京',
    salaryRange: '40-70K·15薪',
    direction: ExpectedDirection.MarketAccess,
    requirements: [
      '8年以上市场准入或政府事务经验',
      '丰富的医保和政府资源',
      '团队管理经验',
      '硕士以上学历优先',
    ],
    responsibilities: [
      '制定公司整体市场准入战略',
      '管理准入团队和跨部门协作',
      '主导医保谈判和集采策略',
      '维护国家级政府关系网络',
      '向公司管理层汇报准入进展',
    ],
    keywords: ['市场准入', '准入策略', '医保谈判', '政府事务', '政策解读', '医保目录', '集采', '价格谈判', '准入路径', '卫生经济学'],
    experienceLevel: '管理',
    description: '负责公司整体市场准入战略和团队管理，需8年以上准入经验和政府资源。',
  },

  // ══════════════════════════════════════════════
  // 临床试验 (ClinicalTrial) — 3 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'clin-001',
    title: '临床监查员 CRA - II期',
    company: '国内创新药企',
    location: '上海',
    salaryRange: '12-22K·14薪',
    direction: ExpectedDirection.ClinicalTrial,
    requirements: [
      '2年以上CRA工作经验',
      'GCP认证',
      '本科以上药学/医学/护理学历',
      '可接受高频出差',
    ],
    responsibilities: [
      '负责临床研究中心的监查访视',
      '核查试验数据质量和合规性',
      '管理中心入组和安全性报告',
      '与研究者沟通协调试验事宜',
      '撰写监查报告和跟进CAPA',
    ],
    keywords: ['临床试验', 'CRA', 'GCP', '监查访视', '入组管理', '数据管理', '安全性报告', '临床研究', '中心筛选', '伦理审查'],
    experienceLevel: '中级',
    description: '负责II期临床试验的中心监查和数据核查，需2年以上CRA经验和GCP认证。',
  },
  {
    id: 'clin-002',
    title: '临床项目经理 - III期',
    company: '外资药企',
    location: '北京',
    salaryRange: '25-45K·14薪',
    direction: ExpectedDirection.ClinicalTrial,
    requirements: [
      '5年以上临床研究经验',
      '2年以上项目管理经验',
      'GCP认证',
      '英语读写流利',
      '本科以上学历',
    ],
    responsibilities: [
      '管理III期临床试验项目全流程',
      '制定项目时间线和里程碑管理',
      '协调CRO和研究中心资源',
      '管理项目预算和质量',
      '审核临床试验报告和文件',
    ],
    keywords: ['临床试验', 'GCP', '临床研究', '试验方案', 'CRA', '数据管理', '统计分析', '中心筛选', '临床报告', '入组管理'],
    experienceLevel: '高级',
    description: '负责III期临床试验项目管理，需5年以上临床研究经验和项目管理背景。',
  },
  {
    id: 'clin-003',
    title: '临床研究协调员 CRC',
    company: '国内创新药企',
    location: '广州',
    salaryRange: '8-15K·13薪',
    direction: ExpectedDirection.ClinicalTrial,
    requirements: [
      '护理或医学相关大专以上',
      'GCP认证或有意愿考取',
      '细心负责，沟通能力强',
      '可接受多项目并行',
    ],
    responsibilities: [
      '协调研究中心日常试验事务',
      '协助研究者完成入组和数据录入',
      '管理受试者随访和标本采集',
      '整理试验文件和伦理材料',
      '与CRA和申办方沟通协调',
    ],
    keywords: ['CRC', '临床试验', 'GCP', '入组管理', '数据管理', '伦理审查', '临床研究', '安全性报告', '中心筛选', '试验方案'],
    experienceLevel: '初级',
    description: '负责临床研究中心日常协调工作，适合护理或医学背景的初级岗位。',
  },

  // ══════════════════════════════════════════════
  // 药物警戒 (Pharmacovigilance) — 3 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'pv-001',
    title: '药物警戒专员',
    company: '外资药企',
    location: '上海',
    salaryRange: '12-22K·14薪',
    direction: ExpectedDirection.Pharmacovigilance,
    requirements: [
      '1年以上药物警戒或药品安全经验',
      '药学/医学本科以上',
      '了解AE/SAE报告流程',
      '英语读写能力',
    ],
    responsibilities: [
      '接收和处理个例不良反应报告',
      '评估AE/SAE严重性和因果性',
      '撰写定期安全更新报告PSUR',
      '维护药物警戒数据库',
      '配合信号检测和风险评估',
    ],
    keywords: ['药物警戒', '不良反应报告', 'AE', 'SAE', 'PSUR', '信号检测', '安全监测', '个例报告', '定期安全报告', '风险评估'],
    experienceLevel: '中级',
    description: '负责药品上市后不良反应报告处理和安全监测，需1年以上PV经验。',
  },
  {
    id: 'pv-002',
    title: '药物警戒经理',
    company: '国内创新药企',
    location: '北京',
    salaryRange: '20-35K·14薪',
    direction: ExpectedDirection.Pharmacovigilance,
    requirements: [
      '5年以上药物警戒经验',
      '药学/医学硕士优先',
      '熟悉药物警戒法规体系',
      '团队管理经验',
    ],
    responsibilities: [
      '建立和完善药物警戒体系',
      '管理PV团队和日常工作',
      '主导信号检测和风险评估',
      '审核定期安全报告和合规文件',
      '与监管部门沟通PV事务',
    ],
    keywords: ['药物警戒', 'PSUR', '信号检测', '风险管理', '安全监测', '风险评估', '药物警戒体系', 'AE', 'SAE', '定期安全报告'],
    experienceLevel: '高级',
    description: '负责药物警戒体系建设和团队管理，需5年以上PV经验和管理背景。',
  },
  {
    id: 'pv-003',
    title: '安全监测专员 - 临床试验',
    company: '外资药企',
    location: '上海',
    salaryRange: '10-18K·13薪',
    direction: ExpectedDirection.Pharmacovigilance,
    requirements: [
      '药学/医学/护理本科以上',
      '了解临床试验安全报告流程',
      '英语基础读写能力',
      '细心严谨',
    ],
    responsibilities: [
      '处理临床试验SAE报告',
      '录入和维护安全数据库',
      '协助撰写安全性报告',
      '配合PV团队开展信号检测',
      '整理安全数据和归档',
    ],
    keywords: ['药物警戒', 'AE', 'SAE', '安全监测', '不良反应报告', '个例报告', '安全性报告', '风险评估', '信号检测', '定期安全报告'],
    experienceLevel: '初级',
    description: '负责临床试验安全性报告处理，适合药学/医学背景的初级岗位。',
  },

  // ══════════════════════════════════════════════
  // 注册事务 (RegulatoryAffairs) — 3 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'ra-001',
    title: '注册专员 - NDA',
    company: '国内创新药企',
    location: '上海',
    salaryRange: '12-22K·14薪',
    direction: ExpectedDirection.RegulatoryAffairs,
    requirements: [
      '2年以上药品注册经验',
      '药学本科以上',
      '熟悉CTD/eCTD格式',
      '了解NMPA注册法规',
    ],
    responsibilities: [
      '准备和提交NDA注册申报材料',
      '撰写CTD格式技术文件',
      '与NMPA沟通注册审评事宜',
      '跟踪注册进度和补充申请',
      '管理注册文件和档案',
    ],
    keywords: ['药品注册', 'NMPA', '注册申报', 'CTD', 'eCTD', 'NDA', '注册策略', '注册检验', '技术审评', '注册法规'],
    experienceLevel: '中级',
    description: '负责创新药NDA注册申报材料准备，需2年以上注册经验和CTD知识。',
  },
  {
    id: 'ra-002',
    title: '注册经理 - 创新药',
    company: '外资药企',
    location: '北京',
    salaryRange: '25-40K·14薪',
    direction: ExpectedDirection.RegulatoryAffairs,
    requirements: [
      '5年以上药品注册经验',
      '创新药IND/NDA经验',
      '药学/医学硕士优先',
      '英语流利',
    ],
    responsibilities: [
      '制定创新药注册策略和时间线',
      '管理IND/NDA申报全流程',
      '与NMPA进行技术审评沟通',
      '审核CTD技术文件质量',
      '协调研发团队提供注册支持',
    ],
    keywords: ['药品注册', 'NMPA', '注册申报', 'CTD', 'eCTD', '注册策略', 'IND', 'NDA', '技术审评', '注册法规'],
    experienceLevel: '高级',
    description: '负责创新药注册策略制定和申报管理，需5年以上注册经验。',
  },
  {
    id: 'ra-003',
    title: '注册专员 - ANDA',
    company: '国内创新药企',
    location: '南京',
    salaryRange: '10-18K·13薪',
    direction: ExpectedDirection.RegulatoryAffairs,
    requirements: [
      '1年以上仿制药注册经验',
      '药学本科以上',
      '了解ANDA申报流程',
      '英语基础读写',
    ],
    responsibilities: [
      '准备ANDA仿制药注册材料',
      '撰写CTD格式文件',
      '提交补充申请和变更申请',
      '跟踪注册检验进度',
      '整理注册档案和文件',
    ],
    keywords: ['药品注册', 'NMPA', '注册申报', 'CTD', 'ANDA', '补充申请', '注册检验', '注册法规', 'eCTD', '技术审评'],
    experienceLevel: '初级',
    description: '负责仿制药ANDA注册申报，适合1-2年注册经验的初级岗位。',
  },

  // ══════════════════════════════════════════════
  // 商务拓展 (BusinessDevelopment) — 3 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'bd-001',
    title: '商务拓展经理 - License-in',
    company: '国内创新药企',
    location: '上海',
    salaryRange: '25-45K·14薪',
    direction: ExpectedDirection.BusinessDevelopment,
    requirements: [
      '3年以上医药BD或投资经验',
      '药学/金融/生物硕士优先',
      '项目评估和估值建模能力',
      '英语商务沟通流利',
    ],
    responsibilities: [
      '搜寻和评估license-in项目机会',
      '开展项目尽职调查和估值建模',
      '参与合作谈判和合同签署',
      '管理管线分析和行业情报',
      '协同研发和法务团队推进交易',
    ],
    keywords: ['商务拓展', 'BD', 'license-in', '项目评估', '尽职调查', '合作谈判', '管线分析', '估值建模', '专利许可', '战略合作'],
    experienceLevel: '高级',
    description: '负责license-in项目搜寻、评估和谈判，需3年以上BD经验和估值能力。',
  },
  {
    id: 'bd-002',
    title: 'BD总监 - 战略合作',
    company: '外资药企',
    location: '北京',
    salaryRange: '40-70K·15薪',
    direction: ExpectedDirection.BusinessDevelopment,
    requirements: [
      '8年以上医药BD或战略经验',
      '丰富的license-in/out交易经验',
      'MBA或药学博士优先',
      '中英文商务沟通流利',
    ],
    responsibilities: [
      '制定公司BD战略和管线规划',
      '主导重大license-in/out交易',
      '管理BD团队和交易管线',
      '建立行业合作网络和资源',
      '向管理层汇报BD战略和进展',
    ],
    keywords: ['商务拓展', 'BD', 'license-in', 'license-out', '战略合作', '投资并购', '项目评估', '尽职调查', '合作谈判', '管线分析'],
    experienceLevel: '管理',
    description: '负责公司BD战略和重大交易管理，需8年以上BD经验和领导力。',
  },
  {
    id: 'bd-003',
    title: 'BD专员 - 项目评估',
    company: '国内创新药企',
    location: '上海',
    salaryRange: '12-20K·13薪',
    direction: ExpectedDirection.BusinessDevelopment,
    requirements: [
      '1年以上医药行业分析或BD经验',
      '药学/生物/金融本科以上',
      '数据分析和报告撰写能力',
      '英语读写能力',
    ],
    responsibilities: [
      '协助开展项目筛选和初步评估',
      '支持尽职调查和数据整理',
      '准备项目评估报告和汇报材料',
      '跟踪行业交易动态和竞品管线',
      '协助BD团队日常事务',
    ],
    keywords: ['商务拓展', 'BD', '项目评估', '管线分析', '尽职调查', '技术转移', '估值建模', '专利许可', '战略合作', '合作谈判'],
    experienceLevel: '初级',
    description: '协助BD团队开展项目评估和尽职调查，适合1-2年经验的初级岗位。',
  },

  // ══════════════════════════════════════════════
  // 医疗器械销售 (DeviceSales) — 3 个岗位
  // ══════════════════════════════════════════════
  {
    id: 'ds-001',
    title: '医疗器械销售代表 - 影像设备',
    company: '医疗器械公司',
    location: '上海',
    salaryRange: '12-25K·13薪',
    direction: ExpectedDirection.DeviceSales,
    requirements: [
      '2年以上医疗器械销售经验',
      '本科以上学历',
      '影像设备领域经验优先',
      '可接受出差',
    ],
    responsibilities: [
      '负责区域影像设备销售和装机管理',
      '开发和维护经销商渠道',
      '参与医院招投标和采购谈判',
      '提供产品培训和售后支持',
      '管理区域耗材销售和回款',
    ],
    keywords: ['医疗器械销售', '渠道管理', '经销商管理', '招投标', '终端覆盖', '产品培训', '售后支持', '装机管理', '耗材销售', '影像设备'],
    experienceLevel: '中级',
    description: '负责影像设备区域销售和渠道管理，需2年以上器械销售经验。',
  },
  {
    id: 'ds-002',
    title: '区域销售经理 - IVD耗材',
    company: '医疗器械公司',
    location: '广州',
    salaryRange: '18-30K·14薪',
    direction: ExpectedDirection.DeviceSales,
    requirements: [
      '4年以上IVD或耗材销售经验',
      '2年以上团队管理经验',
      '本科以上学历',
      '华南区域客户资源',
    ],
    responsibilities: [
      '管理华南区域IVD耗材销售团队',
      '制定区域销售策略和目标',
      '开发区域渠道和终端覆盖',
      '管理经销商和价格体系',
      '统筹区域招投标和售后服务',
    ],
    keywords: ['医疗器械销售', '渠道管理', '经销商管理', '渠道开发', '终端覆盖', '价格管理', '终端动销', '招投标', '售后支持', 'IVD耗材'],
    experienceLevel: '高级',
    description: '负责华南区域IVD耗材销售管理和团队带教，需4年以上经验和团队管理背景。',
  },
  {
    id: 'ds-003',
    title: '渠道经理 - 骨科耗材',
    company: '医疗器械公司',
    location: '北京',
    salaryRange: '15-28K·14薪',
    direction: ExpectedDirection.DeviceSales,
    requirements: [
      '3年以上骨科耗材渠道经验',
      '本科以上学历',
      '丰富的经销商网络资源',
      '了解集采政策',
    ],
    responsibilities: [
      '负责骨科耗材渠道开发和管理',
      '管理区域经销商和价格体系',
      '参与集采招投标和配送管理',
      '提供产品培训和渠道支持',
      '跟踪耗材动销和库存管理',
    ],
    keywords: ['医疗器械销售', '渠道管理', '经销商管理', '渠道开发', '价格管理', '终端覆盖', '终端动销', '耗材销售', '产品培训', '招投标'],
    experienceLevel: '中级',
    description: '负责骨科耗材渠道开发和经销商管理，需3年以上渠道经验和集采了解。',
  },
];
