import Link from "next/link";
import BackButton from "@/components/BackButton";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/money";
import { getSessionId } from "@/lib/session";
import CartQtyInput from "@/components/CartQtyInput";

const MIN_CHECKOUT = 500_000;

export default async function CartPage() {
  const sessionId = getSessionId();

  const items = sessionId
    ? await prisma.cartItem.findMany({
        where: { sessionId },
        include: { product: true },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const subtotal = items.reduce((sum, it) => sum + it.product.sellingPrice * it.qty, 0);
  const canCheckout = subtotal >= MIN_CHECKOUT;

  return (
    <main>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Keranjang</h2>

        {/* ATAS: hanya kembali */}
        <div className="row" style={{ gap: 10 }}>
          <BackButton />
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="small" style={{ marginBottom: 10 }}>
          ✅ Gratis ongkir ke seluruh Indonesia <b>minimal pembelian Rp {formatRupiah(MIN_CHECKOUT)}</b>
        </div>

        {items.length === 0 ? (
          <div>
            Keranjang kosong. <Link href="/">Kembali belanja</Link>
          </div>
        ) : (
          <>
            {items.map((it) => {
              const lineTotal = it.product.sellingPrice * it.qty;
              return (
                <div
                  key={it.id}
                  style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}
                >
                  <div className="row" style={{ justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                    {/* kiri */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800 }}>{it.product.name}</div>
                      <div className="small" style={{ opacity: 0.8, marginTop: 4 }}>
                        Rp {formatRupiah(it.product.sellingPrice)} × {it.qty}
                      </div>
                    </div>

                    {/* kanan */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900 }}>Rp {formatRupiah(lineTotal)}</div>
                      {/* qty bisa ketik + popup hapus */}
                      <CartQtyInput id={it.id} initialQty={it.qty} />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
              <div style={{ fontWeight: 800 }}>Subtotal</div>
              <div style={{ fontWeight: 900 }}>Rp {formatRupiah(subtotal)}</div>
            </div>

            {!canCheckout && (
              <div className="small" style={{ marginTop: 10, color: "rgba(255,220,120,.95)" }}>
                Minimal pembelian <b>Rp {formatRupiah(MIN_CHECKOUT)}</b> untuk checkout.
              </div>
            )}

            {/* BAWAH: tombol aksi utama */}
            <div className="row" style={{ marginTop: 14, gap: 10 }}>
              <Link
                className="btn"
                href="/checkout"
                style={{ pointerEvents: canCheckout ? "auto" : "none", opacity: canCheckout ? 1 : 0.5 }}
                aria-disabled={!canCheckout}
              >
                Checkout
              </Link>

              <Link className="btn secondary" href="/">
                Tambah produk
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}