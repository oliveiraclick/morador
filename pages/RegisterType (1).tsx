

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SelectionCard } from '../components/SelectionCard';
import { Home, Briefcase } from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';

export const RegisterType: React.FC = () => {
  const navigate = useNavigate();
  const { updateData } = useRegistration();

  const selectRole = (role: 'resident' | 'provider') => {
    updateData({ role });
    navigate('/register/basic');
  };

  return (
    <div className="min-h-screen p-6 bg-[#f8fafc] flex flex-col justify-center max-w-lg mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Criar Conta</h1>
        <p className="text-slate-500 font-bold">Escolha sua jornada.</p>
      </div>

      <div className="space-y-6">
        <SelectionCard 
          title="Sou Morador"
          description="Encontre serviços e produtos incríveis no seu prédio."
          icon={<Home size={32} strokeWidth={2} />}
          onClick={() => selectRole('resident')}
        />

        <SelectionCard 
          title="Sou Prestador"
          description="Ofereça seus serviços e produtos aos vizinhos."
          icon={<Briefcase size={32} strokeWidth={2} />}
          onClick={() => selectRole('provider')}
        />
      </div>

      <div className="mt-12 text-center">
        <Link to="/login" className="text-violet-600 font-black hover:text-violet-700">
          Já tem conta? Entrar
        </Link>
      </div>
    </div>
  );
};