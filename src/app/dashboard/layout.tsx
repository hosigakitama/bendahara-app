"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    // 🔒 Proteksi halaman jika belum login
    useEffect(() => {
        if (!loading && !user) {
            router.push("/"); // redirect ke login
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    // ✨ Layout dashboard tetap dengan sidebar & main content
    return (
        <div className="min-h-screen flex bg-purple-50">
            <Sidebar />
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
