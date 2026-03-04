import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabaseUrl = `https://${projectId.trim()}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey.trim());
