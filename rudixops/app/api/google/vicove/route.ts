import { NextRequest, NextResponse } from "next/server";

import { betterAuth } from "better-auth";
const gurl = `https://accounts.google.com/o/oauth2/v2/auth?
 scope=openid%20email%20profile&
 access_type=offline&
 include_granted_scopes=true&
 response_type=code&
 state=state_parameter_passthrough_value&
 redirect_uri=https%3A//rudixops.dev/api/google/vicove&
 client_id=${process.env.JKEY}`
  .replaceAll(" ", "")
  .replaceAll("\n", "");

export async function GET(req: NextRequest) {
  //const { query } = await req.json();
  const code = req?.nextUrl?.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(gurl, 302);
  } else {
    const params = {
      code: code,
      client_id: process.env.JKEY!,
      client_secret: process.env.JSECRET!,
      redirect_uri: "https://rudixops.dev/api/google/vicove",
      grant_type: "authorization_code",
    };
    try {
      const resp = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(params),
      });

      const tokens = await resp.json();

      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      const user = await res.json();
      //return NextResponse.json({ success: true, tokens, code, params, user });
      return NextResponse.redirect(
        "rudixjokes://?access_token=" + tokens.access_token,
        302,
      );
    } catch (error) {
      return NextResponse.json({ error, params });
    }
  }
}
