export default function AdminLogin({
  searchParams,
}: {
  searchParams?: { err?: string };
}) {
  const errMsg =
    searchParams?.err === "1"
      ? "Password salah. Coba lagi ya."
      : searchParams?.err === "2"
      ? "Silakan login dulu untuk masuk halaman admin."
      : "";

  return (
    <main style={{ maxWidth: 460, margin: "80px auto", padding: "0 16px" }}>
      {/* Header kecil */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: 0.3 }}>
          Admin
        </div>
        <div className="small" style={{ opacity: 0.85, marginTop: 6 }}>
          Masukkan password untuk mengelola produk, harga, stok, dan katalog.
        </div>
      </div>

      {/* Card glass */}
      <div
        className="card"
        style={{
          padding: 18,
          borderRadius: 18,
          background:
            "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))",
          border: "1px solid rgba(255,255,255,.12)",
          boxShadow: "0 12px 30px rgba(0,0,0,.25)",
        }}
      >
        {/* Banner */}
        <div
          style={{
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 14,
            background: "linear-gradient(90deg, #1e3a8a, #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            border: "1px solid rgba(255,255,255,.18)",
          }}
        >
          <div style={{ fontWeight: 800 }}>🔐 Admin Login</div>
          <div className="small" style={{ opacity: 0.95 }}>
            NDBotics Panel
          </div>
        </div>

        {/* Error */}
        {errMsg ? (
          <div
            className="small"
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255,180,120,.12)",
              border: "1px solid rgba(255,200,140,.22)",
              color: "rgba(255,220,180,.95)",
              fontWeight: 700,
            }}
          >
            {errMsg}
          </div>
        ) : null}

        <form action="/api/admin/login" method="POST">
          <label className="small" style={{ display: "block", marginBottom: 8 }}>
            Password Admin <span style={{ opacity: 0.8 }}>*</span>
          </label>

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Masukkan password..."
            required
            style={{
              width: "100%",
              borderRadius: 14,
              padding: "12px 14px",
            }}
          />

          <button
            type="submit"
            className="btn"
            style={{
              width: "100%",
              marginTop: 12,
              borderRadius: 14,
              padding: "12px 14px",
              fontWeight: 900,
            }}
          >
            Masuk Admin
          </button>

          <div className="small" style={{ marginTop: 12, opacity: 0.75 }}>
            Tips: Simpan password di <b>.env</b> → <code>ADMIN_PASSWORD</code>
          </div>
        </form>
      </div>

      {/* footer link */}
      <div className="small" style={{ marginTop: 14, opacity: 0.75 }}>
        Kembali ke katalog:{" "}
        <a href="/" style={{ fontWeight: 800 }}>
          Home
        </a>
      </div>
    </main>
  );
}