// ─── Win Agro — Shared Branded Email Template Library ───────────────────────

const LOGO_URL = "https://winagrotech.com/logo-win-agro.png";
const SITE_URL = "https://winagrotech.com";
const WA_URL   = "https://wa.me/2290161336548";
const MAIL     = "contact@winagrotech.com";

export function winAgroEmailHeader(): string {
  return `
    <div style="background:linear-gradient(135deg,#07130A 0%,#0F2214 100%);padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
      <img src="${LOGO_URL}" alt="Win Agro" width="72" height="72"
           style="border-radius:16px;display:block;margin:0 auto 12px;" />
      <h1 style="color:#4ADE80;font-family:Georgia,serif;font-size:22px;font-weight:bold;margin:0 0 4px;">
        Win Agro
      </h1>
      <p style="color:#86EFAC;font-size:11px;margin:0;letter-spacing:2px;text-transform:uppercase;font-family:sans-serif;">
        Agri Tech Solutions &bull; B&eacute;nin
      </p>
    </div>`;
}

export function winAgroEmailFooter(): string {
  return `
    <div style="background-color:#07130A;border-radius:0 0 12px 12px;padding:24px 32px;text-align:center;">
      <img src="${LOGO_URL}" alt="Win Agro" width="40" height="40"
           style="border-radius:10px;display:block;margin:0 auto 12px;opacity:0.9;" />
      <p style="color:#4ADE80;font-family:Georgia,serif;font-size:14px;font-weight:bold;margin:0 0 4px;">
        Win Agro Agri Tech Solutions
      </p>
      <p style="color:#86EFAC;font-size:11px;margin:0 0 16px;font-family:sans-serif;">
        L&rsquo;&eacute;levage sain, de A &agrave; Z. &bull; B&eacute;nin
      </p>
      <div style="margin-bottom:12px;">
        <a href="${SITE_URL}"  style="color:#4ADE80;font-size:12px;text-decoration:none;font-family:sans-serif;margin:0 10px;">&#127758; winagrotech.com</a>
        <a href="mailto:${MAIL}" style="color:#4ADE80;font-size:12px;text-decoration:none;font-family:sans-serif;margin:0 10px;">&#9993; ${MAIL}</a>
        <a href="${WA_URL}"   style="color:#4ADE80;font-size:12px;text-decoration:none;font-family:sans-serif;margin:0 10px;">&#128241; WhatsApp</a>
      </div>
      <p style="color:#4B6355;font-size:10px;margin:16px 0 0;font-family:sans-serif;">
        &copy; 2026 Win Agro Agri Tech Solutions &mdash; Tous droits r&eacute;serv&eacute;s.
      </p>
    </div>`;
}

/**
 * Wraps a plain-text body inside the branded Win Agro HTML email shell.
 * Double line-breaks become paragraph separators.
 * Single line-breaks become <br>.
 * HTML special chars in the text are escaped automatically.
 */
export function buildBrandedEmail(textBody: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const bodyHtml = textBody
    .trim()
    .split(/\n{2,}/)
    .map(para =>
      `<p style="color:#333;font-size:14px;line-height:1.8;margin:0 0 18px;font-family:sans-serif;">` +
      para.split("\n").map(escape).join("<br>") +
      `</p>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
      ${winAgroEmailHeader()}
      <div style="padding:32px 32px 8px;background-color:#FAFAF8;border-left:1px solid #E0F0E8;border-right:1px solid #E0F0E8;">
        ${bodyHtml}
      </div>
      ${winAgroEmailFooter()}
    </div>`;
}
