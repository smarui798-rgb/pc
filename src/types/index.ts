export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  weight: number; // spiritual/emotional risk level
  category: 'betrayal' | 'estrangement' | 'spiritual_interference' | 'urgency';
}

export interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  options: QuizOption[];
}

export interface LeadData {
  id?: string;
  nome: string;
  whatsapp: string;
  nomeParceiro?: string;
  tempoMudanca?: string;
  respostasQuiz: Record<number, string>;
  diagnostico?: DiagnosisResult;
  status?: 'aguardando_pix' | 'comprovante_enviado' | 'pago' | 'atendido';
  criadoEm?: string;
  pixCopiado?: boolean;
}

export interface DiagnosisResult {
  score: number;
  nivelRisco: 'Alto' | 'Crítico' | 'Urgente';
  bloqueioEmocional: string;
  interferenciaExterna: string;
  interferenciaEspiritual: string;
  resumoCaso: string;
  orientacaoMae: string;
}

export interface SiteSettings {
  maeNome: string;
  maeTitulo: string;
  maeFoto: string;
  maeDescricao: string;
  pixKey: string;
  pixBeneficiario: string;
  pixCidade: string;
  valorConsulta: string;
  whatsappNumero: string;
  vslVideoUrl?: string;
}

export interface Testimonial {
  id: string;
  nome: string;
  idade: number;
  cidade: string;
  caso: string;
  depoimento: string;
  tempoResolucao: string;
  foto: string;
  temAudio?: boolean;
  audioDuracao?: string;
  data: string;
  verificado: boolean;
}

export type SaleCategory = 'Consulta' | 'Trabalho Espiritual';

export interface Sale {
  id: string;
  leadId?: string;
  clienteNome: string;
  clienteWhatsapp: string;
  nomeParceiro?: string;
  valor: number;
  categoria: SaleCategory; // If <= 50 -> 'Consulta', if > 50 -> 'Trabalho Espiritual'
  tipoTrabalho?: string;
  dataVenda: string;
  metodoPagamento?: 'PIX' | 'Cartão' | 'Dinheiro' | 'Transferência';
  observacoes?: string;
  status: 'confirmado' | 'pendente';
}
