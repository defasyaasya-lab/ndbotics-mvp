import { prisma } from "@/lib/prisma";

export default async function AdminSettings() {
  const s = await prisma.setting.findUnique({ where: { id: "singleton" } });

  return (
    <main>
      <h2 style={{marginTop:0}}>Settings</h2>

      <form className="card" action="/api/admin/settings" method="POST">
        <div className="row">
          <div style={{flex:1, minWidth:240}}>
            <label className="small">Nama Toko</label>
            <input className="input" name="shopName" defaultValue={s?.shopName || "NDBotics"} required />
          </div>
          <div style={{flex:1, minWidth:240}}>
            <label className="small">WhatsApp Supplier</label>
            <input className="input" name="supplierWa" defaultValue={s?.supplierWa || "6285346567107"} required />
          </div>
        </div>

        <div className="row" style={{marginTop:10}}>
          <div style={{flex:1, minWidth:180}}>
            <label className="small">Bank</label>
            <input className="input" name="bankName" defaultValue={s?.bankName || "BRI"} required />
          </div>
          <div style={{flex:1, minWidth:240}}>
            <label className="small">No Rek</label>
            <input className="input" name="bankAccount" defaultValue={s?.bankAccount || "694201029298534"} required />
          </div>
          <div style={{flex:1, minWidth:240}}>
            <label className="small">Atas Nama</label>
            <input className="input" name="bankHolder" defaultValue={s?.bankHolder || "M NABIL KHAIRI IKHSAN"} required />
          </div>
        </div>

        <div style={{marginTop:10}}>
          <label className="small">Invoice Prefix</label>
          <input className="input" name="invoicePref" defaultValue={s?.invoicePref || "INV"} required />
        </div>

        <button className="btn" type="submit" style={{marginTop:12}}>Simpan</button>
      </form>
    </main>
  );
}
