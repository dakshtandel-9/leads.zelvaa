"use client";

import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";

export default function TopBar() {
  const router = useRouter();
  const { instance, accounts } = useMsal();
  const name = accounts[0]?.name ?? accounts[0]?.username ?? "";

  async function handleLogout() {
    await instance.logoutPopup();
    router.replace("/login");
  }

  return (
    <div className="topbar">
      <div
        className="brand"
        onClick={() => router.push("/leads")}
        style={{ cursor: "pointer" }}
      >
        Zelvaa <span>Leads</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {name && <span className="muted">{name}</span>}
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
