import type { Metadata } from "next"
import "./globals.css"
import { ApolloWrapper } from "./ApolloWrapper";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

export const metadata: Metadata = {
  title: "Github Explorer",
  description: "Search and explore GitHub users and repositories",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <header>
            <Navbar/>
          </header>

          <main>
            {children}
          </main>

          <Footer />
        </ApolloWrapper>
      </body>
    </html>
  );
}
