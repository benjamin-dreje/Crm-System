import { NextResponse } from "next/server";

const BACKEND_URL = "https://crm-system-cxgw.onrender.com/api";

async function handler(request, { params }) {
  const path = params.proxy.join("/");

  const url = `${BACKEND_URL}/${path}`;
  console.log("🔀 Proxying request to:", url);
  const headers = new Headers(request.headers);

  // לא להעביר Host של Vercel
  headers.delete("host");

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
  });

  const data = await response.text();

  const res = new NextResponse(data, {
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
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
