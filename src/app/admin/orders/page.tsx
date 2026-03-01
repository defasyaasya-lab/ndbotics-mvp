import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatRupiah } from "@/lib/money";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { invoice: true }
  });

  return (
    <main>
      <h2 style={{marginTop:0}}>Orders</h2>

      <div className="card">
        {orders.length === 0 ? (
          <div className="small">Belum ada order.</div>
        ) : (
          orders.map(o => (
            <div key={o.id} style={{display:"flex", justifyContent:"space-between", gap:12, padding:"10px 0", borderBottom:"1px solid #eee"}}>
              <div>
                <div style={{fontWeight:900}}>{o.orderCode}</div>
                <div className="small">{o.customerName} • {o.phone}</div>
                <div className="small">Invoice: {o.invoice?.invoiceNo || "-"}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:900}}>Rp {formatRupiah(o.total)}</div>
                <div className="small">Status: {o.status}</div>
                <div className="row" style={{justifyContent:"flex-end", marginTop:8}}>
                  <Link className="btn secondary" href={`/invoice/${o.id}`}>Lihat Invoice</Link>
                </div>
                <form action="/api/admin/orders/status" method="POST" className="row" style={{justifyContent:"flex-end", marginTop:8}}>
                  <input type="hidden" name="orderId" value={o.id} />
                  <select name="status" className="input" style={{maxWidth:220}}>
                    {["WAITING_PAYMENT","PAID","PROCESSING","SHIPPED","DONE","CANCELED"].map(s => (
                      <option key={s} value={s} selected={s===o.status}>{s}</option>
                    ))}
                  </select>
                  <button className="btn" type="submit">Update</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
