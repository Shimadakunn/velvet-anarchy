"use server";

import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

/**
 * Verify admin password against environment variable
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set");
    return false;
  }

  return password === adminPassword;
}

/**
 * Create an admin session by setting a secure cookie
 */
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

/**
 * Check if user has a valid admin session
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  return session?.value === "authenticated";
}

/**
 * Logout by deleting the admin session cookie
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Login action - verifies password and creates session
 */
export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  const isValid = await verifyAdminPassword(password);

  if (!isValid) {
    return { success: false, error: "Invalid password" };
  }

  await createAdminSession();
  return { success: true };
}
