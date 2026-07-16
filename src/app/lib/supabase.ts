import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabaseUrl = `https://${projectId.trim()}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey.trim());

// Base URL for the backend edge function.
export const functionBase = `${supabaseUrl}/functions/v1/make-server-edef7798`;

// Build Authorization headers for OWNER-ONLY backend calls.
// The backend now verifies the caller is a signed-in authorized owner, so these
// requests must send the user's Supabase session token — NOT the public anon key
// (which ships to every visitor and is rejected server-side). Falls back to the
// anon key only when there is no session, so public endpoints still work.
export async function getOwnerToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? publicAnonKey.trim();
}

export async function ownerAuthHeaders(
  extra: Record<string, string> = {}
): Promise<Record<string, string>> {
  return { Authorization: `Bearer ${await getOwnerToken()}`, ...extra };
}
