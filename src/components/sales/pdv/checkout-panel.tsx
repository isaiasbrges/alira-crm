import { formatCurrency } from "@/lib/format";
import { PAYMENT_METHOD_LABEL, type PaymentMethod } from "@/types/sale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CLIENTE_BALCAO = "balcao";

type CheckoutPanelProps = {
  clientes: { id: string; nome: string }[];
  vendedores: { id: string; nome: string }[];
  clienteId: string;
  onClienteChange: (id: string) => void;
  vendedorId: string;
  onVendedorChange: (id: string) => void;
  desconto: string;
  onDescontoChange: (valor: string) => void;
  formaPagamento: PaymentMethod | "";
  onFormaPagamentoChange: (valor: PaymentMethod) => void;
  observacao: string;
  onObservacaoChange: (valor: string) => void;
  subtotal: number;
  total: number;
  podeFinalizarar: boolean;
  onFinalizar: () => void;
  pendente?: boolean;
  erro?: string;
};

export function CheckoutPanel({
  clientes,
  vendedores,
  clienteId,
  onClienteChange,
  vendedorId,
  onVendedorChange,
  desconto,
  onDescontoChange,
  formaPagamento,
  onFormaPagamentoChange,
  observacao,
  onObservacaoChange,
  subtotal,
  total,
  podeFinalizarar,
  onFinalizar,
  pendente,
  erro,
}: CheckoutPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Cliente</Label>
          <Select value={clienteId} onValueChange={onClienteChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CLIENTE_BALCAO}>Cliente balcão</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Vendedor</Label>
          <Select value={vendedorId} onValueChange={onVendedorChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o vendedor" />
            </SelectTrigger>
            <SelectContent>
              {vendedores.map((vendedor) => (
                <SelectItem key={vendedor.id} value={vendedor.id}>
                  {vendedor.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="pdv-desconto">Desconto (R$)</Label>
            <Input
              id="pdv-desconto"
              value={desconto}
              onChange={(event) => onDescontoChange(event.target.value)}
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Pagamento</Label>
            <Select
              value={formaPagamento}
              onValueChange={(value) =>
                onFormaPagamentoChange(value as PaymentMethod)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_METHOD_LABEL).map(([valor, rotulo]) => (
                  <SelectItem key={valor} value={valor}>
                    {rotulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pdv-observacao">Observação</Label>
          <Textarea
            id="pdv-observacao"
            value={observacao}
            onChange={(event) => onObservacaoChange(event.target.value)}
            placeholder="Opcional"
            rows={2}
          />
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-border pt-4">
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {erro && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {erro}
          </p>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={!podeFinalizarar || pendente}
          onClick={onFinalizar}
        >
          {pendente ? "Finalizando..." : "Finalizar venda"}
        </Button>
      </div>
    </div>
  );
}

export { CLIENTE_BALCAO };
