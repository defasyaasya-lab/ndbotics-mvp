export function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}
