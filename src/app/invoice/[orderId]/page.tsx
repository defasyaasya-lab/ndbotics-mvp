import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/money";
import { buildWaLink } from "@/lib/wa";

export default async function InvoicePage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { invoice: true, items: true }
  });

  if (!order || !order.invoice) {
    return (
      <main>
        <div className="card">Invoice tidak ditemukan.</div>
      </main>
    );
  }

  const setting = await prisma.setting.findUnique({ where: { id: "singleton" } });
  const waNumber = setting?.supplierWa || "6285346567107";

  const waLink = buildWaLink({
    waNumber,
    invoiceNo: order.invoice.invoiceNo,
    name: order.customerName,
    total: order.total
  });

  return (
    <main>
      <h2 style={{marginTop:0}}>Invoice</h2>

      <div className="card">
        <div style={{display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap"}}>
          <div>
            <div className="small">Invoice</div>
            <div style={{fontWeight:900, fontSize:18}}>{order.invoice.invoiceNo}</div>
            <div className="small" style={{marginTop:6}}>Order: {order.orderCode}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="small">Total</div>
            <div style={{fontWeight:900, fontSize:18}}>Rp {formatRupiah(order.total)}</div>
            <div className="small">Status: {order.status}</div>
          </div>
        </div>

        <hr style={{border:"none", borderTop:"1px solid #eee", margin:"14px 0"}} />

        <div style={{fontWeight:800}}>Transfer ke rekening:</div>
        <div style={{marginTop:8}}>
          <div><b>{order.invoice.bankName}</b></div>
          <div>No Rek: <b>{order.invoice.bankAccount}</b></div>
          <div>A/N: <b>{order.invoice.bankHolder}</b></div>
        </div>

        <hr style={{border:"none", borderTop:"1px solid #eee", margin:"14px 0"}} />

        <div style={{fontWeight:800}}>Item</div>
        {order.items.map(it => (
          <div key={it.id} style={{display:"flex", justifyContent:"space-between", padding:"6px 0"}}>
            <div className="small" style={{maxWidth:700}}>{it.nameSnapshot} × {it.qty}</div>
            <div className="small">Rp {formatRupiah(it.lineTotal)}</div>
          </div>
        ))}

        <div style={{display:"flex", justifyContent:"space-between", paddingTop:12}}>
          <div style={{fontWeight:900}}>Total</div>
          <div style={{fontWeight:900}}>Rp {formatRupiah(order.total)}</div>
        </div>
      </div>

      <div className="row" style={{marginTop:12}}>
        <a className="btn" href={waLink} target="_blank" rel="noreferrer">
          Kirim bukti via WhatsApp
        </a>
        <Link className="btn secondary" href="/">Kembali belanja</Link>
      </div>

      <div className="small" style={{marginTop:12}}>
        Setelah transfer, klik tombol WhatsApp lalu kirim foto/screenshot bukti transfer di chat.
      </div>
    </main>
  );
}
