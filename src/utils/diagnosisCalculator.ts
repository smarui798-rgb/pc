import { DiagnosisResult } from '../types';

export function calculateDiagnosis(
  answers: Record<number, string>,
  nomeLead: string,
  nomeParceiro?: string
): DiagnosisResult {
  const parceiro = nomeParceiro?.trim() ? nomeParceiro.trim() : 'a pessoa amada';
  const primeiroNome = nomeLead.trim().split(' ')[0] || 'Irmão(ã)';

  // Calculate scores based on answer IDs
  let totalScore = 0;
  let hasCellSecret = false;
  let hasThirdParty = false;
  let hasPhysicalSigns = false;
  let hasSuddenChange = false;

  Object.values(answers).forEach((ansId) => {
    if (ansId.includes('b') || ansId.includes('d')) totalScore += 4;
    else totalScore += 3;

    if (ansId === '1b' || ansId === '2a' || ansId === '3d') hasThirdParty = true;
    if (ansId === '1b') hasCellSecret = true;
    if (ansId === '3a') hasSuddenChange = true;
    if (ansId === '1c' || ansId === '2b') hasPhysicalSigns = true;
  });

  const nivelRisco: 'Alto' | 'Crítico' | 'Urgente' =
    totalScore >= 11 ? 'Urgente' : totalScore >= 9 ? 'Crítico' : 'Alto';

  const percentualInterferencia = hasThirdParty ? 92 : 84;
  const percentualBloqueio = hasSuddenChange ? 96 : 88;

  const bloqueioEmocional = `${percentualBloqueio}% de Fechamento de Afeto. Constatamos que os sentimentos genuínos que ${parceiro} nutre por você estão sob um espesso "véu de frieza". Não se trata de desamor natural, mas sim de uma resistência induzida onde o diálogo sincero é repelido.`;

  const interferenciaExterna = hasThirdParty
    ? `Alerta Vermelho: Fortes indícios de direcionamento por terceira pessoa ou inveja dirigida. A mente de ${parceiro} está sendo alimentada por energias externas que buscam cortar a ligação e plantar rejeição contra você.`
    : `Interferência Energética de Terceiros Detectada (${percentualInterferencia}%). Há olhares pesados, fofocas ou energias de desarmonia que desestabilizam o campo áurico de vocês dois, provocando brigas sem causa real.`;

  const interferenciaEspiritual = hasPhysicalSigns
    ? `Sintomas Espirituais Ativos: Os apertos no peito, insônia nas madrugadas e o clima pesado na casa indicam que o campo espiritual está sob ataque ou demanda negativa. Quando o espiritual adoece, o relacionamento racha no plano físico.`
    : `Caminhos Travados: O laço amoroso está com nós energéticos que impedem a reaproximação. Sem um descarrego e alinhamento espiritual, cada tentativa de conversa gera mais desgaste.`;

  const resumoCaso = `${primeiroNome}, sua intuição não está enganada. Os dados revelam que o afastamento e as atitudes de ${parceiro} não são coincidência. Há forças e influências trabalhando nos bastidores da mente dele(a) para consolidar a separação definitiva se uma intervenção com firmeza não for realizada nas próximas horas.`;

  const orientacaoMae = `Na consulta individual de R$ 9,90, a Mãe Bety abrirá o oráculo sagrado para confirmar o nome de quem está interferindo, verificar se há trabalhos ou amarrações espirituais ativas contra vocês, e entregar a orientação exata para restaurar a paz e o respeito.`;

  return {
    score: totalScore,
    nivelRisco,
    bloqueioEmocional,
    interferenciaExterna,
    interferenciaEspiritual,
    resumoCaso,
    orientacaoMae,
  };
}
