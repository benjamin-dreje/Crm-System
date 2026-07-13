import { NextResponse } from "next/server";

const BACKEND_URL = "https://crm-system-cxgw.onrender.com/api";

async function handler(request, { params }) {
  try {
    const { proxy } = await params;

    const path = proxy.join("/");
    const url = `${BACKEND_URL}/${path}`;

    console.log("🔀 Proxy URL:", url);
    console.log("🔀 Method:", request.method);

    const headers = new Headers(request.headers);

    // לא להעביר Host של Vercel
    headers.delete("host");

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text();

    console.log("🔀 Body:", body);

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    console.log("🔀 Backend status:", response.status);

    const data = await response.text();

    console.log("🔀 Backend response:", data);

    const res = new NextResponse(data || "{}", {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/json",
      },
    });

    // להעביר Cookies מה-Backend לדפדפן
    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      res.headers.append("set-cookie", setCookie);
    }

    return res;
  } catch (error) {
    console.error("❌ Proxy error:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
