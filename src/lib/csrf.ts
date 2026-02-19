import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_TOKEN_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

// Generate a CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Verify CSRF token from header matches cookie
export async function verifyCsrfToken(request: Request): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(CSRF_TOKEN_NAME);
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!tokenCookie || !headerToken) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(tokenCookie.value),
      Buffer.from(headerToken)
    );
  } catch {
    return false;
  }
}

// Set CSRF cookie
export function setCsrfCookie(response: Response, token: string): void {
  response.headers.append(
    "Set-Cookie",
    `${CSRF_TOKEN_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
  );
}

// Helper to create CSRF-protected response
export function createCsrfResponse(data: object, status = 200): Response {
  const token = generateCsrfToken();
  const response = new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token,
    },
  });
  setCsrfCookie(response, token);
  return response;
}
