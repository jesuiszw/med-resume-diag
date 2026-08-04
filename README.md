# 医药/器械行业简历诊断工具 (Med Resume Diag)

MVP 工具：用户上传 Word 简历，选择期望方向，工具给出简历优化建议和匹配的医疗行业岗位，并使用 LLM 联网搜索获取互联网上的医疗岗位信息。

## 技术栈

- **前端**: React 18 + Vite + MUI v5 + Tailwind CSS
- **后端**: Node.js + Express + TypeScript
- **Word 解析**: mammoth
- **LLM**: OpenAI SDK (GPT-4o-mini / GPT-4o)，支持联网搜索
- **文件上传**: multer

## 项目结构

```
med-resume-diag/
├── frontend/          # 前端 (Vite + React + MUI)
│   ├── src/
│   │   ├── main.tsx       # 入口
│   │   ├── App.tsx        # 路由
│   │   ├── types.ts       # 类型定义
│   │   ├── services/
│   │   │   └── api.ts     # API 调用
│   │   └── pages/
│   │       ├── UploadPage.tsx   # 上传页面
│   │       └── ResultPage.tsx   # 结果页面
│   └── ...
├── backend/           # 后端 (Express + TypeScript)
│   ├── src/
│   │   ├── index.ts       # 服务器入口
│   │   ├── types.ts       # 类型定义
│   │   ├── routes/
│   │   │   └── analysis.ts     # 分析路由
│   │   └── services/
│   │       ├── docxParser.ts      # Word 解析
│   │       ├── llmService.ts       # LLM 服务
│   │       └── webSearchService.ts # 联网搜索
│   └── ...
└── README.md
```

## 快速开始

### 1. 配置环境变量

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入你的 OPENAI_API_KEY
```

### 2. 启动后端

```bash
cd backend
npm install
npm run dev
# 后端运行在 http://localhost:3001
```

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
# 前端运行在 http://localhost:5173
```

### 4. 使用

1. 打开 http://localhost:5173
2. 上传 .docx 格式的简历
3. 选择期望方向（产品经理、MSL、销售专员等）
4. 点击"开始诊断"
5. 查看优化建议、匹配岗位和市场信息

## 功能说明

### 简历优化建议

AI 分析简历在医疗行业求职中的不足，从四个维度给出建议：
- **内容缺失**: 缺少重要信息
- **表达优化**: 表达方式需改进
- **结构问题**: 简历结构/排版问题
- **关键词补充**: 缺少行业常用关键词

每条建议包含：问题描述、具体建议、优先级（高/中/低）

### 匹配岗位推荐

基于简历内容和期望方向，推荐 Top-5 匹配的医疗行业岗位，包含：
- 岗位名称
- 匹配度评分 (0-100)
- 匹配理由
- 能力差距分析

### 互联网岗位信息

通过 LLM 联网搜索获取当前市场信息：
- 招聘趋势
- 常见要求
- 薪资范围
- 热门关键词
- 市场概况

## API 接口

### POST /api/analyze

**Request**: `multipart/form-data`
- `file`: .docx 简历文件 (max 10MB)
- `direction`: 期望方向枚举值

**Response**:
```json
{
  "result": {
    "suggestions": [...],
    "jobMatches": [...],
    "jobMarket": {...}
  }
}
```

### GET /api/health

健康检查接口。

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| OPENAI_API_KEY | OpenAI API 密钥 | (必填) |
| PORT | 后端端口 | 3001 |
| OPENAI_MODEL_FAST | 快速模型 | gpt-4o-mini |
| OPENAI_MODEL_COMPLEX | 复杂任务模型 | gpt-4o |

## 注意事项

- 无数据库、无认证、无支付、无后台管理
- 简历内容仅在内存中处理，不做持久化存储
- LLM 调用需要较长时间（约30-60秒），请耐心等待
- 需要有效的 OpenAI API Key 才能使用 AI 分析功能
