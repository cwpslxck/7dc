"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

type SoundCloudResponse = {
  title: string;
  thumbnail_url: string | null;
  author_name: string;
  author_url: string;
};

export default function SoundCloudPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<SoundCloudResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SoundCloudResponse[]>([]);

  const placeholder = "/placeholder.gif";

  useEffect(() => {
    const saved = localStorage.getItem("soundcloud_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("soundcloud_history", JSON.stringify(history));
  }, [history]);

  const isValidSoundCloudUrl = (link: string): boolean => {
    try {
      const parsed = new URL(link);
      return (
        parsed.hostname === "soundcloud.com" ||
        parsed.hostname.endsWith(".soundcloud.com")
      );
    } catch {
      return false;
    }
  };

  const fetchSoundCloud = async () => {
    setError(null);
    if (!url.trim()) {
      setError("لطفاً لینک را وارد کن.");
      return;
    }

    if (!isValidSoundCloudUrl(url)) {
      setError("لینک معتبر نیست! لطفاً یک لینک از soundcloud.com وارد کن.");
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const res = await fetch(
        `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(
          url
        )}`
      );

      if (!res.ok) throw new Error("خطا در دریافت اطلاعات");

      const json = await res.json();
      const info: SoundCloudResponse = {
        title: json.title,
        thumbnail_url: json.thumbnail_url || null,
        author_name: json.author_name,
        author_url: json.author_url,
      };
      setData(info);
      setHistory((prev) => [
        info,
        ...prev.filter((i) => i.thumbnail_url !== info.thumbnail_url),
      ]);
    } catch (err) {
      console.error(err);
      setError("مشکلی پیش اومد. لطفاً لینک رو بررسی کن.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        کاور ساندکلود دانلودر
      </h1>

      <div className="flex mb-3">
        <input
          value={url}
          name="Soundcloud Link"
          onChange={(e) => setUrl(e.target.value)}
          placeholder="لینک ساندکلود را وارد کن..."
          className="flex-1 bg-white rounded-s-lg px-3 py-2 outline-none"
        />
        <button
          onClick={fetchSoundCloud}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded-e-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "در حال دریافت..." : "دریافت"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      {data && (
        <div className="rounded-xl overflow-hidden bg-white text-center p-4 mb-8 shadow">
          <Image
            width={400}
            height={400}
            src={data.thumbnail_url || placeholder}
            alt={data.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = placeholder;
            }}
            className="w-full rounded-lg bg-orange-500 mb-3 aspect-square object-contain"
          />
          <h2 className="font-semibold">{data.title}</h2>
          <p className="text-sm text-gray-600">
            <a
              href={data.author_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {data.author_name}
            </a>
          </p>
          <a
            href={data.thumbnail_url || placeholder}
            download={`${data.title}.jpg`}
            className="inline-block mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            دانلود کاور
          </a>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">تاریخچه دانلودها</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <Image
                  height={60}
                  width={60}
                  src={item.thumbnail_url || placeholder}
                  alt={item.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholder;
                  }}
                  className="w-full aspect-square bg-orange-500 object-cover"
                />
                <div className="p-2 text-center text-sm">
                  <p className="line-clamp-3">{item.title}</p>
                  <a
                    href={item.thumbnail_url || placeholder}
                    download={`${item.title}.jpg`}
                    target="_blank"
                    className="text-orange-500 hover:underline text-xs mt-1 inline-block"
                  >
                    دانلود
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
