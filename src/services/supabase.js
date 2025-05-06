// src/services/supabase.js
import { createClient } from "@supabase/supabase-js";

// Substitua as variáveis abaixo com as informações do seu projeto no Supabase
const supabaseUrl = "https://gpbrlopuyhyjyzwwjedw.supabase.co";  // Substitua pelo URL do seu projeto
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYnJsb3B1eWh5anl6d3dqZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDExNDEsImV4cCI6MjA2MjExNzE0MX0.3CdapAM0d5Hdxs34N4p4rHMuRk6d_KtTxZHCSg5UfLI";  // Substitua pela chave pública da API

export const supabase = createClient(supabaseUrl, supabaseKey);
