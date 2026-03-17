import "./globals.css";

export const metadata = {
  title: "The Heritage Path — Wealth Advisor Edition",
  description: "Dành cho những gia đình nghĩ xa hơn một thế hệ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* Nạp Font từ Google theo tiêu chuẩn Luxury */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Be+Vietnam+Pro:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
