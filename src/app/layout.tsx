import { DM_Sans, Fira_Code, Inter } from "next/font/google";

import ThemeProvider from "./theme-provider";
import Navbar from "components/navbar/index";

export const inter = Inter({ subsets: ["latin"] });
export const dmSans = DM_Sans({ subsets: ["latin"] });
export const firaCode = Fira_Code({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
