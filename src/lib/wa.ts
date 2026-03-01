export function buildWaLink(params: {
  waNumber: string;
  invoiceNo: string;
  name: string;
  total: number;
}) {
  const { waNumber, invoiceNo, name, total } = params;
  const text =
`Halo Admin, saya sudah melakukan pembayaran.
Invoice: ${invoiceNo}
Nama: ${name}
Total: Rp ${total}
Saya lampirkan bukti transfer ya.`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}
