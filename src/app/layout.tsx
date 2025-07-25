import type { Metadata } from "next"
import "./globals.css"
import { ApolloWrapper } from "context/ApolloWrapper";
import { GithubProvider } from "context/GithubContext";
import Footer from "components/Footer";

export const metadata: Metadata = {
  title: "Github Explorer",
  description: "Search and explore GitHub users and repositories",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GithubProvider>
          <ApolloWrapper>
            <div className="text-custom_black text-sm min-h-dvh flex flex-col">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ApolloWrapper>
        </GithubProvider>
      </body>
    </html>
  );
}
