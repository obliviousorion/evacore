import "./globals.css";
import { Metadata } from "next";
import Sidebar from "@/components/Sidebar/Sidebar";
import StatusBar from "@/components/StatusBar/StatusBar";
import { SEMESTERS } from "@/lib/semesters";

export const metadata: Metadata = {
  title: "EVAL.CORE // Academic Dashboard",
  description: "Academic subject and evaluation management",
  icons: {
    icon: "/kitty.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div id="app-shell">
          <Sidebar semesters={SEMESTERS} />
          <main id="main-panel">
            {children}
          </main>
        </div>
        <StatusBar />
      </body>
    </html>
  );
}
