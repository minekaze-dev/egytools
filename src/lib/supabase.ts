import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const SUPABASE_URL = meta.env?.VITE_SUPABASE_URL || 'https://xlaanrhjojnijmqfjsir.supabase.co';
const SUPABASE_ANON_KEY = meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsYWFucmhqb2puaWptcWZqc2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzk1MTcsImV4cCI6MjEwMDcxNTUxN30.wyi7EbH4k5knPAqiy-RVK1qYKWh89dcO_7PUHARUgvM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
