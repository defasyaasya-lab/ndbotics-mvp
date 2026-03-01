import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/money";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams?.q || "").trim();

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(q
        ? {
            name: {
              contains: q,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main>
      {/* HEADER */}
      <section className="card" style={{ marginTop: 12 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Katalog Produk</h2>
            <div className="small" style={{ marginTop: 6 }}>
              Pilih barang, masukkan ke keranjang, lalu checkout untuk invoice &
              pembayaran.
            </div>
          </div>

          <form
            action="/"
            method="GET"
            style={{ minWidth: 280, flex: "0 0 auto" }}
          >
            <input
              className="input"
              name="q"
              placeholder="Cari produk..."
              defaultValue={q}
            />
          </form>
        </div>
      </section>

      {/* PROMO BANNER */}
      <div
        className="card"
        style={{
          marginTop: 14,
          background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
          border: "none",
        }}
      >
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            🚚 Gratis Ongkir Seluruh Indonesia
          </div>

          <div className="small" style={{ opacity: 0.95 }}>
            Minimal pembelian <b>Rp 500.000</b>
          </div>
        </div>
      </div>

      {/* GRID PRODUK */}
      <div className="grid" style={{ marginTop: 14 }}>
        {products.map((p) => (
          <div key={p.id} className="card" style={{ position: "relative" }}>
            {/* BADGE */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "#22c55e",
                color: "#000",
                fontWeight: 700,
                fontSize: 12,
                padding: "4px 8px",
                borderRadius: 999,
                zIndex: 3,
              }}
            >
              🚚 Free Shipping
            </div>

            {/* GAMBAR (CROP) + WATERMARK */}
            {p.imageUrl ? (
              <div
                style={{
                  width: "100%",
                  height: 210,
                  overflow: "hidden",
                  borderRadius: 16,
                  position: "relative",
                  background: "#0f172a",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "130%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    transform: "translateY(-12%)",
                  }}
                />

                {/* WATERMARK TOKO */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      letterSpacing: 2,
                      color: "rgba(41, 41, 42, 0.20)",
                      textTransform: "uppercase",
                      transform: "rotate(-20deg)",
                      userSelect: "none",
                 
                    }}
                  >
                    NDBotics
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 210,
                  borderRadius: 16,
                  border: "1px dashed rgba(255,255,255,.20)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <span className="small">No image</span>
              </div>
            )}

            {/* NAMA */}
            <div style={{ marginTop: 10, fontWeight: 800, lineHeight: 1.2 }}>
              {p.name}
            </div>

            {/* HARGA */}
            <div className="price">Rp {formatRupiah(p.sellingPrice)}</div>

            {/* FORM TAMBAH CART */}
            <form action="/api/cart/add" method="POST" style={{ marginTop: 10 }}>
              <input type="hidden" name="productId" value={p.id} />
              <div className="row" style={{ alignItems: "center" }}>
                <input
                  className="input"
                  type="number"
                  name="qty"
                  defaultValue={1}
                  min={1}
                  style={{ maxWidth: 90 }}
                />
                <button className="btn" type="submit" style={{ flex: 1 }}>
                  🛒 Masukkan Keranjang
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="card" style={{ marginTop: 14 }}>
          Produk tidak ditemukan. Coba kata kunci lain.
        </div>
      )}
    </main>
  );
}