import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'INTJ MBTIクイズ',
  description: 'INTJ寄りの選択肢を当てる30問のMBTIクイズ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
