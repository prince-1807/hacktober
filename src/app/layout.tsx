import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campus_CP — Real-Time Unified CP Hub & BIT Sindri Leaderboard',
  description:
    'Real-time unified competitive programming leaderboard, 0-1000 rating normalization engine, and campus CP hub for BIT Sindri coders.',
  keywords: [
    'BIT Sindri',
    'Competitive Programming',
    'Codeforces',
    'LeetCode',
    'CodeChef',
    'GeeksforGeeks',
    'HackerRank',
    'Leaderboard',
    'Campus_CP',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-carbon-bg text-carbon-text antialiased selection:bg-hacktober-500/30 selection:text-hacktober-300 min-h-screen">
        {children}
      </body>
    </html>
  );
}
