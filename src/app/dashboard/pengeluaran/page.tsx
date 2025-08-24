"use client";

import { useState, useEffect } from "react";
import { db } from "../../../../lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

interface Pengeluaran {
    id: string;
    nama: string;
    jumlah: number;
    tanggal: string;
    keterangan: string;
}

export default function PengeluaranPage() {
    const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>([]);
    const [nama, setNama] = useState("");
    const [jumlah, setJumlah] = useState<number | "">("");
    const [tanggal, setTanggal] = useState("");
    const [keterangan, setKeterangan] = useState("");

    // 🔹 Ambil data realtime dari Firestore
    useEffect(() => {
        const q = query(collection(db, "pengeluaran"), orderBy("tanggal", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPengeluaranList(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Pengeluaran[]
            );
        });
        return () => unsubscribe();
    }, []);

    // 🔹 Tambah data ke Firestore
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nama || !jumlah || !tanggal) return;

        await addDoc(collection(db, "pengeluaran"), {
            nama,
            jumlah: Number(jumlah),
            tanggal,
            keterangan,
            createdAt: new Date(),
        });

        setNama("");
        setJumlah("");
        setTanggal("");
        setKeterangan("");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-purple-700 mb-6">
                Halaman Pengeluaran
            </h1>

            {/* Form Tambah Pengeluaran */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-lg p-6 mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Pengeluaran
                        </label>
                        <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                            placeholder="Contoh: Beli ATK"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Jumlah (Rp)
                        </label>
                        <input
                            type="number"
                            value={jumlah}
                            onChange={(e) => setJumlah(Number(e.target.value))}
                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                            placeholder="100000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Keterangan
                        </label>
                        <input
                            type="text"
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                            className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Opsional"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                    Tambah
                </button>
            </form>

            {/* Tabel Daftar Pengeluaran */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-purple-700 mb-4">
                    Daftar Pengeluaran
                </h2>
                {pengeluaranList.length === 0 ? (
                    <p className="text-gray-500">Belum ada data pengeluaran.</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-purple-100 text-left">
                                <th className="p-2 border">Nama</th>
                                <th className="p-2 border">Jumlah</th>
                                <th className="p-2 border">Tanggal</th>
                                <th className="p-2 border">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pengeluaranList.map((item) => (
                                <tr key={item.id} className="hover:bg-purple-50">
                                    <td className="p-2 border">{item.nama}</td>
                                    <td className="p-2 border">Rp {item.jumlah.toLocaleString()}</td>
                                    <td className="p-2 border">{item.tanggal}</td>
                                    <td className="p-2 border">{item.keterangan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
