import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { maskPhone } from '../utils';
import { supabase } from '../supabaseClient';

export const DesapegoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    phone: '',
    description: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalVal = value;
    if (name === 'phone') finalVal = maskPhone(value);

    setFormData(prev => ({ ...prev, [name]: finalVal }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const remainingSlots = 4 - imageFiles.length;

      if (filesArray.length > remainingSlots) {
        alert(`Você só pode adicionar mais ${remainingSlots} foto(s).`);
        filesArray.splice(remainingSlots);
      }

      const newImageFiles = [...imageFiles, ...filesArray];
      setImageFiles(newImageFiles);

      const imagePromises = filesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(newImageUrls => {
        setImagePreviews(prev => [...prev, ...newImageUrls]);
      }).catch(error => {
        console.error("Erro ao ler arquivos de imagem:", error);
        alert("Ocorreu um erro ao carregar as imagens.");
      });

      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        // Ensure bucket 'desapego_images' exists in Supabase
        const { error: uploadError } = await supabase.storage.from('desapego_images').upload(fileName, file);
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error("Falha ao fazer upload da imagem. Verifique se o bucket 'desapego_images' existe.");
        }

        const { data: { publicUrl } } = supabase.storage.from('desapego_images').getPublicUrl(fileName);
        imageUrls.push(publicUrl);
      }

      const { error: insertError } = await supabase.from('products').insert({
        seller_id: user.id,
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        images: imageUrls,
        product_type: 'desapego',
        contact_phone: formData.phone,
        condition: 'good', // Default or add field
        category: 'Outros' // Default or add field
      });
      if (insertError) throw insertError;

      alert("Anúncio publicado com sucesso!");
      navigate('/desapego');

    } catch (error: any) {
      console.error("Erro ao publicar anúncio:", error);
      alert(`Erro ao publicar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/desapego')}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-slate-900">{isEditing ? 'Editar Anúncio' : 'Novo Desapego'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 max-w-lg mx-auto space-y-6 animate-slide-up">

        {/* Image Upload Area */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Fotos (Até 4)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="grid grid-cols-2 gap-3">
            {imagePreviews.map((imageSrc, index) => (
              <div key={index} className="aspect-square rounded-[24px] bg-slate-100 relative overflow-hidden group">
                <img src={imageSrc} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 backdrop-blur-sm rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {imagePreviews.length < 4 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-[24px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 transition-all"
              >
                <Upload size={24} className="mb-2" />
                <span className="text-[10px] font-bold uppercase">Adicionar</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Input
            label="O que você está vendendo?"
            name="title"
            placeholder="Ex: Bicicleta, Sofá..."
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valor (R$)"
              name="price"
              type="number"
              placeholder="0,00"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <Input
              label="WhatsApp Contato"
              name="phone"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Descrição</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Conte detalhes sobre o estado do produto, tempo de uso, motivo da venda..."
              className="w-full p-5 rounded-[20px] bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-400 focus:outline-none transition-all text-slate-800 font-medium resize-none"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className="pt-6">
          <Button fullWidth type="submit" disabled={isLoading}>
            {isLoading ? 'Publicando...' : (isEditing ? 'Salvar Alterações' : 'Publicar Anúncio')}
          </Button>
          <p className="text-center text-xs text-slate-400 mt-4 font-medium px-4">
            Seu nome e endereço (Bloco/Apto) aparecerão automaticamente no anúncio.
          </p>
        </div>

      </form>
    </div>
  );
};