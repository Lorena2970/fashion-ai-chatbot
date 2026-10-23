import './globals.css';
import React from 'react';

export const metadata = {
  title: 'VibeCheck Fashion AI',
  description: 'Your personal AI fashion stylist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
