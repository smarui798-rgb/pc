import React, { useState, useEffect } from 'react';
import { LeadData, SiteSettings, Sale, SaleCategory } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import {
  X,
  Users,
  Settings,
  Download,
  ExternalLink,
  MessageCircle,
  CheckCircle,
  Clock,
  Key,
  Save,
  Image as ImageIcon,
  Search,
  Filter,
  Eye,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  HeartCrack,
  FileText,
  UserCheck,
  Sparkles,
  DollarSign,
  Receipt,
  PlusCircle,
  TrendingUp,
  Tag,
  CreditCard,
  Calendar,
  Layers,
} from 'lucide-react';
import { SACRED_IMAGES } from '../config/spiritualConfig';
import { pixel, PIXEL_ID } from '../utils/pixel';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'sales' | 'settings'>('leads');
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Leads state
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sales state
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
  const [saleCategoryFilter, setSaleCategoryFilter] = useState<'all' | 'Consulta' | 'Trabalho Espiritual'>('all');
  const [saleSearchQuery, setSaleSearchQuery] = useState('');

  // New Sale Modal state
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [newSaleForm, setNewSaleForm] = useState({
    leadId: '',
    clienteNome: '',
    clienteWhatsapp: '',
    nomeParceiro: '',
    valor: '9,90',
    tipoTrabalho: 'Consulta Oracular com Mãe Bety',
    metodoPagamento: 'PIX',
    observacoes: '',
    dataVenda: new Date().toISOString().slice(0, 10),
    trackPixel: true,
  });
  const [isSubmittingSale, setIsSubmittingSale] = useState(false);
  const [saleSuccessMsg, setSaleSuccessMsg] = useState('');

  // Selected lead for full quiz details inspection
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(currentSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setSettingsForm(currentSettings);
  }, [currentSettings]);

  useEffect(() => {
    if (isOpen && authenticated) {
      fetchLeads();
      fetchSales();
    }
  }, [isOpen, authenticated]);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const fetchSales = async () => {
    setIsLoadingSales(true);
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      if (data.sales) {
        setSales(data.sales);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setIsLoadingSales(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'santo2026' || passwordInput === 'admin') {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Senha incorreta. A senha padrão do sistema é "santo2026"');
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l))
        );
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este lead?')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // Open Sale Modal from Lead
  const handleOpenSaleModalForLead = (lead: LeadData) => {
    setNewSaleForm({
      leadId: lead.id || '',
      clienteNome: lead.nome,
      clienteWhatsapp: lead.whatsapp,
      nomeParceiro: lead.nomeParceiro || '',
      valor: currentSettings.valorConsulta || '9,90',
      tipoTrabalho: 'Consulta Oracular com Mãe Bety',
      metodoPagamento: 'PIX',
      observacoes: 'Venda de consulta confirmada pelo WhatsApp',
      dataVenda: new Date().toISOString().slice(0, 10),
      trackPixel: true,
    });
    setSaleSuccessMsg('');
    setIsNewSaleModalOpen(true);
  };

  // Handle Manual Sale Submission
  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaleForm.clienteNome.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    const rawVal = parseFloat(newSaleForm.valor.replace(',', '.')) || 0;
    // Rule: até 50 reais é Consulta, mais de 50 reais é Trabalho Espiritual
    const categoria: SaleCategory = rawVal <= 50 ? 'Consulta' : 'Trabalho Espiritual';

    setIsSubmittingSale(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: newSaleForm.leadId || undefined,
          clienteNome: newSaleForm.clienteNome.trim(),
          clienteWhatsapp: newSaleForm.clienteWhatsapp.trim(),
          nomeParceiro: newSaleForm.nomeParceiro.trim(),
          valor: rawVal,
          tipoTrabalho: newSaleForm.tipoTrabalho.trim(),
          metodoPagamento: newSaleForm.metodoPagamento,
          observacoes: newSaleForm.observacoes.trim(),
          dataVenda: newSaleForm.dataVenda
            ? new Date(newSaleForm.dataVenda).toISOString()
            : new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.sale) {
        // Fire Meta Pixel Purchase event if checked
        if (newSaleForm.trackPixel) {
          pixel.purchase(rawVal, categoria, newSaleForm.clienteNome);
        }

        setSaleSuccessMsg(`Venda gravada com sucesso! Categoria: ${categoria} (R$ ${rawVal.toFixed(2)})`);
        await fetchSales();
        await fetchLeads();

        setTimeout(() => {
          setIsNewSaleModalOpen(false);
          setSaleSuccessMsg('');
        }, 1200);
      }
    } catch (err) {
      console.error('Error saving sale:', err);
      alert('Erro ao salvar venda.');
    } finally {
      setIsSubmittingSale(false);
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir o registro desta venda?')) return;
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSales((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Error deleting sale:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateSettings(data.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // CSV Export for Leads
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'ID',
      'Data/Hora',
      'Nome do Lead',
      'WhatsApp',
      'Nome do Parceiro',
      'Tempo de Mudanca',
      'Status',
      'Score Risco',
      'Nivel Risco',
    ];
    const rows = leads.map((l) => [
      l.id || '',
      l.criadoEm || '',
      `"${l.nome.replace(/"/g, '""')}"`,
      `"${l.whatsapp}"`,
      `"${(l.nomeParceiro || '').replace(/"/g, '""')}"`,
      `"${(l.tempoMudanca || '').replace(/"/g, '""')}"`,
      l.status || 'aguardando_pix',
      l.diagnostico?.score || 0,
      l.diagnostico?.nivelRisco || '',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_mae_bety_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics for Leads
  const totalCount = leads.length;
  const aguardandoCount = leads.filter((l) => !l.status || l.status === 'aguardando_pix').length;
  const comprovanteOuPagoCount = leads.filter(
    (l) => l.status === 'comprovante_enviado' || l.status === 'pago'
  ).length;
  const atendidoCount = leads.filter((l) => l.status === 'atendido').length;

  // Metrics for Sales
  // Rule: até 50 reais = Consulta | mais de 50 reais = Trabalho Espiritual
  const totalFaturamento = sales.reduce((acc, s) => acc + (s.valor || 0), 0);
  const consultasSales = sales.filter((s) => s.valor <= 50);
  const totalConsultasValor = consultasSales.reduce((acc, s) => acc + (s.valor || 0), 0);
  const trabalhosSales = sales.filter((s) => s.valor > 50);
  const totalTrabalhosValor = trabalhosSales.reduce((acc, s) => acc + (s.valor || 0), 0);
  const ticketMedio = sales.length > 0 ? totalFaturamento / sales.length : 0;

  // Filtered sales
  const filteredSales = sales.filter((s) => {
    const matchesCategory =
      saleCategoryFilter === 'all' ||
      (saleCategoryFilter === 'Consulta' && s.valor <= 50) ||
      (saleCategoryFilter === 'Trabalho Espiritual' && s.valor > 50);

    const q = saleSearchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.clienteNome.toLowerCase().includes(q) ||
      s.clienteWhatsapp.includes(q) ||
      (s.nomeParceiro || '').toLowerCase().includes(q) ||
      (s.tipoTrabalho || '').toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // Calculate live dynamic category for the sale form input
  const currentFormVal = parseFloat(newSaleForm.valor.replace(',', '.')) || 0;
  const dynamicFormCategory: SaleCategory = currentFormVal <= 50 ? 'Consulta' : 'Trabalho Espiritual';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col rounded-3xl border border-red-900/60 bg-[#0e0204] shadow-2xl shadow-red-950 overflow-hidden text-left">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-[#160407]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-950 border border-amber-500/40 text-amber-300">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-sacred text-base font-bold text-white">
                  Painel de Gestão Espiritual
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Pixel {PIXEL_ID} Ativo
                </span>
              </div>
              <p className="text-[11px] text-rose-300/70">
                Atendimento, Vendas e Configurações de Mãe Bety Oficial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-rose-300/60 hover:text-white hover:bg-red-950 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AUTH CHECK */}
        {!authenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-sm rounded-2xl border border-red-900/60 bg-[#160407] p-8 text-center space-y-4 shadow-xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-950 border border-amber-500/30 text-amber-300">
                <Key className="h-6 w-6" />
              </div>

              <div>
                <h4 className="font-serif-sacred text-lg font-bold text-white">
                  Acesso Restrito
                </h4>
                <p className="text-xs text-rose-200/70 mt-1">
                  Digite a senha de administração para gerenciar leads, vendas e configurações.
                </p>
              </div>

              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite a senha..."
                  className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-4 py-3 text-center text-sm text-white focus:border-amber-400 focus:outline-none"
                  autoFocus
                />
                {authError && (
                  <p className="text-[11px] text-red-400 mt-2 font-medium">{authError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-red-700 to-rose-700 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:brightness-110 transition-all"
              >
                Entrar no Painel
              </button>

              <p className="text-[10px] text-rose-300/40">
                Dica: senha padrão do sistema é <strong>santo2026</strong> ou <strong>admin</strong>
              </p>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-red-950 bg-[#130305] px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-3.5 px-3 sm:px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-rose-300/60 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Leads do Quiz ({totalCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('sales')}
                className={`py-3.5 px-3 sm:px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'sales'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-rose-300/60 hover:text-white'
                }`}
              >
                <Receipt className="h-4 w-4 text-emerald-400" />
                <span>Vendas & Trabalhos Espirituais ({sales.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3.5 px-3 sm:px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-rose-300/60 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Configurações & Chave PIX</span>
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* TAB 1: LEADS & QUIZ RESPONSES */}
              {activeTab === 'leads' && (
                <div>
                  {/* Metrics Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-[#120305] border border-red-950">
                      <p className="text-[11px] font-semibold uppercase text-rose-300/70">
                        Total de Leads
                      </p>
                      <p className="mt-1 font-serif-sacred text-2xl font-bold text-white">
                        {totalCount}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#120305] border border-red-950">
                      <p className="text-[11px] font-semibold uppercase text-amber-400/80">
                        Aguardando PIX
                      </p>
                      <p className="mt-1 font-serif-sacred text-2xl font-bold text-amber-300">
                        {aguardandoCount}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#120305] border border-red-950">
                      <p className="text-[11px] font-semibold uppercase text-emerald-400/80">
                        Comprovante / Pago
                      </p>
                      <p className="mt-1 font-serif-sacred text-2xl font-bold text-emerald-400">
                        {comprovanteOuPagoCount}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#120305] border border-red-950">
                      <p className="text-[11px] font-semibold uppercase text-blue-400/80">
                        Atendidos
                      </p>
                      <p className="mt-1 font-serif-sacred text-2xl font-bold text-blue-300">
                        {atendidoCount}
                      </p>
                    </div>
                  </div>

                  {/* Search, Filter & Actions Bar */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-rose-400/50" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar por nome, parceiro ou WhatsApp..."
                          className="w-full rounded-xl border border-red-900/60 bg-[#120305] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-rose-400/40 focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-rose-400/70 shrink-0" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="rounded-xl border border-red-900/60 bg-[#120305] px-3 py-2.5 text-xs text-rose-200 focus:border-amber-400 focus:outline-none"
                        >
                          <option value="all">Todos os Status</option>
                          <option value="aguardando_pix">Aguardando PIX</option>
                          <option value="comprovante_enviado">Comprovante Enviado</option>
                          <option value="pago">PIX Pago</option>
                          <option value="atendido">Atendido</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-950 border border-amber-500/40 px-3.5 py-2.5 text-xs font-semibold text-amber-300 hover:bg-red-900 transition-colors shadow-sm"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Exportar CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Leads Table */}
                  {isLoadingLeads ? (
                    <div className="text-center py-12 text-rose-300/60 text-xs">
                      Carregando lista de atendimentos...
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border border-dashed border-red-950 bg-[#120305]">
                      <Users className="mx-auto h-8 w-8 text-rose-400/40 mb-2" />
                      <p className="text-sm font-semibold text-rose-200">
                        Nenhum atendimento registrado ainda
                      </p>
                      <p className="text-xs text-rose-300/60 mt-1">
                        Assim que um visitante responder ao quiz e preencher o formulário, ele aparecerá aqui com as respostas completas.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-red-950 bg-[#100204]">
                      <table className="w-full text-left text-xs text-rose-100">
                        <thead className="bg-[#170408] text-[11px] uppercase tracking-wider text-rose-300/70 border-b border-red-950">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Data/Hora</th>
                            <th className="px-4 py-3 font-semibold">Cliente (Lead)</th>
                            <th className="px-4 py-3 font-semibold">WhatsApp</th>
                            <th className="px-4 py-3 font-semibold">Pessoa Amada</th>
                            <th className="px-4 py-3 font-semibold">Respostas</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold text-right">Ações & Venda</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-950/60">
                          {leads
                            .filter((l) => {
                              const q = searchQuery.toLowerCase();
                              const matchesSearch =
                                !q ||
                                l.nome.toLowerCase().includes(q) ||
                                l.whatsapp.includes(q) ||
                                (l.nomeParceiro || '').toLowerCase().includes(q);
                              const matchesStatus =
                                statusFilter === 'all' || l.status === statusFilter;
                              return matchesSearch && matchesStatus;
                            })
                            .map((lead) => {
                              const cleanPhone = lead.whatsapp.replace(/\D/g, '');
                              const answersCount = Object.keys(lead.respostasQuiz || {}).length;
                              const waUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                                `Olá ${lead.nome}! Sou a Mãe Bety. Recebi o seu diagnóstico sobre afastamento amoroso referente a ${
                                  lead.nomeParceiro || 'a pessoa amada'
                                }. Vi aqui suas respostas e estou à sua disposição para o seu acolhimento sagrado.`
                              )}`;

                              return (
                                <tr key={lead.id} className="hover:bg-red-950/20 transition-colors">
                                  <td className="px-4 py-3.5 font-mono text-[11px] text-rose-300/60 whitespace-nowrap">
                                    {lead.criadoEm
                                      ? new Date(lead.criadoEm).toLocaleString('pt-BR')
                                      : 'Recente'}
                                  </td>

                                  <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                                    {lead.nome}
                                  </td>

                                  <td className="px-4 py-3.5 font-mono text-amber-200 whitespace-nowrap">
                                    {lead.whatsapp}
                                  </td>

                                  <td className="px-4 py-3.5 text-rose-200/90 whitespace-nowrap">
                                    {lead.nomeParceiro || 'Não informado'}
                                  </td>

                                  <td className="px-4 py-3.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedLead(lead)}
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-950 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30 hover:bg-red-900 transition-colors"
                                    >
                                      <FileText className="h-3.5 w-3.5 text-amber-400" />
                                      <span>Ver {answersCount} Respostas</span>
                                    </button>
                                  </td>

                                  <td className="px-4 py-3.5">
                                    <select
                                      value={lead.status || 'aguardando_pix'}
                                      onChange={(e) =>
                                        handleUpdateLeadStatus(lead.id!, e.target.value)
                                      }
                                      className={`rounded-lg border px-2 py-1 text-[11px] font-semibold focus:outline-none ${
                                        lead.status === 'atendido'
                                          ? 'bg-blue-950 text-blue-200 border-blue-800'
                                          : lead.status === 'comprovante_enviado' || lead.status === 'pago'
                                          ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                                          : 'bg-red-950 text-amber-300 border-red-900'
                                      }`}
                                    >
                                      <option value="aguardando_pix">Aguardando PIX</option>
                                      <option value="comprovante_enviado">Comprovante Enviado</option>
                                      <option value="pago">PIX Pago</option>
                                      <option value="atendido">Atendido / Concluído</option>
                                    </select>
                                  </td>

                                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* Quick Sale button */}
                                      <button
                                        type="button"
                                        onClick={() => handleOpenSaleModalForLead(lead)}
                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-950 border border-emerald-600/60 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900 transition-colors shadow-sm"
                                        title="Registrar venda de consulta ou trabalho para este lead"
                                      >
                                        <Receipt className="h-3 w-3 text-emerald-400" />
                                        <span>+ Venda</span>
                                      </button>

                                      <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors"
                                        title="Chamar no WhatsApp"
                                      >
                                        <MessageCircle className="h-3 w-3" />
                                        <span>WhatsApp</span>
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteLead(lead.id!)}
                                        className="p-1.5 text-rose-400/40 hover:text-red-400 transition-colors"
                                        title="Excluir este lead"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VENDAS & TRABALHOS ESPIRITUAIS */}
              {activeTab === 'sales' && (
                <div className="space-y-6">
                  {/* Rule Banner */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#18040a] to-purple-950/70 border border-emerald-600/40">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-amber-300" />
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Regra de Identificação de Vendas Automática:
                        </h4>
                      </div>
                      <p className="text-xs text-rose-200/80">
                        • Valor <strong>até R$ 50,00</strong> é identificado como <strong className="text-emerald-400">Consulta</strong>.<br />
                        • Valor <strong>acima de R$ 50,00</strong> é identificado como <strong className="text-purple-300">Trabalho Espiritual</strong> (Adoçamento, Amarração, Desmanche).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNewSaleForm({
                          leadId: '',
                          clienteNome: '',
                          clienteWhatsapp: '',
                          nomeParceiro: '',
                          valor: '9,90',
                          tipoTrabalho: 'Consulta Oracular com Mãe Bety',
                          metodoPagamento: 'PIX',
                          observacoes: '',
                          dataVenda: new Date().toISOString().slice(0, 10),
                          trackPixel: true,
                        });
                        setSaleSuccessMsg('');
                        setIsNewSaleModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all shrink-0"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Registrar Nova Venda</span>
                    </button>
                  </div>

                  {/* Financial KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-[#140306] border border-amber-500/30 shadow-lg">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-amber-400">
                        <span>Faturamento Total</span>
                        <DollarSign className="h-4 w-4 text-amber-400" />
                      </div>
                      <p className="mt-1 font-serif-sacred text-2xl sm:text-3xl font-extrabold text-amber-300">
                        R$ {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-rose-300/60 mt-1">
                        {sales.length} transações confirmadas
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#140306] border border-emerald-800/60 shadow-lg">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-emerald-400">
                        <span>Consultas (≤ R$ 50)</span>
                        <Receipt className="h-4 w-4 text-emerald-400" />
                      </div>
                      <p className="mt-1 font-serif-sacred text-2xl font-bold text-emerald-300">
                        R$ {totalConsultasValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-emerald-200/70 mt-1">
                        {consultasSales.length} consultas vendidas
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#140306] border border-purple-800/60 shadow-lg">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-purple-300">
                        <span>Trabalhos (&gt; R$ 50)</span>
                        <Sparkles className="h-4 w-4 text-purple-300" />
                      </div>
                      <p className="mt-1 font-serif-sacred text-2xl font-bold text-purple-200">
                        R$ {totalTrabalhosValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-purple-300/70 mt-1">
                        {trabalhosSales.length} trabalhos espirituais
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#140306] border border-red-950 shadow-lg">
                      <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-rose-300/80">
                        <span>Ticket Médio</span>
                        <TrendingUp className="h-4 w-4 text-rose-300" />
                      </div>
                      <p className="mt-1 font-serif-sacred text-2xl font-bold text-white">
                        R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-rose-300/60 mt-1">
                        Média geral por cliente
                      </p>
                    </div>
                  </div>

                  {/* Filter and Search Bar for Sales */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-rose-400/50" />
                      <input
                        type="text"
                        value={saleSearchQuery}
                        onChange={(e) => setSaleSearchQuery(e.target.value)}
                        placeholder="Buscar por cliente, parceiro, serviço..."
                        className="w-full rounded-xl border border-red-900/60 bg-[#120305] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-rose-400/40 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#130305] border border-red-950">
                      <button
                        type="button"
                        onClick={() => setSaleCategoryFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          saleCategoryFilter === 'all'
                            ? 'bg-red-950 text-white border border-red-800'
                            : 'text-rose-300/60 hover:text-white'
                        }`}
                      >
                        Todas ({sales.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaleCategoryFilter('Consulta')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          saleCategoryFilter === 'Consulta'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'text-rose-300/60 hover:text-emerald-300'
                        }`}
                      >
                        Consultas (≤ R$ 50) ({consultasSales.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaleCategoryFilter('Trabalho Espiritual')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          saleCategoryFilter === 'Trabalho Espiritual'
                            ? 'bg-purple-950 text-purple-300 border border-purple-700'
                            : 'text-rose-300/60 hover:text-purple-300'
                        }`}
                      >
                        Trabalhos (&gt; R$ 50) ({trabalhosSales.length})
                      </button>
                    </div>
                  </div>

                  {/* Sales Table */}
                  {isLoadingSales ? (
                    <div className="text-center py-12 text-rose-300/60 text-xs">
                      Carregando registro financeiro...
                    </div>
                  ) : filteredSales.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border border-dashed border-red-950 bg-[#120305]">
                      <Receipt className="mx-auto h-8 w-8 text-rose-400/40 mb-2" />
                      <p className="text-sm font-semibold text-rose-200">
                        Nenhuma venda registrada nesta categoria
                      </p>
                      <p className="text-xs text-rose-300/60 mt-1">
                        Clique em &quot;Registrar Nova Venda&quot; para lançar uma consulta de R$ 9,90 ou trabalho espiritual.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-red-950 bg-[#100204]">
                      <table className="w-full text-left text-xs text-rose-100">
                        <thead className="bg-[#170408] text-[11px] uppercase tracking-wider text-rose-300/70 border-b border-red-950">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Data</th>
                            <th className="px-4 py-3 font-semibold">Cliente</th>
                            <th className="px-4 py-3 font-semibold">WhatsApp</th>
                            <th className="px-4 py-3 font-semibold">Categoria Identificada</th>
                            <th className="px-4 py-3 font-semibold">Serviço / Finalidade</th>
                            <th className="px-4 py-3 font-semibold">Método</th>
                            <th className="px-4 py-3 font-semibold text-right">Valor (R$)</th>
                            <th className="px-4 py-3 font-semibold text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-950/60">
                          {filteredSales.map((sale) => {
                            const isConsulta = sale.valor <= 50;
                            const cleanPhone = sale.clienteWhatsapp.replace(/\D/g, '');

                            return (
                              <tr key={sale.id} className="hover:bg-red-950/20 transition-colors">
                                <td className="px-4 py-3.5 font-mono text-[11px] text-rose-300/60 whitespace-nowrap">
                                  {sale.dataVenda
                                    ? new Date(sale.dataVenda).toLocaleDateString('pt-BR')
                                    : 'Hoje'}
                                </td>

                                <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                                  {sale.clienteNome}
                                  {sale.nomeParceiro && (
                                    <span className="block text-[10px] font-normal text-rose-300/60">
                                      Ref: {sale.nomeParceiro}
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-3.5 font-mono text-amber-200 whitespace-nowrap">
                                  {sale.clienteWhatsapp || '-'}
                                </td>

                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  {isConsulta ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-2.5 py-1 text-[10px] font-extrabold uppercase text-emerald-300 border border-emerald-700">
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                      Consulta (≤ R$ 50)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-950 px-2.5 py-1 text-[10px] font-extrabold uppercase text-purple-300 border border-purple-700">
                                      <Sparkles className="h-3 w-3 text-purple-400" />
                                      Trabalho Espiritual (&gt; R$ 50)
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-3.5 text-rose-100">
                                  <span className="font-medium">{sale.tipoTrabalho || 'Atendimento'}</span>
                                  {sale.observacoes && (
                                    <span className="block text-[11px] text-rose-300/60 line-clamp-1">
                                      {sale.observacoes}
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <span className="inline-block rounded px-2 py-0.5 text-[10px] font-mono bg-red-950 text-rose-300 border border-red-900/60">
                                    {sale.metodoPagamento || 'PIX'}
                                  </span>
                                </td>

                                <td className="px-4 py-3.5 text-right whitespace-nowrap font-serif-sacred font-bold text-base text-amber-300">
                                  R$ {sale.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>

                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {cleanPhone && (
                                      <a
                                        href={`https://wa.me/55${cleanPhone}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                                        title="Abrir WhatsApp do cliente"
                                      >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                      </a>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSale(sale.id)}
                                      className="p-1.5 text-rose-400/40 hover:text-red-400 transition-colors"
                                      title="Excluir venda"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SETTINGS TAB */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                  <div>
                    <h4 className="font-serif-sacred text-base sm:text-lg font-bold text-white mb-1">
                      Foto & Configurações da Mãe de Santo
                    </h4>
                    <p className="text-xs text-rose-200/70">
                      Aqui você pode alterar a foto oficial da Mãe de Santo, a chave PIX, o nome e o valor da consulta. Todas as alterações refletem no site instantaneamente.
                    </p>
                  </div>

                  {/* Photo Preview & Edit */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[#120305] border border-red-950">
                    <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl shrink-0">
                      <img
                        src={settingsForm.maeFoto || SACRED_IMAGES.maePortrait}
                        alt="Foto da Mãe de Santo"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SACRED_IMAGES.maePortrait;
                        }}
                      />
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                          Caminho ou URL da Imagem da Mãe de Santo
                        </label>
                        <input
                          type="text"
                          value={settingsForm.maeFoto}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, maeFoto: e.target.value })
                          }
                          placeholder="Ex: /src/assets/images/... ou URL da web"
                          className="w-full rounded-xl border border-red-900/60 bg-[#160407] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-red-950 px-3 py-2 text-xs text-amber-300 border border-amber-500/30 hover:bg-red-900 transition-colors">
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>Fazer Upload de Nova Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSettingsForm({
                                    ...settingsForm,
                                    maeFoto: reader.result as string,
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            setSettingsForm({
                              ...settingsForm,
                              maeFoto: SACRED_IMAGES.maePortrait,
                            })
                          }
                          className="text-xs text-rose-300/70 hover:text-white underline"
                        >
                          Restaurar Foto Oficial Original
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                        Nome da Mãe de Santo
                      </label>
                      <input
                        type="text"
                        value={settingsForm.maeNome}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, maeNome: e.target.value })
                        }
                        className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                        Título Espiritual
                      </label>
                      <input
                        type="text"
                        value={settingsForm.maeTitulo}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, maeTitulo: e.target.value })
                        }
                        className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                      Biografia / Descrição de Acolhimento
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.maeDescricao}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, maeDescricao: e.target.value })
                      }
                      className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* PIX Key & Beneficiary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                        Chave PIX Oficial
                      </label>
                      <input
                        type="text"
                        value={settingsForm.pixKey}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, pixKey: e.target.value })
                        }
                        className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs font-mono text-amber-200 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                        Nome do Beneficiário PIX
                      </label>
                      <input
                        type="text"
                        value={settingsForm.pixBeneficiario}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, pixBeneficiario: e.target.value })
                        }
                        className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Price & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                        Valor da Consulta (R$)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.valorConsulta}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, valorConsulta: e.target.value })
                        }
                        className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs font-mono text-amber-200 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                        WhatsApp de Atendimento (com DDI 55)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumero}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, whatsappNumero: e.target.value })
                        }
                        className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* VSL Video Link or Custom Video */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                      URL do Vídeo VSL (Opcional - link MP4, CDN, YouTube, Vimeo, Panda Video)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.vslVideoUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, vslVideoUrl: e.target.value })
                      }
                      placeholder="Deixe em branco para usar o player interativo da Mãe Bety ou cole o link do seu vídeo"
                      className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                    <p className="text-[11px] text-rose-300/60 mt-1">
                      Se você hospedar o vídeo no PandaVideo, VTurb, YouTube ou CDN próprio, basta colar a URL direta aqui.
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 p-3.5 rounded-xl">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>Configurações salvas e aplicadas a todo o site com sucesso!</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-950 hover:brightness-110 transition-all shadow-xl"
                    >
                      <Save className="h-4 w-4" />
                      <span>Salvar Todas as Configurações</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODAL: REGISTRAR NOVA VENDA (MANUAL) */}
      {isNewSaleModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-emerald-700/60 bg-gradient-to-b from-[#18040a] via-[#120205] to-[#0a0103] p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-red-950">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-serif-sacred text-base font-bold text-white">
                    Registrar Venda Manual
                  </h4>
                  <p className="text-[11px] text-rose-300/70">
                    Lançamento de Consulta ou Trabalho Espiritual
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewSaleModalOpen(false)}
                className="rounded-full p-1.5 text-rose-400/50 hover:text-white hover:bg-red-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="mt-4 space-y-4">
              {/* Dynamic Category Card Based on Value */}
              <div className="p-3.5 rounded-2xl border transition-all duration-300"
                style={{
                  backgroundColor: dynamicFormCategory === 'Consulta' ? 'rgba(6, 78, 59, 0.35)' : 'rgba(88, 28, 135, 0.35)',
                  borderColor: dynamicFormCategory === 'Consulta' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(192, 132, 252, 0.5)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200">
                    Categoria Identificada:
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                      dynamicFormCategory === 'Consulta'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        : 'bg-purple-950 text-purple-200 border border-purple-500'
                    }`}
                  >
                    {dynamicFormCategory === 'Consulta' ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        CONSULTA (Até R$ 50,00)
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 text-purple-300" />
                        TRABALHO ESPIRITUAL (Mais de R$ 50,00)
                      </>
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-rose-200/70 mt-1.5">
                  {dynamicFormCategory === 'Consulta'
                    ? 'Valores até R$ 50,00 são contabilizados como consultas oraculares de abertura.'
                    : 'Valores superiores a R$ 50,00 são contabilizados como trabalhos espirituais (adoçamentos, firmezas, amarrações).'}
                </p>
              </div>

              {/* Value Input and Quick Value Presets */}
              <div>
                <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                  Valor da Venda (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-amber-400">R$</span>
                  <input
                    type="text"
                    value={newSaleForm.valor}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, valor: e.target.value })}
                    placeholder="9,90 ou 350,00"
                    className="w-full rounded-xl border border-red-900/60 bg-[#100204] pl-10 pr-4 py-2.5 text-base font-bold font-mono text-amber-300 focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Quick preset buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-rose-300/60 mr-1">Atalhos:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewSaleForm({
                        ...newSaleForm,
                        valor: '9,90',
                        tipoTrabalho: 'Consulta Oracular (R$ 9,90)',
                      })
                    }
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                  >
                    R$ 9,90 (Consulta)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewSaleForm({
                        ...newSaleForm,
                        valor: '49,90',
                        tipoTrabalho: 'Consulta Completa com Baralho',
                      })
                    }
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                  >
                    R$ 49,90 (Consulta)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewSaleForm({
                        ...newSaleForm,
                        valor: '150,00',
                        tipoTrabalho: 'Adoçamento Amoroso',
                      })
                    }
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900"
                  >
                    R$ 150 (Trabalho)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewSaleForm({
                        ...newSaleForm,
                        valor: '350,00',
                        tipoTrabalho: 'Amarração Amorosa de 7 Linhas',
                      })
                    }
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900"
                  >
                    R$ 350 (Trabalho)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewSaleForm({
                        ...newSaleForm,
                        valor: '600,00',
                        tipoTrabalho: 'Afastamento de Rival & Blindagem',
                      })
                    }
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900"
                  >
                    R$ 600 (Trabalho)
                  </button>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    value={newSaleForm.clienteNome}
                    onChange={(e) =>
                      setNewSaleForm({ ...newSaleForm, clienteNome: e.target.value })
                    }
                    placeholder="Nome completo..."
                    className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                    WhatsApp do Cliente
                  </label>
                  <input
                    type="text"
                    value={newSaleForm.clienteWhatsapp}
                    onChange={(e) =>
                      setNewSaleForm({ ...newSaleForm, clienteWhatsapp: e.target.value })
                    }
                    placeholder="(XX) 9XXXX-XXXX"
                    className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-3.5 py-2 text-xs text-amber-200 focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Partner and Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                    Nome da Pessoa Amada
                  </label>
                  <input
                    type="text"
                    value={newSaleForm.nomeParceiro}
                    onChange={(e) =>
                      setNewSaleForm({ ...newSaleForm, nomeParceiro: e.target.value })
                    }
                    placeholder="Nome do parceiro(a)..."
                    className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                    Tipo de Trabalho / Serviço
                  </label>
                  <input
                    type="text"
                    value={newSaleForm.tipoTrabalho}
                    onChange={(e) =>
                      setNewSaleForm({ ...newSaleForm, tipoTrabalho: e.target.value })
                    }
                    placeholder="Ex: Adoçamento, Amarração, Consulta"
                    className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                    Método de Pagamento
                  </label>
                  <select
                    value={newSaleForm.metodoPagamento}
                    onChange={(e) =>
                      setNewSaleForm({ ...newSaleForm, metodoPagamento: e.target.value })
                    }
                    className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="PIX">PIX (Chave 35911302296)</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Transferência Bancária">Transferência Bancária</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                    Data da Venda
                  </label>
                  <input
                    type="date"
                    value={newSaleForm.dataVenda}
                    onChange={(e) =>
                      setNewSaleForm({ ...newSaleForm, dataVenda: e.target.value })
                    }
                    className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-xs font-semibold uppercase text-rose-200 mb-1">
                  Observações Espirituais / Detalhes
                </label>
                <textarea
                  rows={2}
                  value={newSaleForm.observacoes}
                  onChange={(e) =>
                    setNewSaleForm({ ...newSaleForm, observacoes: e.target.value })
                  }
                  placeholder="Ex: Comprovante conferido, firmeza de 7 velas acesa no terreiro..."
                  className="w-full rounded-xl border border-red-900/60 bg-[#100204] px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Meta Pixel Purchase Checkbox */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-black/60 border border-emerald-900/60">
                <input
                  type="checkbox"
                  id="trackPixelCheckbox"
                  checked={newSaleForm.trackPixel}
                  onChange={(e) =>
                    setNewSaleForm({ ...newSaleForm, trackPixel: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-red-900 bg-red-950 text-emerald-500 focus:ring-emerald-400"
                />
                <label htmlFor="trackPixelCheckbox" className="text-xs text-rose-200 cursor-pointer">
                  Disparar evento <strong className="text-emerald-400">Purchase (Compra)</strong> no Meta Pixel ({PIXEL_ID})
                </label>
              </div>

              {saleSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-600 text-xs text-emerald-200 font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>{saleSuccessMsg}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSaleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-red-900 text-xs font-bold text-rose-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSale}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  <span>{isSubmittingSale ? 'Gravando...' : 'Gravar Venda no Sistema'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD DETAILS INSPECTION MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-red-800/80 bg-[#120305] shadow-2xl overflow-hidden text-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-red-950 bg-[#190408]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Ficha Completa de Diagnóstico Espiritual
                </span>
                <h3 className="font-serif-sacred text-lg font-bold text-white">
                  {selectedLead.nome}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-full p-1.5 text-rose-400/50 hover:text-white hover:bg-red-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-red-950/30 border border-red-900/50">
                <div className="space-y-0.5">
                  <p className="text-xs font-mono text-amber-200 font-bold">
                    WhatsApp: {selectedLead.whatsapp}
                  </p>
                  <p className="text-[11px] text-rose-200/80">
                    Pessoa Amada: <strong>{selectedLead.nomeParceiro || 'Não informada'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenSaleModalForLead(selectedLead);
                      setSelectedLead(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shadow-md"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    <span>+ Registrar Venda</span>
                  </button>

                  <a
                    href={`https://wa.me/55${selectedLead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá ${selectedLead.nome}! Sou a Mãe Bety. Recebi seu formulário da consulta espiritual sobre afastamento/traição referente a ${
                        selectedLead.nomeParceiro || 'seu relacionamento'
                      }. Vi suas respostas e estou pronta para o seu acolhimento.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Chamar no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Diagnosis Summary Cards */}
              {selectedLead.diagnostico && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-200 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Resultado do Diagnóstico Oracular</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60">
                      <span className="text-[10px] text-rose-300/70 uppercase font-bold block">
                        Risco de Ruptura
                      </span>
                      <span className="font-serif-sacred text-base font-bold text-red-400">
                        {selectedLead.diagnostico.nivelRisco} (Score: {selectedLead.diagnostico.score})
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 sm:col-span-2">
                      <span className="text-[10px] text-rose-300/70 uppercase font-bold block">
                        Interferência Externa
                      </span>
                      <p className="text-rose-100/90 text-[11px] mt-0.5 leading-relaxed">
                        {selectedLead.diagnostico.interferenciaExterna}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Answers to the Quiz */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-200 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-amber-400" />
                  <span>Respostas Escolhidas nas Perguntas do Quiz</span>
                </h4>

                <div className="space-y-3">
                  {QUIZ_QUESTIONS.map((question) => {
                    const answeredOptionId = selectedLead.respostasQuiz?.[question.id];
                    const selectedOption = question.options.find(
                      (o) => o.id === answeredOptionId
                    );

                    return (
                      <div
                        key={question.id}
                        className="rounded-xl border border-red-950 bg-[#160408] p-3.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-bold text-white text-xs">
                            <span className="text-amber-400 mr-1.5">#{question.id}</span>
                            {question.title}
                          </p>
                          {selectedOption && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 border border-red-800 text-rose-300 shrink-0">
                              {selectedOption.category}
                            </span>
                          )}
                        </div>

                        {selectedOption ? (
                          <div className="rounded-lg bg-red-950/40 border border-amber-500/30 p-3 mt-1.5">
                            <p className="font-bold text-amber-200">
                              ✓ {selectedOption.label}
                            </p>
                            {selectedOption.description && (
                              <p className="mt-1 text-rose-200/70 text-[11px] leading-relaxed">
                                {selectedOption.description}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-rose-400/50 italic mt-1">
                            Opção não registrada para esta pergunta.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-red-950 bg-[#120305] flex items-center justify-between">
              <span className="text-xs text-rose-300/60 font-mono">
                ID: {selectedLead.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-xl bg-red-950 border border-red-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-100 hover:bg-red-900 transition-colors"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
