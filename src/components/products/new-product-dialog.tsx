"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import type { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/mocks/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NewProductDialogProps = {
  onCreate: (produto: Product) => void;
};

/**
 * Cadastro básico de produto.
 *
 * Cria com uma única variante (P/Único) e estoque zerado — ajustar tamanhos,
 * cores e estoque por variante é trabalho de edição, ainda não implementado.
 * O produto entra só na lista desta sessão do navegador; nada é persistido.
 */
export function NewProductDialog({ onCreate }: NewProductDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [categoria, setCategoria] = React.useState(PRODUCT_CATEGORIES[0]);
  const [preco, setPreco] = React.useState("");

  function limpar() {
    setNome("");
    setSku("");
    setCategoria(PRODUCT_CATEGORIES[0]);
    setPreco("");
  }

  function submeter(event: React.FormEvent) {
    event.preventDefault();
    if (!nome.trim() || !sku.trim() || !preco) return;

    const id = `prod-${Date.now()}`;
    onCreate({
      id,
      nome: nome.trim(),
      sku: sku.trim().toUpperCase(),
      categoria,
      preco: Number(preco.replace(",", ".")) || 0,
      status: "ativo",
      variantes: [
        { id: `${id}-P-Unico`, tamanho: "P", cor: "Único", sku: `${sku}-PU`, estoque: 0 },
      ],
    });

    limpar();
    setOpen(false);
  }

  function alternarAbertura(next: boolean) {
    setOpen(next);
    if (!next) limpar();
  }

  return (
    <Dialog open={open} onOpenChange={alternarAbertura}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Novo produto
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={submeter}>
          <DialogHeader>
            <DialogTitle>Novo produto</DialogTitle>
            <DialogDescription>
              Cadastro básico. Tamanhos, cores e estoque por variante se ajustam depois, na
              edição do produto.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="produto-nome">Nome</Label>
              <Input
                id="produto-nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Vestido Midi Alfaiataria"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="produto-sku">SKU</Label>
                <Input
                  id="produto-sku"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="VM-MIDI-09"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="produto-preco">Preço</Label>
                <Input
                  id="produto-preco"
                  value={preco}
                  onChange={(event) => setPreco(event.target.value)}
                  placeholder="349,00"
                  inputMode="decimal"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar produto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
