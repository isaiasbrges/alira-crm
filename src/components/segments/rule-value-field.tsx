import { MOCK_CATEGORIAS, MOCK_CIDADES, MOCK_TAGS, MOCK_TAMANHOS, MOCK_VENDEDORES } from "@/mocks/customers";
import type { SegmentField } from "@/types/segment";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPCOES_FIXAS: Partial<Record<SegmentField, { value: string; label: string }[]>> = {
  status: [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
    { value: "vip", label: "VIP" },
  ],
  whatsappAutorizado: [
    { value: "sim", label: "Sim" },
    { value: "nao", label: "Não" },
  ],
};

/** Campo de valor da regra — o tipo de input muda conforme o campo escolhido. */
export function RuleValueField({
  campo,
  value,
  onChange,
}: {
  campo: SegmentField;
  value: string;
  onChange: (value: string) => void;
}) {
  const opcoesFixas = OPCOES_FIXAS[campo];
  if (opcoesFixas) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {opcoesFixas.map((opcao) => (
            <SelectItem key={opcao.value} value={opcao.value}>
              {opcao.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (campo === "categoria") {
    return <ListaSelect opcoes={MOCK_CATEGORIAS} value={value} onChange={onChange} />;
  }

  if (campo === "tamanho") {
    return <ListaSelect opcoes={MOCK_TAMANHOS} value={value} onChange={onChange} />;
  }

  if (campo === "cidade") {
    return <ListaSelect opcoes={MOCK_CIDADES} value={value} onChange={onChange} />;
  }

  if (campo === "vendedor") {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {MOCK_VENDEDORES.map((vendedor) => (
            <SelectItem key={vendedor.id} value={vendedor.id}>
              {vendedor.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (campo === "tag") {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {MOCK_TAGS.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // ticketMedio, diasSemComprar
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      inputMode="numeric"
      placeholder={campo === "diasSemComprar" ? "90" : "800"}
    />
  );
}

function ListaSelect({
  opcoes,
  value,
  onChange,
}: {
  opcoes: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        {opcoes.map((opcao) => (
          <SelectItem key={opcao} value={opcao}>
            {opcao}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
