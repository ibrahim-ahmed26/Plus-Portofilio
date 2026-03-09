import "./globals.css";
import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";
import Cursor from "../app/components/Cursor";
import LoadingScreen from "./components/LoadingScreen";
import { Toaster } from "react-hot-toast";
import Shell from "./components/Shell";

export const metadata = {
  title: "Plus Creative Studio",
  description:
    "Full-service digital agency and creative partner for major brands in Egypt & the Middle East.",
  icons: {
    icon: "/plus.png", // standard favicon (tab icon)
    apple: "/plus.png", // iOS home screen icon
    shortcut: "/plus.png", // legacy browsers
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        <Toaster position="top-center" />
        <Cursor />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
