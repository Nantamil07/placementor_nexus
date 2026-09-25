import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Placementor Nexus",
  description: "Next-generation professional network and campus placement ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/setup-profile"
      signUpForceRedirectUrl="/setup-profile"
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
