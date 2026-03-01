import Link from "next/link";
import AdminTopBar from "@/components/AdminTopBar";

export default function AdminDashboard() {
  return (
    <main>
      <AdminTopBar backHref="/" backLabel="Kembali ke Home" />

      <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>

      <div className="grid">
        <Link className="card" href="/admin/products" style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 900 }}>Produk & Harga</div>
          <div className="small">Edit selling price (harga jual)</div>
        </Link>

        <Link className="card" href="/admin/orders" style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 900 }}>Order</div>
          <div className="small">Lihat order & update status</div>
        </Link>

        <Link className="card" href="/admin/sync" style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 900 }}>Sync</div>
          <div className="small">Tarik produk dari Ichibot / Tokopedia</div>
        </Link>

        <Link className="card" href="/admin/settings" style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 900 }}>Settings</div>
          <div className="small">Bank & WhatsApp</div>
        </Link>

        <Link className="card" href="/admin/import-tokopedia" style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 900 }}>Import Tokopedia Manual</div>
          <div className="small">Tambah produk Tokopedia via URL</div>
        </Link>
      </div>
    </main>
  );
}