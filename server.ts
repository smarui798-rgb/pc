import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '100mb' }));

// Database directory & files
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const SALES_FILE = path.join(DATA_DIR, 'sales.json');

// Ensure data folder, uploads folder and initial files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOADS_DIR));

const defaultSettings = {
  maeNome: 'Mãe Bety Oficial',
  maeTitulo: 'Sacerdotisa de Relacionamentos & Aconselhamento Espiritual',
  maeFoto: '/src/assets/images/mae_de_santo_original.jpg',
  maeDescricao: 'Mais de 27 anos de missão espiritual, auxiliando na restauração de lares, afastamento de más energias e harmonização amorosa.',
  pixKey: '35911302296',
  pixBeneficiario: 'Marillia dailsa da silva',
  pixCidade: 'SAO PAULO',
  valorConsulta: '9,90',
  whatsappNumero: '35991302296',
};

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading settings:', err);
  }
  return defaultSettings;
}

function saveSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

function getLeads(): any[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading leads:', err);
  }
  return [];
}

function saveLeads(leads: any[]) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

function getSales(): any[] {
  try {
    if (fs.existsSync(SALES_FILE)) {
      const data = fs.readFileSync(SALES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading sales:', err);
  }
  return [];
}

function saveSales(sales: any[]) {
  fs.writeFileSync(SALES_FILE, JSON.stringify(sales, null, 2), 'utf-8');
}

// API Routes
app.get('/api/settings', (req, res) => {
  res.json(getSettings());
});

app.post('/api/settings', (req, res) => {
  const current = getSettings();
  const updated = { ...current, ...req.body };
  saveSettings(updated);
  res.json({ success: true, settings: updated });
});

// Video upload endpoint (supports MP4 / WebM base64)
app.post('/api/upload-video', (req, res) => {
  try {
    const { videoData, filename } = req.body;
    if (!videoData) {
      return res.status(400).json({ error: 'Nenhum dado de vídeo recebido.' });
    }

    const matches = videoData.match(/^data:(video\/[a-zA-Z0-9]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = '.mp4';

    if (matches && matches[2]) {
      buffer = Buffer.from(matches[2], 'base64');
      if (matches[1].includes('webm')) ext = '.webm';
    } else {
      buffer = Buffer.from(videoData, 'base64');
    }

    const safeFilename = `vsl_maebety_${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const videoUrl = `/uploads/${safeFilename}`;

    const settings = getSettings();
    settings.vslVideoUrl = videoUrl;
    saveSettings(settings);

    res.json({ success: true, vslVideoUrl: videoUrl });
  } catch (err: any) {
    console.error('Error saving video:', err);
    res.status(500).json({ error: 'Erro ao processar arquivo de vídeo: ' + err.message });
  }
});

app.get('/api/leads', (req, res) => {
  const leads = getLeads();
  res.json({ success: true, leads });
});

app.post('/api/leads', (req, res) => {
  const { nome, whatsapp, nomeParceiro, tempoMudanca, respostasQuiz, diagnostico } = req.body;

  if (!nome || !whatsapp) {
    return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios.' });
  }

  const leads = getLeads();
  const newLead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    nome,
    whatsapp,
    nomeParceiro: nomeParceiro || 'Não informado',
    tempoMudanca: tempoMudanca || '',
    respostasQuiz: respostasQuiz || {},
    diagnostico: diagnostico || {},
    status: 'aguardando_pix',
    criadoEm: new Date().toISOString(),
    pixCopiado: false,
    pagoEm: null,
  };

  leads.unshift(newLead);
  saveLeads(leads);

  res.status(201).json({ success: true, lead: newLead });
});

app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead não encontrado.' });
  }

  leads[index] = { ...leads[index], ...updates };
  saveLeads(leads);

  res.json({ success: true, lead: leads[index] });
});

app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  saveLeads(filtered);
  res.json({ success: true, message: 'Lead excluído com sucesso.' });
});

app.delete('/api/leads', (req, res) => {
  saveLeads([]);
  res.json({ success: true, message: 'Todos os leads foram excluídos.' });
});

// Sales Management API (Manual sale registration for Consultas and Trabalhos Espirituais)
app.get('/api/sales', (req, res) => {
  const sales = getSales();
  res.json({ success: true, sales });
});

app.post('/api/sales', (req, res) => {
  const {
    clienteNome,
    clienteWhatsapp,
    nomeParceiro,
    valor,
    tipoTrabalho,
    metodoPagamento,
    observacoes,
    leadId,
    dataVenda,
  } = req.body;

  if (!clienteNome) {
    return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
  }

  const rawVal = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : Number(valor);
  const numVal = isNaN(rawVal) ? 9.90 : Math.round(rawVal * 100) / 100;

  // Rule: até 50 reais é 'Consulta', mais de 50 reais é 'Trabalho Espiritual'
  const categoria = numVal <= 50 ? 'Consulta' : 'Trabalho Espiritual';

  const newSale = {
    id: 'sale-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    leadId: leadId || undefined,
    clienteNome: clienteNome.trim(),
    clienteWhatsapp: (clienteWhatsapp || '').trim(),
    nomeParceiro: (nomeParceiro || '').trim(),
    valor: numVal,
    categoria,
    tipoTrabalho:
      tipoTrabalho?.trim() ||
      (categoria === 'Consulta' ? 'Consulta Oracular' : 'Trabalho Espiritual de Reconciliação'),
    dataVenda: dataVenda || new Date().toISOString(),
    metodoPagamento: metodoPagamento || 'PIX',
    observacoes: (observacoes || '').trim(),
    status: 'confirmado',
  };

  const sales = getSales();
  sales.unshift(newSale);
  saveSales(sales);

  // If a lead was associated, update its status to 'pago'
  if (leadId) {
    const leads = getLeads();
    const leadIndex = leads.findIndex((l) => l.id === leadId);
    if (leadIndex !== -1) {
      leads[leadIndex].status = 'pago';
      saveLeads(leads);
    }
  }

  res.status(201).json({ success: true, sale: newSale });
});

app.delete('/api/sales/:id', (req, res) => {
  const { id } = req.params;
  const sales = getSales();
  const filtered = sales.filter((s) => s.id !== id);
  saveSales(filtered);
  res.json({ success: true, message: 'Venda excluída com sucesso.' });
});

// Start server with Vite middleware in dev
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
