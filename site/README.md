# 测测你的本命鸟

面向中国原生野生鸟类的 15 型人格测试。当前版本包含完整首页、12 道七档量表题、本地计分、分级揭晓动画、结果分析和科普区。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

发布前校验：

```bash
npm run lint
npm test
npm run build
```

## 内容位置

- 鸟格、题目与权重：`app/data/quiz-data.json`
- 计分逻辑：`app/lib/quiz.ts`
- 页面交互：`app/BirdQuiz.tsx`
- 视觉系统：`app/globals.css`
- AI 鸟格图：`public/birds/characters/`
- 用户科普照片：`public/birds/science/`

科普照片使用鸟类编号命名；详细文件名见 `public/birds/science/README.txt`。缺少照片或 AI 图时，页面会显示与该鸟生境一致的占位画面，因此可以先测试流程、后补资产。

## 发布路线

代码保持纯前端、本地计分和静态资源结构，不绑定专有数据库。当前通过 Sites 保存私有测试版本；公开小规模测试可将同一份代码直接部署到 EdgeOne Pages 或 Cloudflare Pages，无需改写测评逻辑。
