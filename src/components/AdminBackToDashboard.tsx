import Link from "next/link";

export default function AdminBackToDashboard() {
  return (
    <Link className="btn secondary" href="/admin/dashboard">
      ← Dashboard
    </Link>
  );
}