import './globals.css';
import React from 'react';

export const metadata = {
  title: 'VibeCheck Fashion AI',
  description: 'Il tuo personal stylist virtuale con IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
