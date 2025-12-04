import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRegistration } from '../context/RegistrationContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { maskPhone, maskDate } from '../utils';
import { ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const RegisterBasic: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { data, updateBasicInfo } = useRegistration();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!data.role) {
    React.useEffect(() => {
      navigate('/register/type');
    }, [navigate]);
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'phone') formattedValue = maskPhone(value);
    if (name === 'birthDate') formattedValue = maskDate(value);
    updateBasicInfo({ [name]: formattedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password, confirmPassword, name } = data.basicInfo;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    // For providers, we don't create the account yet, we move to next step
    if (data.role === 'provider') {
      navigate('/register/provider-complete');
      return;
    }

    // For residents, we create the account now
    const { data: signUpData, error: signUpError } = await signUp(email, password, {
      full_name: name,
      role: data.role,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (signUpData.user) {
      // The trigger will create the profile. For residents, we update it.
      if (data.role === 'resident') {
        // Convert DD/MM/YYYY to YYYY-MM-DD for Supabase date type
        const [day, month, year] = data.basicInfo.birthDate.split('/');
        const formattedBirthDate = `${year}-${month}-${day}`;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            phone: data.basicInfo.phone,
            birth_date: formattedBirthDate,
            condo_name: data.basicInfo.condoName,
            address: data.basicInfo.address,
          })
          .eq('id', signUpData.user.id);

        if (updateError) {
          setError(`Usuário criado, mas falha ao salvar perfil: ${updateError.message}`);
          setLoading(false);
          return;
        }
        alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");
        navigate('/login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-[#f8fafc] max-w-lg mx-auto">
      <div className="flex items-center mb-8 pt-4">
        <Link to="/register/type" className="p-3 -ml-3 rounded-full hover:bg-slate-100 text-slate-900 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div className="ml-2">
          <h1 className="text-2xl font-black text-slate-900">Informações Básicas</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input label="Nome Completo" name="name" placeholder="Seu Nome" value={data.basicInfo.name} onChange={handleChange} required disabled={loading} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Telefone" name="phone" placeholder="(00) 00000-0000" value={data.basicInfo.phone} onChange={handleChange} maxLength={15} required disabled={loading} />
          <Input label="Nascimento" name="birthDate" placeholder="DD/MM/AAAA" value={data.basicInfo.birthDate} onChange={handleChange} maxLength={10} required disabled={loading} />
        </div>

        {data.role === 'resident' && (
          <>
            <Input label="Nome do Condomínio" name="condoName" placeholder="Residencial..." value={data.basicInfo.condoName || ''} onChange={handleChange} required disabled={loading} />
            <Input label="Endereço" name="address" placeholder="Bloco B, Apt 402" value={data.basicInfo.address || ''} onChange={handleChange} required disabled={loading} />
          </>
        )}

        <Input label="E-mail" name="email" type="email" placeholder="seu@email.com" value={data.basicInfo.email} onChange={handleChange} required disabled={loading} />
        <Input label="Senha" name="password" isPassword placeholder="•••••••" value={data.basicInfo.password} onChange={handleChange} required disabled={loading} />
        <Input label="Confirmar Senha" name="confirmPassword" isPassword placeholder="•••••••" value={data.basicInfo.confirmPassword} onChange={handleChange} required disabled={loading} />

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="pt-6">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : data.role === 'resident' ? 'Finalizar' : 'Continuar'}
            {!loading && data.role !== 'resident' && <ChevronRight size={20} />}
          </Button>
        </div>
      </form>
    </div>
  );
};