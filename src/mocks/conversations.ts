import type { Conversation } from "@/types/conversation";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    clienteNome: "Juliana Martins",
    clienteId: "cus_001",
    vip: true,
    status: "aberta",
    vendedorNome: "Ana Ribeiro",
    mensagens: [
      { id: "m1", direcao: "enviada", texto: "Oi Juliana! Chegou o vestido midi que você provou 💫", horario: "2026-08-26T14:02:00" },
      { id: "m2", direcao: "recebida", texto: "Ai que ótimo! Tem no meu tamanho?", horario: "2026-08-26T14:10:00" },
      { id: "m3", direcao: "enviada", texto: "Tem sim, no M e no P. Quer que eu separe pra você passar aqui?", horario: "2026-08-26T14:11:00" },
      { id: "m4", direcao: "recebida", texto: "Separa no M, passo aí sábado de manhã!", horario: "2026-08-26T14:15:00" },
    ],
  },
  {
    id: "conv-2",
    clienteNome: "Camila Ferreira",
    clienteId: "cus_005",
    vip: false,
    status: "aberta",
    vendedorNome: "Carla Souza",
    mensagens: [
      { id: "m1", direcao: "enviada", texto: "Oi Camila, tudo bem? Faz um tempinho que você não aparece por aqui 🙂", horario: "2026-08-25T11:00:00" },
      { id: "m2", direcao: "recebida", texto: "Oi! Andei corrida, mas quero passar aí em breve", horario: "2026-08-25T16:40:00" },
    ],
  },
  {
    id: "conv-3",
    clienteNome: "Patrícia Duarte",
    clienteId: "cus_004",
    vip: true,
    status: "resolvida",
    vendedorNome: "Ana Ribeiro",
    mensagens: [
      { id: "m1", direcao: "recebida", texto: "O vestido de festa chegou perfeito, amei!", horario: "2026-08-19T18:00:00" },
      { id: "m2", direcao: "enviada", texto: "Que alegria, Patrícia! Manda uma foto quando usar 💛", horario: "2026-08-19T18:05:00" },
      { id: "m3", direcao: "recebida", texto: "Combinado!", horario: "2026-08-19T18:06:00" },
    ],
  },
  {
    id: "conv-4",
    clienteNome: "Larissa Prado",
    clienteId: "cus_006",
    vip: false,
    status: "resolvida",
    vendedorNome: "Marina Lopes",
    mensagens: [
      { id: "m1", direcao: "enviada", texto: "Larissa, sua troca já está liberada no sistema", horario: "2026-08-21T10:20:00" },
      { id: "m2", direcao: "recebida", texto: "Perfeito, obrigada!", horario: "2026-08-21T10:25:00" },
    ],
  },
];
