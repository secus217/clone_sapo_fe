import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ndneydozwaxbnekwicwh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbmV5ZG96d2F4Ym5la3dpY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjUwMTYsImV4cCI6MjA1ODcwMTAxNn0.3dSEvubQqKdYTYXgvDdqgtzdAjDu63EPMn1cwbC6kds";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;


