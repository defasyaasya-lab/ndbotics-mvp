import "./globals.css";
import UserNav from "../components/UserNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <UserNav />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}