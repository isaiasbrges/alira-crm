"use client";

import * as React from "react";

import type { Product } from "@/types/product";
import type { PaymentMethod, Sale } from "@/types/sale";
import { MOCK_CUSTOMERS, MOCK_VENDEDORES } from "@/mocks/customers";
import { MOCK_SALES } from "@/mocks/sales";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { CartList } from "@/components/sales/pdv/cart-list";
import { CheckoutPanel, CLIENTE_BALCAO } from "@/components/sales/pdv/checkout-panel";
import { ProductPicker } from "@/components/sales/pdv/product-picker";
import { SaleSuccess } from "@/components/sales/pdv/sale-success";
import type { CartItem } from "@/components/sales/pdv/types";
import { VariantPickerDialog } from "@/components/sales/pdv/variant-picker-dialog";
import { VENDA_RECENTE_KEY } from "@/components/sales/sales-view";

function estadoInicial() {
  return {
    produtoEmEscolha: null as Product | null,
    itens: [] as CartItem[],
    clienteId: CLIENTE_BALCAO,
    vendedorId: "",
    desconto: "",
    formaPagamento: "" as PaymentMethod | "",
    observacao: "",
  };
}

export function PdvView() {
  const [estado, setEstado] = React.useState(estadoInicial);
  const [vendaFinalizada, setVendaFinalizada] = React.useState<Sale | null>(null);

  const subtotal = estado.itens.reduce(
    (soma, item) => soma + item.precoUnitario * item.quantidade,
    0
  );
  const descontoNumero = Number(estado.desconto.replace(",", ".")) || 0;
  const total = Math.max(0, subtotal - descontoNumero);
  const podeFinalizarar = estado.itens.length > 0 && Boolean(estado.vendedorId) && Boolean(estado.formaPagamento);

  function adicionarAoCarrinho(item: CartItem) {
    setEstado((atual) => {
      const existente = atual.itens.find((i) => i.variantId === item.variantId);
      if (!existente) return { ...atual, itens: [...atual.itens, item] };

      const quantidade = Math.min(
        existente.estoqueDisponivel,
        existente.quantidade + item.quantidade
      );
      return {
        ...atual,
        itens: atual.itens.map((i) =>
          i.variantId === item.variantId ? { ...i, quantidade } : i
        ),
      };
    });
  }

  function removerDoCarrinho(variantId: string) {
    setEstado((atual) => ({
      ...atual,
      itens: atual.itens.filter((item) => item.variantId !== variantId),
    }));
  }

  function alterarQuantidade(variantId: string, quantidade: number) {
    setEstado((atual) => ({
      ...atual,
      itens:
        quantidade <= 0
          ? atual.itens.filter((item) => item.variantId !== variantId)
          : atual.itens.map((item) =>
              item.variantId === variantId
                ? { ...item, quantidade: Math.min(quantidade, item.estoqueDisponivel) }
                : item
            ),
    }));
  }

  function finalizarVenda() {
    if (!podeFinalizarar || !estado.formaPagamento) return;

    const cliente = MOCK_CUSTOMERS.find((item) => item.id === estado.clienteId);
    const vendedor = MOCK_VENDEDORES.find((item) => item.id === estado.vendedorId);
    const proximoNumero = Math.max(...MOCK_SALES.map((venda) => venda.numero)) + 1;

    const venda: Sale = {
      id: `sale-${Date.now()}`,
      numero: proximoNumero,
      clienteId: cliente?.id,
      clienteNome: cliente?.nome ?? "Cliente balcão",
      vendedorId: estado.vendedorId,
      vendedorNome: vendedor?.nome ?? "",
      itens: estado.itens.map((item) => ({
        variantId: item.variantId,
        produtoNome: item.produtoNome,
        tamanho: item.tamanho,
        cor: item.cor,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        total: item.precoUnitario * item.quantidade,
      })),
      subtotal,
      desconto: descontoNumero,
      total,
      formaPagamento: estado.formaPagamento,
      status: "concluida",
      observacao: estado.observacao.trim() || undefined,
      concluidaEm: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(VENDA_RECENTE_KEY, JSON.stringify(venda));
    } catch {
      // sessionStorage indisponível: a venda ainda aparece na tela de sucesso,
      // só não chega pré-carregada em /vendas.
    }

    setVendaFinalizada(venda);
  }

  if (vendaFinalizada) {
    return (
      <>
        <PageHeader titulo="PDV Lite" descricao="Registro rápido de vendas no balcão." />
        <SaleSuccess venda={vendaFinalizada} onNovaVenda={() => {
          setEstado(estadoInicial());
          setVendaFinalizada(null);
        }} />
      </>
    );
  }

  return (
    <>
      <PageHeader titulo="PDV Lite" descricao="Registro rápido de vendas no balcão." />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="min-h-[560px] p-4">
          <ProductPicker
            onSelect={(produto) => setEstado((atual) => ({ ...atual, produtoEmEscolha: produto }))}
          />
        </Card>

        <div className="grid gap-4">
          <Card className="p-4">
            <span className="text-sm font-medium">Carrinho</span>
            <div className="mt-3 max-h-64 overflow-y-auto">
              <CartList
                itens={estado.itens}
                onRemove={removerDoCarrinho}
                onChangeQuantidade={alterarQuantidade}
              />
            </div>
          </Card>

          <Card className="p-4">
            <CheckoutPanel
              clienteId={estado.clienteId}
              onClienteChange={(clienteId) => setEstado((atual) => ({ ...atual, clienteId }))}
              vendedorId={estado.vendedorId}
              onVendedorChange={(vendedorId) => setEstado((atual) => ({ ...atual, vendedorId }))}
              desconto={estado.desconto}
              onDescontoChange={(desconto) => setEstado((atual) => ({ ...atual, desconto }))}
              formaPagamento={estado.formaPagamento}
              onFormaPagamentoChange={(formaPagamento) =>
                setEstado((atual) => ({ ...atual, formaPagamento }))
              }
              observacao={estado.observacao}
              onObservacaoChange={(observacao) =>
                setEstado((atual) => ({ ...atual, observacao }))
              }
              subtotal={subtotal}
              total={total}
              podeFinalizarar={podeFinalizarar}
              onFinalizar={finalizarVenda}
            />
          </Card>
        </div>
      </div>

      <VariantPickerDialog
        produto={estado.produtoEmEscolha}
        onClose={() => setEstado((atual) => ({ ...atual, produtoEmEscolha: null }))}
        onAdd={adicionarAoCarrinho}
      />
    </>
  );
}
