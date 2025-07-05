// src/app/layout.tsx
export const metadata = {
  title: "Simple Chatbot",
  description: "A basic chatbot using Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
