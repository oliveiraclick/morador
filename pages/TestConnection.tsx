import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testando...');

  useEffect(() => {
    async function check() {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        setStatus('Conectado ao Supabase com sucesso!');
      } catch (err: any) {
        setStatus('Erro: ' + err.message);
      }
    }
    check();
  }, []);

  return (
    <div className="p-4">
      <h1>Teste de Conexão</h1>
      <p>{status}</p>
    </div>
  );
}
