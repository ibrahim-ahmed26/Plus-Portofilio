import "./globals.css";
import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";
import Cursor from "../app/components/Cursor";
import LoadingScreen from "./components/LoadingScreen";

export const metadata = {
  title: "Plus Creative Studio",
  description:
    "Full-service digital agency and creative partner for major brands in Egypt & the Middle East.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        <Cursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
