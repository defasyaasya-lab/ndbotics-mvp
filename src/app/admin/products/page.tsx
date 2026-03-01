import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/money";
import AdminTopBar from "@/components/AdminTopBar";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main>
      {/* TOP BAR: Back + Logout */}
      <AdminTopBar backHref="/admin/dashboard" backLabel="Kembali ke Dashboard" />

      {/* HEADER */}
      <h2 style={{ marginTop: 0 }}>Produk (Edit Nama, Gambar, Harga, Stok)</h2>

      {/* INFO */}
      <div className="card">
        <div className="small">
          Tips: Kamu bisa edit <b>judul</b>, <b>gambar</b>, <b>harga jual</b>,{" "}
          <b>stok</b>, dan <b>aktif/nonaktif</b>. Tombol <b>Hapus</b> hanya
          menyembunyikan dari katalog user (soft delete).
        </div>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 12 }} className="card">
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 240px 360px 120px",
              gap: 14,
              alignItems: "start",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,.08)",
            }}
          >
            {/* INFO KIRI */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 900, marginBottom: 4 }}>{p.name}</div>

              <div className="small" style={{ opacity: 0.8 }}>
                {p.source || "-"}
                {p.sourceUrl ? (
                  <>
                    {" "}
                    •{" "}
                    <a href={p.sourceUrl} target="_blank" rel="noreferrer">
                      source
                    </a>
                  </>
                ) : null}
              </div>

              <div className="small" style={{ marginTop: 6, opacity: 0.85 }}>
                Harga sumber:{" "}
                {p.sourcePrice ? `Rp ${formatRupiah(p.sourcePrice)}` : "-"}
              </div>

              <div className="small" style={{ marginTop: 10, opacity: 0.85 }}>
                Aktif: <b>{p.isActive ? "Ya" : "Tidak"}</b>
                {" • "}
                Stok tersedia: <b>{(p as any).stock ?? 0}</b>
              </div>
            </div>

            {/* PREVIEW GAMBAR */}
            <div>
              <div
                style={{
                  width: "100%",
                  height: 110,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(255,255,255,.04)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="small"
                    style={{
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      opacity: 0.7,
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              <div className="small" style={{ marginTop: 8, opacity: 0.85 }}>
                Harga jual sekarang: <b>Rp {formatRupiah(p.sellingPrice)}</b>
              </div>
            </div>

            {/* FORM EDIT */}
            <form
              action="/api/admin/products/update"
              method="POST"
              style={{
                display: "grid",
                gap: 10,
                padding: 12,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.10)",
                background: "rgba(255,255,255,.03)",
              }}
            >
              <input type="hidden" name="productId" value={p.id} />

              <div>
                <label className="small">Nama Produk</label>
                <input className="input" name="name" defaultValue={p.name} />
              </div>

              <div>
                <label className="small">URL Gambar</label>
                <input
                  className="input"
                  name="imageUrl"
                  defaultValue={p.imageUrl || ""}
                  placeholder="https://..."
                />
              </div>

              <div className="row" style={{ gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label className="small">Harga Jual</label>
                  <input
                    className="input"
                    name="sellingPrice"
                    type="number"
                    min={0}
                    defaultValue={p.sellingPrice}
                  />
                </div>

                <div style={{ width: 140 }}>
                  <label className="small">Stok</label>
                  <input
                    className="input"
                    name="stock"
                    type="number"
                    min={0}
                    defaultValue={(p as any).stock ?? 0}
                  />
                </div>
              </div>

              <label
                className="small"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={p.isActive}
                />
                Tampilkan di katalog user
              </label>

              <button className="btn" type="submit" style={{ marginTop: 4 }}>
                Simpan
              </button>
            </form>

            {/* HAPUS */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <form action="/api/admin/products/delete" method="POST">
                <input type="hidden" name="productId" value={p.id} />
                <button className="btn secondary" type="submit">
                  Hapus
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}