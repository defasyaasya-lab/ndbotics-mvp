import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default function AdminTopBar({
  backHref = "/admin/dashboard",
  backLabel = "Kembali ke Dashboard",
  showLogout = true,
}: {
  backHref?: string;
  backLabel?: string;
  showLogout?: boolean;
}) {
  return (
    <div
      className="row"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <Link className="btn secondary" href={backHref}>
        ← {backLabel}
      </Link>

      {showLogout ? <AdminLogoutButton /> : null}
    </div>
  );
}