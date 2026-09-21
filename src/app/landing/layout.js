export const metadata = {
  title: "Plus Creative Studio — Let's Build Something Great",
  description:
    "Full-service digital agency and creative partner for major brands in Egypt & the Middle East.",
};

export default function LandingLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
