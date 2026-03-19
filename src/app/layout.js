import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import { Toaster } from "react-hot-toast";
import Shell from "./components/Shell";

export const metadata = {
  title: "Plus Creative Studio",
  description:
    "Full-service digital agency and creative partner for major brands in Egypt & the Middle East.",
  icons: {
    icon: "/plus-webicon.webp", // standard favicon (tab icon)
    apple: "/plus-webicon.webp", // iOS home screen icon
    shortcut: "/plus-webicon.webp", // legacy browsers
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        <Toaster position="top-center" />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
