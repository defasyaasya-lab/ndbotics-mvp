import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";

export default async function UserNav() {
  const sessionId = getSessionId();

  // hitung jumlah produk unik (jumlah baris cartItem)
  const cartCount = sessionId
    ? await prisma.cartItem.count({
        where: { sessionId },
      })
    : 0;

  const hasItems = cartCount > 0;

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          NDBotics
        </Link>

        <nav className="nav-actions">
          {hasItems ? (
            <Link
              className="chip"
              href="/cart"
              style={{ position: "relative" }}
            >
              🛒 Cart

              {/* badge angka */}
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -8,
                  minWidth: 20,
                  height: 20,
                  padding: "0 6px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                  background: "#22c55e",
                  color: "#000",
                }}
              >
                {cartCount}
              </span>
            </Link>
          ) : (
            <button
              className="chip"
              disabled
              style={{
                opacity: 0.45,
                cursor: "not-allowed",
              }}
            >
              🛒 Cart
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}