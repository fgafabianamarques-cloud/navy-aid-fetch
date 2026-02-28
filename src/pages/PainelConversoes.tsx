import { useState, useEffect } from "react";
import { BarChart3, RefreshCw, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Conversion {
  id: string;
  tag_id: string;
  tag_label: string;
  transaction_id: string | null;
  customer_name: string | null;
  customer_cpf: string | null;
  amount: number | null;
  created_at: string;
}

const PainelConversoes = () => {
  const navigate = useNavigate();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("conversions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!error && data) {
      setConversions(data as Conversion[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConversions();
  }, []);

  const tag1Count = conversions.filter((c) => c.tag_label.includes("17960420953")).length;
  const tag2Count = conversions.filter((c) => c.tag_label.includes("17951920855")).length;
  const totalAmount = conversions.reduce((sum, c) => sum + (c.amount || 0), 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const maskCpf = (cpf: string | null) => {
    if (!cpf) return "—";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy text-primary-foreground py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <h1 className="text-lg font-bold">Painel de Conversões</h1>
            </div>
          </div>
          <button
            onClick={fetchConversions}
            disabled={loading}
            className="flex items-center gap-2 text-sm bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground px-3 py-1.5 rounded-md transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-sm text-muted-foreground mb-1">Total de Conversões</p>
            <p className="text-3xl font-bold text-foreground">{conversions.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-sm text-muted-foreground mb-1">Tag 1 (AW-...0953)</p>
            <p className="text-3xl font-bold text-blue-600">{tag1Count}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-sm text-muted-foreground mb-1">Tag 2 (AW-...0855)</p>
            <p className="text-3xl font-bold text-purple-600">{tag2Count}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-sm text-muted-foreground mb-1">Faturamento Total</p>
            <p className="text-3xl font-bold text-foreground">
              R$ {(totalAmount / 100).toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        {/* Bar comparison */}
        <div className="bg-card border border-border rounded-lg p-5 mb-8">
          <h3 className="text-sm font-bold text-foreground mb-4">Comparação entre Tags</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Tag 1 (AW-...0953)</span>
                <span className="font-bold text-foreground">{tag1Count}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${conversions.length ? (tag1Count / conversions.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Tag 2 (AW-...0855)</span>
                <span className="font-bold text-foreground">{tag2Count}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${conversions.length ? (tag2Count / conversions.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-bold text-foreground">Histórico de Conversões</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Data</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Tag</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Transação</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">CPF</th>
                  <th className="text-right px-4 py-3 text-muted-foreground font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      Carregando...
                    </td>
                  </tr>
                ) : conversions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      Nenhuma conversão registrada ainda.
                    </td>
                  </tr>
                ) : (
                  conversions.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          c.tag_label.includes("17960420953")
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {c.tag_label.includes("17960420953") ? "Tag 1" : "Tag 2"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{c.transaction_id || "—"}</td>
                      <td className="px-4 py-3 text-foreground">{c.customer_name || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{maskCpf(c.customer_cpf)}</td>
                      <td className="px-4 py-3 text-right text-foreground font-bold">
                        {c.amount ? `R$ ${(c.amount / 100).toFixed(2).replace(".", ",")}` : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelConversoes;
