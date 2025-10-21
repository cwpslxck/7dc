import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { platform: string; username: string } }
) {
  const { platform, username } = params;

  const baseUrls: Record<string, string> = {
    tiktok: "https://api.instantusername.com/c/tiktok/",
    twitch: "https://api.instantusername.com/c/twitch/",
    spotify: "https://api.instantusername.com/c/spotify/",
    soundcloud: "https://api.instantusername.com/c/soundcloud/",
    telegram: "https://api.instantusername.com/c/telegram/",
  };

  const apiUrl = baseUrls[platform];
  if (!apiUrl)
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });

  try {
    const res = await fetch(apiUrl + username, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NextCheckBot/1.0)",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from upstream" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
