"use client";

import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname(); // untuk deteksi halaman aktif

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    // Helper untuk cek active link
    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-purple-700 text-white flex flex-col min-h-screen">
            <div className="p-6 text-2xl font-bold border-b border-purple-600">
                Bendahara 💜
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <Link
                    href="/dashboard"
                    className={`block px-4 py-2 rounded-lg transition ${isActive("/dashboard") ? "bg-purple-600" : "hover:bg-purple-600"
                        }`}
                >
                    Dashboard
                </Link>
                <Link
                    href="/dashboard/pemasukan"
                    className={`block px-4 py-2 rounded-lg transition ${isActive("/dashboard/pemasukan")
                            ? "bg-purple-600"
                            : "hover:bg-purple-600"
                        }`}
                >
                    Pemasukan
                </Link>
                <Link
                    href="/dashboard/pengeluaran"
                    className={`block px-4 py-2 rounded-lg transition ${isActive("/dashboard/pengeluaran")
                            ? "bg-purple-600"
                            : "hover:bg-purple-600"
                        }`}
                >
                    Pengeluaran
                </Link>
                <Link
                    href="/laporan"
                    className={`block px-4 py-2 rounded-lg transition ${isActive("/laporan") ? "bg-purple-600" : "hover:bg-purple-600"
                        }`}
                >
                    Laporan
                </Link>
            </nav>
            <div className="p-4 border-t border-purple-600">
                <button
                    onClick={handleLogout}
                    className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-500 transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
