import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'O que mais está machucando você no comportamento dele(a) agora?',
    subtitle: 'Selecione o sinal que mais descreve o que você está vivendo:',
    options: [
      {
        id: '1a',
        label: 'Frieza repentina e corte de afeto',
        description: 'Parou de demonstrar carinho, abraçar ou beijar; parece uma pessoa totalmente estranha.',
        weight: 3,
        category: 'estrangement',
      },
      {
        id: '1b',
        label: 'Comportamento suspeito e segredos no celular',
        description: 'Vira a tela para baixo, trocou senhas, recebe notificações misteriosas ou se esconde.',
        weight: 4,
        category: 'betrayal',
      },
      {
        id: '1c',
        label: 'Brigas descontroladas por qualquer motivo bobo',
        description: 'Qualquer palavra vira discussão com raiva desmedida; parece que sua presença irrita.',
        weight: 3,
        category: 'spiritual_interference',
      },
      {
        id: '1d',
        label: 'Afastamento total ou bloqueio repentino',
        description: 'Pediu um tempo, sumiu da sua vida ou bloqueou você sem explicação coerente.',
        weight: 4,
        category: 'urgency',
      },
    ],
  },
  {
    id: 2,
    title: 'Você tem fortes intuições ou evidências de uma terceira pessoa ou inveja?',
    subtitle: 'A intuição do coração raramente falha quando há olhares de discórdia rondando:',
    options: [
      {
        id: '2a',
        label: 'Sim, já sei quem é ou tenho fortes suspeitas de uma rival',
        description: 'Existe alguém rondando (no trabalho, internet ou passado) alimentando intriga.',
        weight: 5,
        category: 'betrayal',
      },
      {
        id: '2b',
        label: 'Sinto no peito que há alguém influenciando, mas ele(a) nega tudo',
        description: 'A intuição grita todo dia. Quando olho nos olhos dele(a), vejo um olhar vazio e distante.',
        weight: 4,
        category: 'spiritual_interference',
      },
      {
        id: '2c',
        label: 'Parentes ou falsas amizades colocando veneno no relacionamento',
        description: 'Pessoas ao redor fazendo fofocas e energias pesadas para destruir o casal.',
        weight: 3,
        category: 'estrangement',
      },
      {
        id: '2d',
        label: 'Não vejo terceira pessoa, mas parece que ele(a) está cego(a) e confuso(a)',
        description: 'Diz que não sabe o que sente, que está sem rumo e não consegue se aproximar de você.',
        weight: 3,
        category: 'spiritual_interference',
      },
    ],
  },
  {
    id: 3,
    title: 'Há quanto tempo essa energia pesada de frieza tomou conta de vocês?',
    subtitle: 'O tempo de atuação da interferência revela a urgência da quebra de demanda:',
    options: [
      {
        id: '3a',
        label: 'Mudou da noite para o dia (menos de 20 dias)',
        description: 'Estávamos bem e carinhosos, e de repente o olhar mudou completamente, como um choque.',
        weight: 4,
        category: 'spiritual_interference',
      },
      {
        id: '3b',
        label: 'Entre 1 e 3 meses de distanciamento contínuo',
        description: 'Foi esfriando aos poucos, desculpas para não sair, cansaço constante e falta de cama.',
        weight: 3,
        category: 'estrangement',
      },
      {
        id: '3c',
        label: 'Mais de 6 meses de idas e vindas dolorosas',
        description: 'Tentamos recomeçar várias vezes, mas parece haver uma força invisível empurrando para trás.',
        weight: 4,
        category: 'urgency',
      },
      {
        id: '3d',
        label: 'Recente: Acabei de descobrir indícios de traição ou mentiras',
        description: 'Descobri mensagens ou peguei mentiras e preciso saber toda a verdade espiritual.',
        weight: 5,
        category: 'betrayal',
      },
    ],
  },
];
