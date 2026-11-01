import "./globals.css";

export const metadata = {
  title: "OfferShield | Recruitment Safety Companion",
  description: "Review job and internship messages for recruitment scam warning signs.",
};

export const viewport = {
  themeColor: "#030b1b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
