import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, MapPin, Package } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { supabase } from '../supabaseClient';

export const ProviderOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus>('new');
  const [loading, setLoading] = useState(true);

  const handleBack = () => navigate('/dashboard', { state: { role: 'provider' } });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Orders where current user is the provider
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
               *,
               items:order_items(
                  *,
                  product:products(title)
               ),
               customer:profiles(full_name, address)
            `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Map to Order interface
      const mappedOrders: Order[] = (ordersData || []).map((o: any) => ({
        id: o.id,
        customer_id: o.customer_id,
        provider_id: o.provider_id,
        status: o.status,
        total_amount: o.total_amount,
        payment_method: o.payment_method,
        delivery_address: o.delivery_address || o.customer?.address || 'Endereço não informado',
        created_at: o.created_at,
        clientName: o.customer?.full_name || 'Cliente',
        clientAddress: o.customer?.address || 'Endereço não informado',
        date: new Date(o.created_at).toLocaleDateString('pt-BR'),
        items: o.items.map((i: any) => ({
          id: i.id,
          order_id: i.order_id,
          product_id: i.product_id,
          quantity: i.quantity,
          price_at_purchase: i.price_at_purchase,
          title: i.product?.title || 'Produto'
        }))
      }));

      setOrders(mappedOrders);

    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (status: OrderStatus) => {
    if (status === 'preparing') return orders.filter(o => o.status === 'preparing');
    if (status === 'ready') return orders.filter(o => o.status === 'ready' || o.status === 'completed');
    return orders.filter(o => o.status === 'new');
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Erro ao atualizar status do pedido.");
    }
  };

  const tabs = [
    { id: 'new', label: 'Novos', count: orders.filter(o => o.status === 'new').length },
    { id: 'preparing', label: 'Preparo', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', label: 'Prontos', count: orders.filter(o => o.status === 'ready' || o.status === 'completed').length },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Header */}
      <div className="bg-slate-900 pt-6 pb-6 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 flex items-center gap-4 mb-6">
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Gestor de Pedidos</h1>
        </div>

        {/* Status Tabs */}
        <div className="relative z-10 flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrderStatus)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-400 hover:bg-white/5'
                }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'bg-slate-700 text-white'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-6 space-y-4 animate-slide-up">
        {filterOrders(activeTab).length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Package size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="font-bold text-slate-400">Nenhum pedido nesta aba.</p>
          </div>
        ) : (
          filterOrders(activeTab).map(order => (
            <div key={order.id} className="bg-white rounded-[24px] p-5 shadow-soft border border-slate-50">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-50">
                <div>
                  <h3 className="text-lg font-black text-slate-800">{order.clientName}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mt-1">
                    <Clock size={12} /> {order.date} • #{order.id.slice(-4)}
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                  {order.payment_method}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex gap-2">
                      <span className="font-bold text-slate-900">{item.quantity}x</span>
                      <span className="text-slate-600">{item.title}</span>
                    </div>
                    <span className="text-slate-400">R$ {(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
                  <MapPin size={14} /> {order.clientAddress}
                </div>
                <span className="text-xl font-black text-violet-600">R$ {order.total_amount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {activeTab === 'new' && (
                  <>
                    <button className="h-12 rounded-xl border-2 border-slate-100 font-bold text-slate-400 hover:bg-slate-50">Rejeitar</button>
                    <button
                      onClick={() => updateStatus(order.id, 'preparing')}
                      className="h-12 rounded-xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:bg-violet-700"
                    >
                      Aceitar
                    </button>
                  </>
                )}
                {activeTab === 'preparing' && (
                  <button
                    onClick={() => updateStatus(order.id, 'ready')}
                    className="col-span-2 h-12 rounded-xl bg-green-500 text-white font-bold shadow-lg shadow-green-500/30 hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Marcar como Pronto
                  </button>
                )}
                {activeTab === 'ready' && (
                  <div className="col-span-2 bg-green-50 text-green-700 h-12 rounded-xl flex items-center justify-center font-bold text-sm">
                    Concluído
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
