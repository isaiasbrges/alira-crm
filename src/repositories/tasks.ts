import "server-only";

import type { Prisma } from "@prisma/client";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

const STATUS_PARA_TELA: Record<string, TaskStatus> = {
  PENDENTE: "pendente",
  CONCLUIDA: "concluida",
  CANCELADA: "cancelada",
};

const PRIORIDADE_PARA_TELA: Record<string, TaskPriority> = {
  ALTA: "alta",
  MEDIA: "media",
  BAIXA: "baixa",
};

const PRIORIDADE_PARA_BANCO: Record<TaskPriority, "ALTA" | "MEDIA" | "BAIXA"> =
  {
    alta: "ALTA",
    media: "MEDIA",
    baixa: "BAIXA",
  };

type TarefaComRelacoes = Prisma.TaskGetPayload<{
  include: {
    customer: { select: { nome: true } };
    seller: { select: { id: true; nome: true } };
  };
}>;

function mapearTarefaParaTela(tarefa: TarefaComRelacoes): Task {
  return {
    id: tarefa.id,
    titulo: tarefa.titulo,
    descricao: tarefa.descricao ?? undefined,
    clienteNome: tarefa.customer?.nome,
    vendedorId: tarefa.sellerId ?? "",
    vendedorNome: tarefa.seller?.nome ?? "—",
    prioridade: PRIORIDADE_PARA_TELA[tarefa.prioridade] ?? "media",
    status: STATUS_PARA_TELA[tarefa.status] ?? "pendente",
    venceEm: (tarefa.venceEm ?? tarefa.createdAt).toISOString(),
  };
}

/** Tarefas da loja ativa, mais os vendedores e clientes para o formulário. */
export async function listarTarefasTela() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const [tarefas, vendedores, clientes] = await Promise.all([
    db.task.findMany({
      where: { storeId: ctx.storeId ?? undefined },
      include: {
        customer: { select: { nome: true } },
        seller: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.seller.findMany({
      where: { ativo: true, storeId: ctx.storeId ?? undefined },
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    }),
    db.customer.findMany({
      where: { storeId: ctx.storeId ?? undefined },
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    }),
  ]);

  return { tarefas: tarefas.map(mapearTarefaParaTela), vendedores, clientes };
}

export type CriarTarefaInput = {
  titulo: string;
  clienteId?: string | null;
  vendedorId: string;
  prioridade: TaskPriority;
  venceEm?: string | null;
};

export async function criarTarefa(input: CriarTarefaInput) {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  if (!ctx.storeId) {
    throw new Error("Nenhuma loja ativa na sessão.");
  }

  const tarefa = await db.task.create({
    data: {
      organizationId: ctx.organizationId,
      storeId: ctx.storeId,
      customerId: input.clienteId ?? null,
      sellerId: input.vendedorId,
      criadoPorId: ctx.userId,
      titulo: input.titulo,
      prioridade: PRIORIDADE_PARA_BANCO[input.prioridade],
      venceEm: input.venceEm ? new Date(input.venceEm) : new Date(),
    },
    include: {
      customer: { select: { nome: true } },
      seller: { select: { id: true, nome: true } },
    },
  });

  return mapearTarefaParaTela(tarefa);
}

/** Alterna entre pendente e concluída. Tarefa cancelada não é afetada. */
export async function alternarConclusaoTarefa(id: string): Promise<void> {
  const db = await tenantDb(await getTenantContext());

  const tarefa = await db.task.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!tarefa || tarefa.status === "CANCELADA") return;

  const novoStatus = tarefa.status === "CONCLUIDA" ? "PENDENTE" : "CONCLUIDA";
  await db.task.update({
    where: { id },
    data: {
      status: novoStatus,
      concluidaEm: novoStatus === "CONCLUIDA" ? new Date() : null,
    },
  });
}
