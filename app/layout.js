import "./globals.css";
import { AppProvider } from "@/components/AppContext";

export const metadata = {
  title: "MovieScope - Discover Your Next Favorite Movie",
  description: "Search thousands of movies, explore ratings, and build your personal watchlist.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
