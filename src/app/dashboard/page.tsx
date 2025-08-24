"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

// Helper untuk dapatkan awal & akhir bulan ini
function getMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    return { start, end };
}

export default function DashboardPage() {
    const [totalPemasukan, setTotalPemasukan] = useState(0);
    const [totalPengeluaran, setTotalPengeluaran] = useState(0);

    useEffect(() => {
        const { start, end } = getMonthRange();

        // 🔹 Ambil pemasukan bulan ini
        const qPemasukan = query(
            collection(db, "pemasukan"),
            where("tanggal", ">=", start),
            where("tanggal", "<=", end)
        );

        const unsubPemasukan = onSnapshot(qPemasukan, (snapshot) => {
            const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().jumlah || 0), 0);
            setTotalPemasukan(total);
        });

        // 🔹 Ambil pengeluaran bulan ini
        const qPengeluaran = query(
            collection(db, "pengeluaran"),
            where("tanggal", ">=", start),
            where("tanggal", "<=", end)
        );

        const unsubPengeluaran = onSnapshot(qPengeluaran, (snapshot) => {
            const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().jumlah || 0), 0);
            setTotalPengeluaran(total);
        });

        return () => {
            unsubPemasukan();
            unsubPengeluaran();
        };
    }, []);

    const saldo = totalPemasukan - totalPengeluaran;

    return (
        <div>
            <h1 className="text-3xl font-bold text-purple-700">Dashboard</h1>
            <p className="mt-4 text-gray-700">
                Selamat datang di sistem bendahara 💜
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-purple-700">
                        Total Pemasukan (bulan ini)
                    </h2>
                    <p className="text-2xl font-bold mt-2">Rp {totalPemasukan.toLocaleString()}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-purple-700">
                        Total Pengeluaran (bulan ini)
                    </h2>
                    <p className="text-2xl font-bold mt-2">Rp {totalPengeluaran.toLocaleString()}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-purple-700">Saldo</h2>
                    <p className="text-2xl font-bold mt-2">Rp {saldo.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
