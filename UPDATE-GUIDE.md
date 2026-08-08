# 更新部署指南

## 更新流程（3步）

### 1. 改代码
在 `med-resume-diag-v2/` 目录里修改文件。

### 2. 推送到 GitHub
打开终端，运行：

```bash
cd /Users/a123/WorkBuddy/2026-08-04-10-19-29/med-resume-diag-v2
python3 deploy.py
```

脚本会自动扫描所有改动文件，推送到 GitHub。

如果只改了几个文件，也可以指定：

```bash
python3 deploy.py frontend/src/App.tsx backend/src/index.ts
```

### 3. Render 自动部署
推送后 Render 会自动检测新 commit，开始构建部署（约 2-3 分钟）。

- 访问地址: https://med-resume-diag.onrender.com
- 部署状态: Render Dashboard → Resources → med-resume-diag

## 常见改动场景

### 改前端文字/样式
```
改 frontend/src/ 下的文件 → python3 deploy.py
```

### 改后端逻辑
```
改 backend/src/ 下的文件 → python3 deploy.py
```

### 改关键词/岗位数据库
```
改 backend/src/data/keywordDatabase.ts 或 jobDatabase.ts → python3 deploy.py
```

## 注意事项

- GitHub Token 可能会过期（通常 90 天）。如果推送报 401 错误，需要去 GitHub 重新生成 Token 并更新 deploy.py 里的 TOKEN 值
- Render 免费版服务会在 15 分钟无访问后休眠，再次访问时会自动唤醒（约 30 秒）
- 推送后可以在 Render Dashboard 看到构建日志，如果有报错把日志发给我
