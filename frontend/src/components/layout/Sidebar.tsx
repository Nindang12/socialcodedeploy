"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import ButtonOption from "../ButtonOption"
import { useParams } from "next/navigation"

export default function Sidebar() {
    const [currentUser, setCurrentUser] = useState<{user_id: string, username: string} | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Get token and set up storage listener
    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleStorage = () => {
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);
                
                try {
                    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
                    setCurrentUser(user);
                } catch (error) {
                    console.error("Error parsing user from storage:", error);
                    setCurrentUser(null);
                }
            };

            handleStorage();
            window.addEventListener("storage", handleStorage);
            return () => window.removeEventListener("storage", handleStorage);
        }
    }, []);

    // Fetch user data when token changes
    useEffect(() => {
        if (!token) return;

        const fetchUser = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch user');
                
                const data = await res.json();
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                setCurrentUser(data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
                setCurrentUser(null);
            }
        };

        fetchUser();
    }, [token]);

    return (
        <div>
            <div className="flex flex-col justify-between py-5 md:w-20 md:h-screen items-center bg-zinc-50 w-screen h-20">
                <img width={40} className="hidden md:block" src="/loom.png" alt="logo" />
                <div className="flex md:flex-col md:gap-16 gap-5 flex-row">
                    <Link href="/" className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={22} src="/assets/home.svg" alt="home" />
                    </Link>
                    <Link href="/search" className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={22} src="/assets/search.svg" alt="search" />
                    </Link>
                    <Link href="/likepage" className="hover:bg-slate-200 p-3 rounded-lg relative cursor-pointer">
                        <img width={22} src="/assets/heart.svg" alt="heart" />
                    </Link>
                    {currentUser?.user_id && (
                        <Link href={`/profile/${currentUser.user_id}`} className="hover:bg-slate-200 p-3 rounded-lg">
                            <img width={20} src="/assets/profile.svg" alt="profile" />
                        </Link>
                    )}
                </div>
                <div className="pb-10">
                    <ButtonOption />
                </div>
            </div>
        </div>
    )
}