# INTJ MBTI Quiz

Next.js (App Router) + TypeScript + Tailwind CSS で作成した、INTJ寄りの選択肢を当てる30問クイズです。

## 機能

- 30問の4択MBTIクイズ
- 各問題で「INTJらしい選択肢」を正解として採点
- 回答後に解説表示
- 進捗バーと現在のINTJ一致数を表示
- 結果画面で推定MBTIタイプと一致率を表示
- `localStorage` にベスト一致数 / プレイ回数 / 前回タイプを保存

## 開発環境

- Node.js 18 以上

## セットアップ

```bash
npm install
npm run dev
```

## スクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 主要ファイル

```txt
.
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib
│   └── mbtiQuestions.ts
└── README.md
```
