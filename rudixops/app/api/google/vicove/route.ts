import { NextRequest, NextResponse } from "next/server";

import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.JKEY as string,
      clientSecret: process.env.JSECRET as string,
    },
  },
});

const signIn = async () => {
  const data = await auth.api.signInSocial({
    body: {
      provider: "google", // or any other provider id
      callbackURL: "https://rudixops.dev/api/google/vicove",
    },
  });
  return data as { url: string; error?: string };
};
export async function GET(req: NextRequest) {
  //const { query } = await req.json();
  const code = req?.nextUrl?.searchParams.get("code");
  if (!code) {
    const data = await signIn();
    const url = data.url
      .replace(
        "_uri=",
        "_uri=" + encodeURIComponent("https://rudixops.dev/api/google/vicove"),
      )
      .replace("%2Fcallback%2Fgoogle", "");

    return NextResponse.redirect(url, 302);
  }
  //return NextResponse.json({ success: true, code });

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.JKEY!,
      client_secret: process.env.JSECRET!,
      redirect_uri: "https://rudixops.dev/api/google/vicove",
      grant_type: "authorization_code",
    }),
  });

  const tokens = await resp.json();
  return NextResponse.json({ success: true, tokens });
}
