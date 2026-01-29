/**
 * SCORE - LÓGICA DEFINITIVA (Lead C = sempre o menor)
 *
 * Regras de negócio:
 * - "Renda extra" = maior prioridade
 * - "Quero viver disso" = média prioridade
 * - "Já vivo disso e quero faturar ainda mais" = menor prioridade (deve cair pro fundo)
 * - "Não" (sem conhecimento/experiência) = maior prioridade
 * - "Sim" = menor prioridade
 *
 * Faturamento e meta influenciam, mas NÃO superam a regra acima.
 */

function calculateLeadScore(data) {
  let score = 0;

  // ─────────────────────────────
  // Helpers
  // ─────────────────────────────
  const norm = (v) => String(v ?? "").trim().toLowerCase();

  const toNumber = (val) => {
    const s = String(val ?? "").trim();
    if (!s) return null;
    const n = Number(s.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const toBand = (val) => {
    const raw = norm(val);

    // já vem do select no seu form atual
    if (raw === "0-5000" || raw === "5000-10000" || raw === "10000+") return raw;

    // se vier numérico
    const n = toNumber(raw);
    if (n === null) return "";
    if (n > 10000) return "10000+";
    if (n >= 5000) return "5000-10000";
    return "0-5000";
  };

  // ─────────────────────────────
  // 1) OBJETIVO (domina o score)
  // ─────────────────────────────
  // Aqui é onde garantimos que "faturar-mais" seja o pior de todos.
  const objetivo = norm(data.objetivo);
  if (objetivo === "renda-extra") score += 60;
  else if (objetivo === "viver-disso") score += 30;
  else if (objetivo === "faturar-mais") score -= 20; // penalidade forte (Lead C afunda)
  else score += 0;

  // ─────────────────────────────
  // 2) CONHECIMENTO (prioridade real)
  // ─────────────────────────────
  const conhecimento = norm(data.conhecimento);
  if (conhecimento === "nao") score += 40; // prioridade máxima
  else if (conhecimento === "sim") score -= 10; // penaliza (Lead C cai ainda mais)

  // ─────────────────────────────
  // 3) FATURAMENTO ATUAL (influencia, mas não salva Lead C)
  // ─────────────────────────────
  const fat = toBand(data.faturamentoAtual);
  if (fat === "10000+") score += 12;
  else if (fat === "5000-10000") score += 8;
  else if (fat === "0-5000") score += 4;

  // ─────────────────────────────
  // 4) META DE FATURAMENTO (influencia, mas não salva Lead C)
  // ─────────────────────────────
  const meta = toBand(data.metaFaturamento);
  if (meta === "10000+") score += 12;
  else if (meta === "5000-10000") score += 8;
  else if (meta === "0-5000") score += 4;

  // ─────────────────────────────
  // CLASSIFICAÇÃO
  // ─────────────────────────────
  // Com essa escala:
  // - Lead A tende a ficar bem alto
  // - Lead B no meio
  // - Lead C quase sempre negativo/baixo
  let classification = "COLD";
  if (score >= 70) classification = "HOT";
  else if (score >= 35) classification = "WARM";

  return { score, classification };
}
