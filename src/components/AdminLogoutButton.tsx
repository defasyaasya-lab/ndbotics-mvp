"use client";

export default function AdminLogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button className="btn secondary" type="submit">
        Logout
      </button>
    </form>
  );
}