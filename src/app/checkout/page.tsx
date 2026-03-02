import Link from "next/link";
import BackButton from "@/components/BackButton";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/money";
import { getSessionId } from "@/lib/session";

const MIN_CHECKOUT = 500_000;

export default async function CheckoutPage({ searchParams }: { searchParams?: { err?: string } }) {
  const sessionId = await getSessionId();

  const items = sessionId
    ? await prisma.cartItem.findMany({
        where: { sessionId },
        include: { product: true },
        orderBy: { createdAt: "asc" },
      })
    : [];

  const total = items.reduce((sum, it) => sum + it.product.sellingPrice * it.qty, 0);
  const canCheckout = total >= MIN_CHECKOUT;

  return (
    <main>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Checkout</h2>
        <div className="row" style={{ gap: 10 }}>
          <BackButton />
          <Link className="btn" href="/cart">Ke Keranjang</Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="small" style={{ marginBottom: 10 }}>
          ✅ Gratis ongkir ke seluruh Indonesia <b>minimal pembelian Rp {formatRupiah(MIN_CHECKOUT)}</b>
        </div>

        {searchParams?.err === "min" && (
          <div className="small" style={{ marginBottom: 10, color: "rgba(255,220,120,.95)" }}>
            Total kamu masih di bawah minimal Rp {formatRupiah(MIN_CHECKOUT)}.
          </div>
        )}

        {items.length === 0 ? (
          <div>Keranjang kosong. <Link href="/">Kembali belanja</Link></div>
        ) : (
          <>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div style={{ fontWeight: 900 }}>Total</div>
              <div style={{ fontWeight: 900 }}>Rp {formatRupiah(total)}</div>
            </div>

            {!canCheckout && (
              <div className="small" style={{ marginTop: 10, color: "rgba(255,220,120,.95)" }}>
                Minimal pembelian <b>Rp {formatRupiah(MIN_CHECKOUT)}</b> untuk membuat invoice & pembayaran.
              </div>
            )}

          <form action="/api/checkout" method="POST" style={{ marginTop: 14 }}>
            <input type="hidden" name="sessionId" value={sessionId ?? ""} />
            {/* Nama + WA */}
            <div className="row" style={{ gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="small" style={{ display: "block", marginBottom: 6 }}>
                  Nama <span style={{ color: "rgba(255,120,120,.95)" }}>*</span>
                </label>
                <input
                  className="input"
                  name="customerName"
                  required
                  placeholder="Nama penerima"
                  autoComplete="name"
                />
              </div>

              <div style={{ flex: 1 }}>
                <label className="small" style={{ display: "block", marginBottom: 6 }}>
                  No. WhatsApp <span style={{ color: "rgba(255,120,120,.95)" }}>*</span>
                </label>
                <input
                  className="input"
                  name="phone"
                  required
                  inputMode="numeric"
                  pattern="^[0-9]{9,15}$"
                  placeholder="contoh: 6281234567890"
                  title="Masukkan nomor WhatsApp hanya angka (9–15 digit), contoh: 6281234567890"
                  autoComplete="tel"
                />
                <div className="small" style={{ marginTop: 6, opacity: 0.85 }}>
                  Gunakan format <b>62</b> (tanpa +, tanpa spasi). Contoh: <b>62812xxxxxxx</b>
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div style={{ marginTop: 12 }}>
              <label className="small" style={{ display: "block", marginBottom: 6 }}>
                Alamat <span style={{ color: "rgba(255,120,120,.95)" }}>*</span>
              </label>
              <textarea
                className="input"
                name="address"
                rows={5}
                required
                placeholder={
                  "Format alamat (lengkap):\n" +
                  "Jalan / No Rumah / Patokan\n" +
                  "RT/RW\n" +
                  "Kelurahan, Kecamatan\n" +
                  "Kota/Kabupaten, Provinsi\n" +
                  "Kode Pos\n\n" +
                  "Contoh:\n" +
                  "Jl. Melati No. 10 (dekat minimarket)\n" +
                  "RT 02 / RW 05\n" +
                  "Kel. Sukamaju, Kec. Cibiru\n" +
                  "Kota Bandung, Jawa Barat\n" +
                  "40615"
                }
              />
              <div className="small" style={{ marginTop: 6, opacity: 0.85 }}>
                Tulis lengkap untuk mempermudah pengiriman.
              </div>
            </div>

            <button
              className="btn"
              type="submit"
              disabled={!canCheckout}
              style={{ marginTop: 14, opacity: canCheckout ? 1 : 0.5 }}
            >
              Buat Invoice & Bayar
            </button>
          </form>
          </>
        )}
      </div>
    </main>
  );
}