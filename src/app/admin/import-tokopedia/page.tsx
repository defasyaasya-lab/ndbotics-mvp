export default function ImportTokopedia() {
  return (
    <main>
      <h2 style={{marginTop:0}}>Import Tokopedia Manual</h2>

      <div className="card">
        <div className="small">
          Untuk MVP paling stabil: tambah produk Tokopedia dengan URL + nama + gambar + harga sumber,
          lalu kamu bisa set harga jual (override) di menu Produk & Harga.
        </div>
      </div>

      <form className="card" style={{marginTop:12}} action="/api/admin/tokopedia/manual" method="POST">
        <div className="row">
          <div style={{flex:1, minWidth:240}}>
            <label className="small">Nama Produk</label>
            <input className="input" name="name" required />
          </div>
          <div style={{flex:1, minWidth:240}}>
            <label className="small">URL Produk Tokopedia</label>
            <input className="input" name="sourceUrl" required />
          </div>
        </div>

        <div className="row" style={{marginTop:10}}>
          <div style={{flex:1, minWidth:240}}>
            <label className="small">Image URL (opsional)</label>
            <input className="input" name="imageUrl" />
          </div>
          <div style={{flex:1, minWidth:180}}>
            <label className="small">Harga Sumber (Rp)</label>
            <input className="input" name="sourcePrice" type="number" min={0} />
          </div>
        </div>

        <button className="btn" type="submit" style={{marginTop:12}}>Tambah</button>
      </form>
    </main>
  );
}
