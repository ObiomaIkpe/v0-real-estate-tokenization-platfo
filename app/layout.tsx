import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import NavBar from "@/components/layout/NavBar";
import { Providers } from "./providers";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "REALiFi",
//   description: "Real Estate Tokenization Platform",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Providers>
//           <NavBar />
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }

// In your layout file, replace the Inter import with:
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {" "}
        {/* Use Tailwind's default sans font stack */}
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
