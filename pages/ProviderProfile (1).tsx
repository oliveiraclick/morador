import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Offer, Profile, Service, Product } from '../types';
import { ArrowLeft, Star, Share2, MessageCircle, CheckCircle, Package, Wrench } from 'lucide-react';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';

export const ProviderProfile: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const location = useLocation();
   const { addToCart, removeFromCart, items, total, itemCount, clearCart } = useCart();
   const [checkoutOpen, setCheckoutOpen] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);
   const [showHybridModal, setShowHybridModal] = useState(false);

   // Data state
   const [provider, setProvider] = useState<Profile | null>(null);
   const [offers, setOffers] = useState<Offer[]>([]);
   const [loading, setLoading] = useState(true);

   // Identify user role
   const state = location.state as { role?: string } | null;
   const isProviderUser = state?.role === 'provider';

   useEffect(() => {
      if (id) {
         fetchProviderData(id);
      }
   }, [id]);

   const fetchProviderData = async (providerId: string) => {
      setLoading(true);
      try {
         // 1. Fetch Profile
         const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', providerId)
            .single();

         if (profileError) throw profileError;
         setProvider(profileData);

         // 2. Fetch Services
         const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .eq('provider_id', providerId)
            .eq('is_active', true);

         if (servicesError) throw servicesError;

         // 3. Fetch Products
         const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', providerId)
            .eq('is_available', true)
            .eq('product_type', 'store'); // Only store products

         if (productsError) throw productsError;

         // 4. Map to Offer type
         const mappedServices: Offer[] = (servicesData || []).map((s: Service) => ({
            id: s.id,
            title: s.title,
            description: s.description || '',
            price: s.price || 0,
            type: 'service',
            imageUrl: s.image_url || undefined,
         }));

         const mappedProducts: Offer[] = (productsData || []).map((p: Product) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            price: p.price,
            type: 'product',
            imageUrl: p.images?.[0] || undefined,
            isAvailableForOrder: p.is_available
         }));

         setOffers([...mappedServices, ...mappedProducts]);

      } catch (error) {
         console.error("Error fetching provider data:", error);
      } finally {
         setLoading(false);
      }
   };

   // Initialize tabs based on provider type
   const products = offers.filter(o => o.type === 'product');
   const services = offers.filter(o => o.type === 'service');
   const hasProducts = products.length > 0;
   const hasServices = services.length > 0;

   const passedTab = (location.state as any)?.initialTab;
   const mappedInitialTab = passedTab ? (passedTab + 's') as 'products' | 'services' : undefined;

   const [activeTab, setActiveTab] = useState<'products' | 'services'>('services');

   // Update active tab when data loads
   useEffect(() => {
      if (!loading) {
         if (mappedInitialTab) {
            setActiveTab(mappedInitialTab);
         } else if (hasServices) {
            setActiveTab('services');
         } else {
            setActiveTab('products');
         }
      }
   }, [loading, hasServices, hasProducts, mappedInitialTab]);

   // Show hybrid choice modal if provider has both and no tab was pre-selected
   useEffect(() => {
      if (!loading && hasProducts && hasServices && !passedTab) {
         setShowHybridModal(true);
      }
   }, [loading, hasProducts, hasServices, passedTab]);

   if (loading) {
      return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div></div>;
   }

   if (!provider) return <div>Provider not found</div>;

   const handleBack = () => {
      if (isProviderUser) {
         // If I am a provider viewing my own profile or another, go back to dashboard
         navigate('/dashboard', { state: { role: 'provider' } });
      } else {
         // Resident
         navigate(-1);
      }
   };

   const getItemQty = (offerId: string) => {
      return items.find(i => i.offerId === offerId)?.quantity || 0;
   };

   const handleCheckout = async () => {
      try {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) {
            alert("Você precisa estar logado para fazer um pedido.");
            navigate('/login');
            return;
         }

         // 1. Create Order
         const { data: orderData, error: orderError } = await supabase.from('orders').insert({
            customer_id: user.id,
            provider_id: provider.id,
            status: 'new',
            total_amount: total,
            payment_method: 'pix', // Default
            delivery_address: 'Endereço do Cliente' // Should fetch from profile
         }).select().single();

         if (orderError) throw orderError;

         // 2. Create Order Items
         const orderItemsData = items.map(item => ({
            order_id: orderData.id,
            product_id: item.offerId,
            quantity: item.quantity,
            price_at_purchase: item.price
         }));

         const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
         if (itemsError) throw itemsError;

         setIsSuccess(true);
         setTimeout(() => {
            clearCart();
            setCheckoutOpen(false);
            setIsSuccess(false);
            navigate('/dashboard', { state: { role: 'resident' } });
         }, 2500);

      } catch (error: any) {
         console.error("Error creating order:", error);
         alert(`Erro ao enviar pedido: ${error.message}`);
      }
   };

   const handleManualSuccessClose = () => {
      clearCart();
      setCheckoutOpen(false);
      setIsSuccess(false);
      navigate('/dashboard', { state: { role: 'resident' } });
   };

   const handleHybridChoice = (choice: 'services' | 'products') => {
      setActiveTab(choice);
      setShowHybridModal(false);
   };

   const renderProductItem = (offer: Offer) => {
      const qty = getItemQty(offer.id);
      return (
         <div key={offer.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex gap-4 items-center">
            <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
               {offer.imageUrl ? (
                  <img src={offer.imageUrl} className="w-full h-full object-cover" alt={offer.title} />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                     <Package size={24} />
                  </div>
               )}
            </div>

            <div className="flex-1">
               <h3 className="font-bold text-slate-900 leading-tight">{offer.title}</h3>
               <p className="text-xs text-slate-500 mb-2 mt-1 line-clamp-2">{offer.description}</p>
               <div className="flex justify-between items-end">
                  <span className="font-black text-violet-600">R$ {offer.price.toFixed(2)}</span>

                  {offer.isAvailableForOrder && (
                     <div className="flex items-center gap-2">
                        {qty > 0 && (
                           <>
                              <button onClick={() => removeFromCart(offer.id)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 active:bg-slate-50">
                                 <span className="text-xl">−</span>
                              </button>
                              <span className="font-bold text-sm min-w-[20px] text-center">{qty}</span>
                           </>
                        )}
                        <button
                           onClick={() => addToCart(offer, provider?.id || '')}
                           className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 ${qty > 0 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-violet-600 hover:text-white'}`}
                        >
                           <span className="text-xl">+</span>
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   };

   const renderServiceItem = (offer: Offer) => (
      <div key={offer.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
         <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-900">{offer.title}</h3>
            <span className="font-black text-violet-600">R$ {offer.price.toFixed(2)}</span>
         </div>
         <p className="text-xs text-slate-500 mb-4">{offer.description}</p>
         <button
            onClick={() => navigate(`/booking/${provider?.id}/${offer.id}`)}
            className="w-full py-3 bg-violet-50 text-violet-700 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-violet-100 transition-colors flex items-center justify-center gap-2 active:scale-95"
         >
            <span className="text-base">🕒</span> Agendar Horário
         </button>
      </div>
   );

   // SUCCESS SCREEN - VIOLET GRADIENT
   if (isSuccess) {
      return (
         <div className="fixed inset-0 z-[200] bg-gradient-to-br from-violet-600 to-fuchsia-600 flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-violet-600 mb-6 shadow-2xl animate-float">
               <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-black mb-2">Pedido Enviado!</h1>
            <p className="text-white/80 font-medium max-w-xs mx-auto mb-8">
               O prestador <strong>{provider.full_name}</strong> recebeu seu pedido. Você pode acompanhar o status na aba "Pedidos".
            </p>
            <button
               onClick={handleManualSuccessClose}
               className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm backdrop-blur-md transition-colors border border-white/20"
            >
               Voltar ao Início
            </button>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-white pb-32">
         {/* Immersive Header */}
         <div className="relative h-72 w-full group">
            <img src={provider.avatar_url || "https://via.placeholder.com/800x600?text=No+Cover"} alt={provider.full_name || ''} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pt-8">
               <button onClick={handleBack} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/20">
                  <ArrowLeft size={20} />
               </button>
               <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/20">
                  <Share2 size={20} />
               </button>
            </div>
         </div>

         <div className="-mt-10 relative bg-white rounded-t-[40px] px-6 pt-10 min-h-screen">
            <div className="flex justify-between items-start mb-2">
               <h1 className="text-3xl font-black text-gray-900 leading-tight w-3/4">{provider.full_name}</h1>
               <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">5.0</span>
               </div>
            </div>

            <p className="text-gray-500 font-medium text-sm mb-6">{provider.categories?.[0]} • {provider.provider_type === 'service' ? 'Serviços' : 'Produtos'}</p>

            <div className="flex gap-3 mb-8">
               <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide ${provider.user_type === 'resident' ? 'bg-violet-50 text-violet-700' : 'bg-gray-100 text-gray-600'}`}>
                  {provider.user_type === 'resident' ? 'Vizinho' : 'Profissional'}
               </span>
               {provider.condo_name && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide bg-green-50 text-green-700 flex items-center gap-1">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> No Condomínio
                  </span>
               )}
            </div>

            <div className="mb-8">
               <h2 className="text-lg font-bold text-gray-900 mb-2">Sobre</h2>
               <p className="text-gray-600 leading-relaxed text-sm">{provider.bio || "Sem descrição."}</p>
            </div>

            {/* Store / Service Toggles */}
            {hasProducts && hasServices && (
               <div className="flex bg-slate-50 p-1 rounded-2xl mb-6">
                  <button
                     onClick={() => setActiveTab('services')}
                     className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'services'
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                        : 'text-slate-400 hover:bg-white hover:text-slate-600'
                        }`}
                  >
                     <Wrench size={16} /> Serviços
                  </button>
                  <button
                     onClick={() => setActiveTab('products')}
                     className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'products'
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                        : 'text-slate-400 hover:bg-white hover:text-slate-600'
                        }`}
                  >
                     <Package size={16} /> Produtos
                  </button>
               </div>
            )}

            <div className="pb-24 animate-slide-up">
               <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-black text-gray-900">
                     {(hasProducts && hasServices)
                        ? (activeTab === 'products' ? 'Vitrine' : 'Menu de Serviços')
                        : (hasProducts ? 'Produtos' : 'Serviços')}
                  </h2>
                  <div className="h-px bg-slate-100 flex-1"></div>
               </div>

               <div className="space-y-4">
                  {(hasProducts && hasServices) ? (
                     activeTab === 'products' ? products.map(renderProductItem) : services.map(renderServiceItem)
                  ) : hasProducts ? (
                     products.map(renderProductItem)
                  ) : (
                     services.map(renderServiceItem)
                  )}

                  {!hasProducts && !hasServices && (
                     <div className="text-center py-10 text-slate-400">
                        Nenhuma oferta disponível no momento.
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Floating Cart Bar */}
         {itemCount > 0 && (
            <div className="fixed bottom-6 left-6 right-6 z-[90] animate-slide-up">
               <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full bg-slate-900 h-16 rounded-[24px] shadow-2xl flex items-center justify-between px-6 active:scale-[0.98] transition-transform"
               >
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {itemCount}
                     </div>
                     <span className="text-white font-bold">Ver Sacola</span>
                  </div>
                  <span className="text-white font-black text-lg">R$ {total.toFixed(2)}</span>
               </button>
            </div>
         )}

         {/* Contact Button */}
         {itemCount === 0 && (
            <div className="fixed bottom-6 left-6 right-6 z-[90]">
               <Button fullWidth className="shadow-2xl shadow-violet-500/40" onClick={() => window.open(`https://wa.me/${provider.phone || ''}`, '_blank')}>
                  <MessageCircle size={20} /> Falar com {provider.full_name?.split(' ')[0]}
               </Button>
            </div>
         )}

         {/* Checkout Modal */}
         {checkoutOpen && (
            <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-in">
               <div className="bg-white w-full max-w-md rounded-[32px] p-6 animate-slide-up shadow-2xl max-h-[85vh] flex flex-col relative">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                     <h3 className="text-xl font-black text-slate-900">Seu Pedido</h3>
                     <button onClick={() => setCheckoutOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><span className="text-xl">×</span></button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 mb-32 pr-2">
                     {items.map(item => (
                        <div key={item.offerId} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
                           <div className="flex gap-3 items-center">
                              <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-xs font-black text-slate-800 shadow-sm">{item.quantity}x</span>
                              <span className="font-bold text-slate-700">{item.title}</span>
                           </div>
                           <span className="font-black text-slate-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                     ))}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white rounded-b-[32px] border-t border-slate-100 z-[100]">
                     <div className="flex justify-between items-center text-lg mb-4">
                        <span className="font-bold text-slate-400">Total</span>
                        <span className="font-black text-slate-900 text-3xl">R$ {total.toFixed(2)}</span>
                     </div>

                     <Button fullWidth onClick={handleCheckout} className="shadow-glow animate-pulse">
                        <CheckCircle size={20} /> Enviar Pedido
                     </Button>
                  </div>
               </div>
            </div>
         )}

         {/* Hybrid Welcome Modal */}
         {showHybridModal && (
            <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
               <div className="bg-white w-full max-w-sm rounded-[32px] p-8 text-center animate-slide-up shadow-2xl relative">
                  <button
                     onClick={() => setShowHybridModal(false)}
                     className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                     <span className="text-xl">×</span>
                  </button>

                  <h2 className="text-2xl font-black text-slate-900 mb-2">Olá, Vizinho!</h2>
                  <p className="text-slate-500 font-bold mb-8">Como a {provider.full_name} pode te ajudar hoje?</p>

                  <div className="space-y-4">
                     <button
                        onClick={() => handleHybridChoice('services')}
                        className="w-full p-6 rounded-[24px] bg-violet-50 border-2 border-violet-100 hover:border-violet-500 hover:bg-violet-500 hover:text-white transition-all group flex flex-col items-center gap-2"
                     >
                        <Wrench size={32} className="text-violet-500 group-hover:text-white transition-colors" />
                        <span className="font-black text-lg text-violet-700 group-hover:text-white">Agendar Serviço</span>
                     </button>

                     <button
                        onClick={() => handleHybridChoice('products')}
                        className="w-full p-6 rounded-[24px] bg-fuchsia-50 border-2 border-fuchsia-100 hover:border-fuchsia-500 hover:bg-fuchsia-500 hover:text-white transition-all group flex flex-col items-center gap-2"
                     >
                        <Package size={32} className="text-fuchsia-500 group-hover:text-white transition-colors" />
                        <span className="font-black text-lg text-fuchsia-700 group-hover:text-white">Comprar Produto</span>
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};