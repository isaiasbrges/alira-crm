import { UserPlus } from "lucide-react";

import { initials } from "@/lib/format";
import type { TeamMember } from "@/mocks/team";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleBadge } from "@/components/settings/role-badge";

export function TeamTable({ team }: { team: TeamMember[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold">Usuários</h2>
          <p className="text-xs text-muted-foreground">Quem tem acesso ao Alira CRM.</p>
        </div>
        <Button size="sm" className="gap-1.5" disabled>
          <UserPlus className="size-3.5" />
          Convidar
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.map((membro) => (
            <TableRow key={membro.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-secondary text-xs font-medium">
                      {initials(membro.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{membro.nome}</div>
                    <div className="text-xs text-muted-foreground">{membro.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={membro.role} />
              </TableCell>
              <TableCell>
                <Badge variant={membro.ativo ? "success" : "outline"}>
                  {membro.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
