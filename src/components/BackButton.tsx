"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Kembali" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn"
      onClick={() => router.back()}
      style={{ opacity: 0.95 }}
    >
      {label}
    </button>
  );
}