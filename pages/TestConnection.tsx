import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface DiagnosticInfo {
  hasUrl: boolean;
  hasKey: boolean;
  url: string;
  keyPrefix: string;
  connectionStatus: string;
  error?: string;
}

export default function TestConnection() {
  const [info, setInfo] = useState<DiagnosticInfo | null>(null);

  useEffect(() => {
    async function diagnose() {
      const url = import.meta.env.VITE_SUPABASE_URL || '';
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      const diagnosticInfo: DiagnosticInfo = {
        hasUrl: !!url && url !== 'https://placeholder.supabase.co',
        hasKey: !!key && key !== 'placeholder',
        url: url || 'NÃO CONFIGURADA',
        keyPrefix: key ? key.substring(0, 20) + '...' : 'NÃO CONFIGURADA',
        connectionStatus: 'Testando...',
      };

      try {
        console.log('🔍 [DIAGNOSTIC] Testing Supabase connection...');
        console.log('🔍 [DIAGNOSTIC] URL:', url);
        console.log('🔍 [DIAGNOSTIC] Key prefix:', key.substring(0, 20));

        const { error } = await supabase.auth.getSession();

        if (error) {
          console.log('🔴 [DIAGNOSTIC] Connection error:', error);
          diagnosticInfo.connectionStatus = 'ERRO';
          diagnosticInfo.error = error.message;
        } else {
          console.log('🟢 [DIAGNOSTIC] Connection successful!');
          diagnosticInfo.connectionStatus = 'CONECTADO ✅';
        }
      } catch (err: any) {
        console.log('🔴 [DIAGNOSTIC] Unexpected error:', err);
        diagnosticInfo.connectionStatus = 'ERRO';
        diagnosticInfo.error = err.message || 'Erro desconhecido';
      }

      setInfo(diagnosticInfo);
    }
    diagnose();
  }, []);

  if (!info) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Carregando diagnóstico...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">🔍 Diagnóstico de Conexão</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">Variáveis de Ambiente</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${info.hasUrl ? '✅' : '❌'}`}>
                {info.hasUrl ? '✅' : '❌'}
              </span>
              <div>
                <p className="font-semibold">VITE_SUPABASE_URL</p>
                <p className="text-sm text-slate-600 font-mono">{info.url}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-2xl ${info.hasKey ? '✅' : '❌'}`}>
                {info.hasKey ? '✅' : '❌'}
              </span>
              <div>
                <p className="font-semibold">VITE_SUPABASE_ANON_KEY</p>
                <p className="text-sm text-slate-600 font-mono">{info.keyPrefix}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm p-6 ${info.connectionStatus.includes('✅') ? 'bg-green-50' : 'bg-red-50'
          }`}>
          <h2 className="text-xl font-bold mb-4">Status da Conexão</h2>
          <p className="text-2xl font-bold mb-2">{info.connectionStatus}</p>
          {info.error && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="font-semibold text-red-600 mb-2">Erro:</p>
              <p className="text-sm font-mono text-red-800">{info.error}</p>
            </div>
          )}
        </div>

        {(!info.hasUrl || !info.hasKey) && (
          <div className="mt-6 p-6 bg-yellow-50 rounded-xl">
            <h3 className="font-bold text-yellow-900 mb-2">⚠️ Ação Necessária</h3>
            <p className="text-yellow-800">
              As variáveis de ambiente não estão configuradas corretamente.
              Verifique se você adicionou VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
              nas configurações da Vercel e fez o redeploy.
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-600">
            💡 <strong>Dica:</strong> Abra o Console do navegador (F12) para ver logs detalhados.
          </p>
        </div>
      </div>
    </div>
  );
}
