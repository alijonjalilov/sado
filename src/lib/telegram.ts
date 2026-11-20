import "server-only";
import type { SummarySection } from "./questionnaire/summary";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Уведомление о новой заявке в Telegram. Работает, если заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID. */
export async function notifyNewLead(opts: { id: string; eventLabel: string; clientName: string; phone: string; summary: SummarySection[]; adminUrl: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    `🎉 <b>Новая заявка: ${esc(opts.eventLabel)}</b>`,
    `👤 ${esc(opts.clientName)} · ${esc(opts.phone)}`,
    "",
    ...opts.summary
      .filter((s) => s.stepId !== "eventType" && s.stepId !== "contacts")
      .flatMap((s) => s.items.map((i) => `• ${esc(i.label)}: <b>${esc(i.value)}</b>`)),
    "",
    `<a href="${esc(opts.adminUrl)}">Открыть в админ-панели</a>`,
  ];
  let text = lines.join("\n");
  if (text.length > 4000) text = text.slice(0, 3990) + "…";

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
  } catch (e) {
    console.warn("[telegram] notify failed:", (e as Error).message);
  }
}
