"use client";

import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react";

type Platform = {
  name: string;
  key: string;
  color: string;
  icon: string;
};

const platforms: Platform[] = [
  { name: "تیک‌تاک", key: "tiktok", color: "bg-pink-500", icon: "🎵" },
  { name: "توویچ", key: "twitch", color: "bg-purple-500", icon: "🎮" },
  { name: "اسپاتیفای", key: "spotify", color: "bg-green-500", icon: "🎧" },
  { name: "ساندکلود", key: "soundcloud", color: "bg-orange-500", icon: "☁️" },
];

type Status = "idle" | "loading" | "available" | "taken" | "error";

export default function UsernameCheckerPage() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(false);

  const checkUsername = async () => {
    if (!username.trim()) return;

    setLoading(true);
    const initialStatus: Record<string, Status> = {};
    platforms.forEach((p) => (initialStatus[p.key] = "loading"));
    setResults(initialStatus);

    const newResults: Record<string, Status> = {};

    await Promise.all(
      platforms.map(async (p) => {
        try {
          const res = await fetch(`/api/2/${p.key}/${username}`);
          const data = await res.json();

          if (data?.data?.available === true) newResults[p.key] = "available";
          else if (data?.data?.available === false) newResults[p.key] = "taken";
          else newResults[p.key] = "error";
        } catch {
          newResults[p.key] = "error";
        }
      })
    );

    setResults(newResults);
    setLoading(false);
  };

  const renderStatus = (status: Status) => {
    switch (status) {
      case "error":
        return (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle size={16} /> آزاد
          </div>
        );
      case "taken":
        return (
          <div className="flex items-center gap-1 text-red-500">
            <XCircle size={16} /> گرفته‌شده
          </div>
        );
      case "loading":
        return (
          <div className="flex items-center gap-1 text-gray-400">
            <Loader2 className="animate-spin" size={16} /> بررسی...
          </div>
        );
      case "error":
        return <span className="text-gray-400">خطا یا نامشخص</span>;
      default:
        return <span className="text-gray-500">منتظر بررسی</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-dvh flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">
        یوزرنیم چکر - usernname checker
      </h1>

      <div dir="ltr" className="flex w-full max-w-md mb-8">
        <input
          type="text"
          placeholder="یوزرنیم را وارد کن..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 bg-white px-4 py-2 rounded-e-lg outline-none border border-gray-200 text-gray-800"
        />
        <button
          onClick={checkUsername}
          disabled={!username.trim() || loading}
          className="bg-black text-white px-4 py-2 rounded-s-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              در حال بررسی...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> بررسی
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {platforms.map((p) => (
          <div
            key={p.key}
            className="rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between bg-white hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-full text-white ${p.color}`}
              >
                {p.icon}
              </div>
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {renderStatus(results[p.key])}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
