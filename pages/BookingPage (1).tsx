import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { supabase } from '../supabaseClient';
import { Service, Profile, Product } from '../types';

export const BookingPage: React.FC = () => {
   const { providerId, serviceId } = useParams();
   const navigate = useNavigate();
   const [selectedDateIndex, setSelectedDateIndex] = useState(0);
   const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
   const [isSuccess, setIsSuccess] = useState(false);
   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   // Data States
   const [provider, setProvider] = useState<Profile | null>(null);
   const [service, setService] = useState<Service | null>(null);
   const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

   // Upsell States
   const [showUpsell, setShowUpsell] = useState(false);
   const [upsellCart, setUpsellCart] = useState<{ [key: string]: number }>({});

   useEffect(() => {
      const fetchData = async () => {
         if (!providerId || !serviceId) return;
         try {
            // Fetch Provider
            const { data: providerData, error: providerError } = await supabase
               .from('profiles')
               .select('*')
               .eq('id', providerId)
               .single();
            if (providerError) throw providerError;
            setProvider(providerData);

            // Fetch Service
            const { data: serviceData, error: serviceError } = await supabase
               .from('services')
               .select('*')
               .eq('id', serviceId)
               .single();
            if (serviceError) throw serviceError;
            setService(serviceData);

            // Fetch Products for Upsell (same provider)
            const { data: productsData } = await supabase
               .from('products')
               .select('*')
               .eq('seller_id', providerId)
               .eq('is_available', true)
               .eq('product_type', 'store'); // Only store products, not desapego

            if (productsData) setAvailableProducts(productsData);

         } catch (error) {
            console.error("Error fetching booking data:", error);
            alert("Erro ao carregar dados do serviço.");
            navigate(-1);
         } finally {
            setIsLoading(false);
         }
      };

      fetchData();
   }, [providerId, serviceId, navigate]);

   if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando...</div>;
   if (!provider || !service) return <div className="min-h-screen flex items-center justify-center text-slate-500">Serviço não encontrado</div>;

   const handleClose = () => navigate(`/provider/${providerId}`);
   const handleHome = () => navigate('/dashboard', { state: { role: 'resident' } });

   const handlePreConfirm = () => {
      // Se tiver produtos para oferecer, mostra o modal de Upsell
      if (availableProducts.length > 0) {
         setShowUpsell(true);
      } else {
         handleFinalConfirm();
      }
   };

   const handleFinalConfirm = async () => {
      try {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) {
            alert("Você precisa estar logado para agendar.");
            navigate('/login');
            return;
         }

         const selectedDayObj = days[selectedDateIndex];
         // Format date as YYYY-MM-DD
         const bookingDate = selectedDayObj.fullDate.toISOString().split('T')[0];

         // 1. Create Booking
         const { error: bookingError } = await supabase.from('bookings').insert({
            service_id: service.id,
            provider_id: provider.id,
            customer_id: user.id,
            booking_date: bookingDate,
            booking_time: selectedPeriod, // Storing the period ID for now (e.g., 'm1')
            total_price: service.price,
            status: 'pending'
         });

         if (bookingError) throw bookingError;

         // 2. Create Order for Upsell Products (if any)
         const upsellItems = Object.entries(upsellCart);
         if (upsellItems.length > 0) {
            const totalUpsell = upsellItems.reduce((acc, [id, qty]) => {
               const product = availableProducts.find(p => p.id === id);
               return acc + (product ? product.price * qty : 0);
            }, 0);

            const { data: orderData, error: orderError } = await supabase.from('orders').insert({
               customer_id: user.id,
               provider_id: provider.id,
               status: 'new',
               total_amount: totalUpsell,
               payment_method: 'pix', // Default
               delivery_address: 'Endereço do Cliente' // Should fetch from profile
            }).select().single();

            if (orderError) throw orderError;

            // Insert Order Items
            const orderItemsData = upsellItems.map(([id, qty]) => {
               const product = availableProducts.find(p => p.id === id);
               return {
                  order_id: orderData.id,
                  product_id: id,
                  quantity: qty,
                  price_at_purchase: product?.price || 0
               };
            });

            const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
            if (itemsError) throw itemsError;
         }

         setShowUpsell(false);
         setIsSuccess(true);
         setTimeout(() => {
            navigate('/dashboard', { state: { role: 'resident' } });
         }, 2500);

      } catch (error: any) {
         console.error("Error creating booking:", error);
         alert(`Erro ao agendar: ${error.message}`);
      }
   };

   // Upsell Logic
   const updateUpsellQty = (id: string, delta: number) => {
      setUpsellCart(prev => {
         const current = (prev[id] as number) || 0;
         const newQty = Math.max(0, current + delta);
         const newCart = { ...prev, [id]: newQty };
         if (newQty === 0) delete newCart[id];
         return newCart;
      });
   };

   const upsellTotal = Object.entries(upsellCart).reduce((acc, [id, qty]) => {
      const product = availableProducts.find(p => p.id === id);
      return acc + (product ? product.price * qty : 0);
   }, 0);

   const finalTotal = (service?.price || 0) + upsellTotal;

   const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
         date: d.getDate(),
         day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
         fullDate: d,
         monthName: d.toLocaleDateString('pt-BR', { month: 'long' }),
         isToday: i === 0,
         index: i,
         isRealToday: new Date().toDateString() === d.toDateString()
      };
   });

   const selectedDayObj = days[selectedDateIndex];

   const periods = [
      { id: 'm1', label: 'Manhã I', time: '07:00 - 09:00', icon: '🌅', endHour: 9 },
      { id: 'm2', label: 'Manhã II', time: '09:01 - 12:00', icon: '☀️', endHour: 12 },
      { id: 't1', label: 'Tarde I', time: '13:00 - 15:00', icon: '🌤️', endHour: 15 },
      { id: 't2', label: 'Tarde II', time: '15:01 - 18:00', icon: '🌙', endHour: 18 },
   ];

   const isPeriodPast = (endHour: number) => {
      if (!selectedDayObj.isRealToday) return false;
      const currentHour = new Date().getHours();
      return currentHour >= endHour;
   };

   // SUCCESS SCREEN WITH VIOLET GRADIENT
   if (isSuccess) {
      return (
         <div className="fixed inset-0 z-[200] bg-gradient-to-br from-violet-600 to-fuchsia-600 flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-violet-600 mb-6 shadow-2xl animate-float">
               <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-3xl font-black mb-2">Solicitação Enviada!</h1>
            <p className="text-white/80 font-medium max-w-xs mx-auto mb-4">
               O prestador <strong>{provider.full_name}</strong> receberá seu pedido.
            </p>
            {upsellTotal > 0 && (
               <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-sm font-bold border border-white/20">
                  + {Object.values(upsellCart).reduce((a, b) => a + b, 0)} produtos adicionados ao pedido.
               </div>
            )}
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#f8fafc] pb-40">
         <div className="bg-slate-900 pt-6 pb-12 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>

            <div className="relative z-10 flex items-center justify-between mb-8">
               <button onClick={handleHome} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <span className="text-xl">🗓️</span>
               </button>
               <h1 className="text-xl font-bold text-white">Agendar Serviço</h1>
               <button onClick={handleClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <span className="text-xl">×</span>
               </button>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-[24px] flex gap-4 items-center">
               <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                  🛠️
               </div>
               <div>
                  <h2 className="text-white font-bold leading-tight mb-1">{service.title}</h2>
                  <p className="text-slate-300 text-xs line-clamp-1">{provider.full_name}</p>
                  <p className="text-fuchsia-400 font-black mt-1">R$ {service.price.toFixed(2)}</p>
               </div>
            </div>
         </div>

         <div className="px-6 -mt-6 relative z-20 space-y-6">

            {/* Calendar Selector */}
            <div className="bg-white p-5 rounded-[32px] shadow-soft border border-slate-50">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <span className="text-violet-600 text-lg">🗓️</span>
                     <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm">
                        {selectedDayObj.monthName}
                     </h3>
                  </div>
                  <button
                     onClick={() => setIsCalendarOpen(true)}
                     className="text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                     Ver Mês Inteiro <span className="text-lg">›</span>
                  </button>
               </div>

               <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-2 px-2">
                  {days.slice(0, 14).map((d) => (
                     <button
                        key={d.index}
                        onClick={() => {
                           setSelectedDateIndex(d.index);
                           setSelectedPeriod(null);
                        }}
                        className={`flex flex-col items-center min-w-[60px] p-3 rounded-[20px] transition-all border-2 ${selectedDateIndex === d.index
                           ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-md transform scale-105'
                           : 'border-slate-100 bg-white text-slate-400 hover:border-violet-200'
                           }`}
                     >
                        <span className="text-[10px] font-bold uppercase mb-1">{d.day}</span>
                        <span className="text-xl font-black">{d.date}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Period Selector */}
            <div className="bg-white p-5 rounded-[32px] shadow-soft border border-slate-50">
               <div className="flex items-center gap-2 mb-4">
                  <span className="text-fuchsia-600 text-lg">🕒</span>
                  <h3 className="font-black text-slate-800 uppercase tracking-wide text-sm">Escolha o período</h3>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  {periods.map((period) => {
                     const isPast = isPeriodPast(period.endHour);
                     // const isBusyRandom = (selectedDateIndex + idx) % 7 === 0; // Mock busy logic
                     const isUnavailable = isPast; // Removed random busy for now

                     return (
                        <button
                           key={period.id}
                           disabled={isUnavailable}
                           onClick={() => setSelectedPeriod(period.id)}
                           className={`p-4 rounded-[24px] border-2 text-left relative overflow-hidden transition-all ${isUnavailable
                              ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed grayscale'
                              : selectedPeriod === period.id
                                 ? 'bg-slate-900 border-slate-900 text-white shadow-lg transform scale-[1.02]'
                                 : 'bg-white border-slate-100 text-slate-600 hover:border-violet-200'
                              }`}
                        >
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-2xl">{period.icon}</span>
                              {selectedPeriod === period.id && <span className="text-green-400 text-lg">✅</span>}
                           </div>
                           <h4 className="font-bold text-sm mb-0.5">{period.label}</h4>
                           <span className={`text-[10px] font-bold ${selectedPeriod === period.id ? 'text-slate-400' : 'text-slate-400'}`}>
                              {period.time}
                           </span>

                           {isUnavailable && (
                              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                 <span className="bg-slate-200 text-slate-500 text-[9px] font-black px-2 py-1 rounded uppercase">
                                    {isPast ? 'Encerrado' : 'Ocupado'}
                                 </span>
                              </div>
                           )}
                        </button>
                     );
                  })}
               </div>
            </div>

            {selectedPeriod && (
               <div className="flex gap-3 bg-orange-50 p-4 rounded-2xl border border-orange-100 items-start animate-fade-in">
                  <span className="text-orange-500 shrink-0 mt-0.5 text-lg">📍</span>
                  <p className="text-xs text-orange-700 font-bold leading-relaxed">
                     O prestador virá até seu endereço cadastrado. Certifique-se que haverá alguém para recebe-lo.
                  </p>
               </div>
            )}

            {!selectedPeriod && (
               <div className="flex gap-2 items-center justify-center opacity-40 py-2">
                  <span className="text-slate-500 text-sm">⚠️</span>
                  <p className="text-xs font-bold text-slate-500">Selecione uma data e um período acima.</p>
               </div>
            )}
         </div>

         {/* FOOTER FIXED */}
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-[100] pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4 px-2">
               <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Total estimado</p>
                  <p className="text-2xl font-black text-slate-900">R$ {finalTotal.toFixed(2)}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase">Data</p>
                  <p className="text-sm font-black text-slate-800">{selectedDayObj.date} de {selectedDayObj.monthName}</p>
               </div>
            </div>
            <Button
               fullWidth
               onClick={handlePreConfirm}
               disabled={!selectedPeriod}
               className={!selectedPeriod ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400 shadow-none' : 'shadow-glow animate-pulse'}
            >
               {selectedPeriod ? 'Confirmar Agendamento' : 'Selecione um horário'}
            </Button>
         </div>

         {/* Calendar Modal */}
         {isCalendarOpen && (
            <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
               <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-black text-slate-900">Selecione a Data</h3>
                     <button onClick={() => setIsCalendarOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600">
                        <span className="text-xl">×</span>
                     </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     <div className="grid grid-cols-5 gap-3">
                        {days.map((d) => (
                           <button
                              key={d.index}
                              onClick={() => {
                                 setSelectedDateIndex(d.index);
                                 setSelectedPeriod(null);
                                 setIsCalendarOpen(false);
                              }}
                              className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${selectedDateIndex === d.index
                                 ? 'bg-violet-600 border-violet-600 text-white shadow-lg'
                                 : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-violet-300'
                                 }`}
                           >
                              <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.day}</span>
                              <span className="text-lg font-black">{d.date}</span>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* UPSELL MODAL */}
         {showUpsell && (
            <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-md animate-fade-in p-4">
               <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
                  <div className="text-center mb-6">
                     <div className="w-16 h-16 rounded-[24px] bg-violet-100 text-violet-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
                        🛍️
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 leading-tight">Deseja adicionar algo?</h3>
                     <p className="text-slate-500 font-bold text-sm">Aproveite a visita para pedir produtos.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1">
                     {availableProducts.map(product => {
                        const qty = upsellCart[product.id] || 0;
                        return (
                           <div key={product.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                              <div className="w-14 h-14 rounded-xl bg-white shrink-0 overflow-hidden">
                                 {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">🛍️</div>
                                 )}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{product.title}</h4>
                                 <span className="text-violet-600 font-black text-xs">R$ {product.price.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
                                 {qty > 0 && (
                                    <>
                                       <button onClick={() => updateUpsellQty(product.id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-lg">➖</button>
                                       <span className="font-bold text-sm w-4 text-center">{qty}</span>
                                    </>
                                 )}
                                 <button onClick={() => updateUpsellQty(product.id, 1)} className="w-7 h-7 flex items-center justify-center bg-violet-600 text-white rounded-lg active:scale-90">➕</button>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Total Summary & Action */}
                  <div className="bg-slate-900 rounded-[24px] p-5 text-white">
                     <div className="flex justify-between items-center mb-2 text-sm opacity-60">
                        <span>Serviço</span>
                        <span>R$ {service.price.toFixed(2)}</span>
                     </div>
                     {upsellTotal > 0 && (
                        <div className="flex justify-between items-center mb-4 text-sm text-green-400 font-bold">
                           <span>Produtos</span>
                           <span>+ R$ {upsellTotal.toFixed(2)}</span>
                        </div>
                     )}
                     <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/10">
                        <span className="font-bold uppercase tracking-widest text-xs">Total Final</span>
                        <span className="font-black text-2xl">R$ {finalTotal.toFixed(2)}</span>
                     </div>
                     <div className="flex gap-3">
                        <button
                           onClick={() => handleFinalConfirm()}
                           className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-colors"
                        >
                           Apenas Serviço
                        </button>
                        <button
                           onClick={handleFinalConfirm}
                           className="flex-[2] py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-sm shadow-glow active:scale-95 transition-transform"
                        >
                           Confirmar Tudo
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};