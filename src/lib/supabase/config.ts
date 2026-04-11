// Configuración de Supabase embebida en el build
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ehxvlivldrbpjsfefpqp.supabase.co",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoeHZsaXZsZHJicGpzZmVmcHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NjY4NzEsImV4cCI6MjA4NDQ0Mjg3MX0.WDaUOXFHFlwPAvibs6rDGYGYFIG_pB3iqjknZ0sk4Fo"
};
