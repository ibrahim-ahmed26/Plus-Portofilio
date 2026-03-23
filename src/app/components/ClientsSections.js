"use client";
import { useEffect, useState } from "react";
import ClientsMarquee from "./ClientsMarquee";

export default function ClientsSection() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function load() {
      const { getDocs, collection } = await import("firebase/firestore");
      const { db } = await import("@/app/lib/firebase");
      const snap = await getDocs(collection(db, "clients"));
      const data = snap.docs.map((d) => ({
        name: d.data().name,
        logo: d.data().logo || null,
      }));
      setClients(data);
    }
    load();
  }, []);

  return <ClientsMarquee clients={clients} />;
}
