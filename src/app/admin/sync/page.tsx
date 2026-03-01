export default function AdminSync() {
  return (
    <main>
      <h2 style={{marginTop:0}}>Sync Produk</h2>

      <div className="card">
        <div style={{fontWeight:900}}>Ichibot</div>
        <div className="small">Tarik produk dari store.ichibot.id (WooCommerce Store API)</div>
        <form action="/api/admin/sync/ichibot" method="POST" style={{marginTop:10}}>
          <button className="btn" type="submit">Sync Ichibot</button>
        </form>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div style={{fontWeight:900}}>Tokopedia (Apify — optional)</div>
        <div className="small">Isi APIFY_TOKEN di .env jika ingin auto-sync</div>
        <form action="/api/admin/sync/tokopedia" method="POST" style={{marginTop:10}}>
          <button className="btn" type="submit">Sync Tokopedia (Apify)</button>
        </form>
      </div>
    </main>
  );
}
