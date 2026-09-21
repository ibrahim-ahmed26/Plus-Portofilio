import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.css";
import LoadingScreen from "../components/LoadingScreen";
import { Toaster } from "react-hot-toast";
import Shell from "../components/Shell";

export const metadata = {
  title: "Plus Creative Studio",
  description:
    "Full-service digital agency and creative partner for major brands in Egypt & the Middle East.",
  icons: {
    icon: "/plus-webicon.webp",
    apple: "/plus-webicon.webp",
    shortcut: "/plus-webicon.webp",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LoadingScreen />
          <Toaster position="top-center" />
          <Shell>{children}</Shell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}