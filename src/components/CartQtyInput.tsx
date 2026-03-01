"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CartQtyInput({
  id,
  initialQty,
}: {
  id: string;
  initialQty: number;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(String(initialQty));
  const [isPending, startTransition] = useTransition();

  const lastGoodQty = useRef(initialQty);

  // modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingDelete = useRef(false);

  useEffect(() => {
    setQty(String(initialQty));
    lastGoodQty.current = initialQty;
  }, [initialQty]);

  async function postQty(newQty: number) {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("qty", String(newQty));

    await fetch("/api/cart/set-qty", {
      method: "POST",
      body: fd,
    });

    // penting biar harga/total di server component ikut ke-refresh
    router.refresh();
  }

  function submit(newQty: number) {
    startTransition(async () => {
      await postQty(newQty);
    });
  }

  function sanitizeDigitsOnly(v: string) {
    // ✅ buang semua karakter selain angka
    const onlyDigits = v.replace(/\D/g, "");
    // cegah angka kepanjangan (opsional)
    return onlyDigits.slice(0, 6); // max 999999
  }

  function commit(raw: string) {
    const cleaned = sanitizeDigitsOnly(raw);

    // kalau kosong, balikkan ke qty terakhir yang valid
    if (!cleaned) {
      setQty(String(lastGoodQty.current));
      return;
    }

    const n = Number(cleaned);

    if (n <= 0) {
      // tampilkan modal confirm
      pendingDelete.current = true;
      setConfirmOpen(true);
      return;
    }

    const fixed = Math.max(1, Math.floor(n));
    setQty(String(fixed));
    lastGoodQty.current = fixed;
    submit(fixed);
  }

  function increase() {
    const n = (Number(qty || lastGoodQty.current) || 1) + 1;
    setQty(String(n));
    lastGoodQty.current = n;
    submit(n);
  }

  function decrease() {
    const current = Number(qty || lastGoodQty.current) || 1;
    const n = current - 1;

    if (n <= 0) {
      pendingDelete.current = true;
      setConfirmOpen(true);
      return;
    }

    setQty(String(n));
    lastGoodQty.current = n;
    submit(n);
  }

  function onConfirmYes() {
    setConfirmOpen(false);
    if (pendingDelete.current) {
      pendingDelete.current = false;
      // qty 0 => hapus item
      submit(0);
    }
  }

  function onConfirmNo() {
    setConfirmOpen(false);
    pendingDelete.current = false;

    // kalau batal hapus, balikin minimal 1
    setQty("1");
    lastGoodQty.current = 1;
    submit(1);
  }

  return (
    <>
      <div className="row" style={{ gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
        {/* minus */}
        <button
          className="btn secondary"
          type="button"
          onClick={decrease}
          disabled={isPending}
          style={{ width: 44 }}
          aria-label="Kurangi jumlah"
        >
          −
        </button>

        {/* input qty (HANYA ANGKA) */}
        <input
          className="input"
          value={qty}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          onChange={(e) => {
            const cleaned = sanitizeDigitsOnly(e.target.value);
            setQty(cleaned);
          }}
          onBlur={() => commit(qty)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          style={{
            width: 96,
            textAlign: "center",
            fontWeight: 800,
            opacity: isPending ? 0.6 : 1,
          }}
          aria-label="Jumlah"
        />

        {/* plus */}
        <button
          className="btn secondary"
          type="button"
          onClick={increase}
          disabled={isPending}
          style={{ width: 44 }}
          aria-label="Tambah jumlah"
        >
          +
        </button>
      </div>

      {/* ✅ Modal confirm custom (lebih menarik) */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: 16,
          }}
          onClick={onConfirmNo}
        >
          <div
            className="card"
            style={{
              width: "min(520px, 100%)",
              padding: 18,
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,.45)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255, 120, 120, .18)",
                  fontSize: 18,
                }}
              >
                🗑️
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>
                  Hapus produk dari keranjang?
                </div>
                <div className="small" style={{ opacity: 0.9 }}>
                  Jumlah kamu menjadi <b>0</b>. Jika lanjut, produk akan dihapus dari keranjang.
                </div>
              </div>
            </div>

            <div className="row" style={{ justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button className="btn secondary" type="button" onClick={onConfirmNo}>
                Batal
              </button>
              <button className="btn" type="button" onClick={onConfirmYes}>
                Ya, hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}