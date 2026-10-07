/* =========================================================
   CONFIG: edit these values before publishing
   ========================================================= */
const CONFIG = {
  brandName: "TaskPath",

  // WhatsApp number in international format, digits only (no +, spaces or dashes).
  // Example: Nigeria +234 801 234 5678  ->  "2348012345678"
  whatsappNumber: "2348000000000",

  // Telegram username without the @
  telegramUsername: "your_telegram_username",

  // Pre-filled message when someone taps a WhatsApp button
  whatsappMessage: "Hi! I'm interested in getting started with AI training work on Handshake/Outlier.",

  // Paste your Google Apps Script Web App URL here (see README step 2)
  sheetEndpoint: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
};

/* ========================================================= */

const waLink = (msg) =>
  `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
const tgLink = () => `https://t.me/${CONFIG.telegramUsername}`;

// Apply brand name and chat links
document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = CONFIG.brandName));
document.querySelectorAll("[data-whatsapp]").forEach((el) => (el.href = waLink(CONFIG.whatsappMessage)));
document.querySelectorAll("[data-telegram]").forEach((el) => (el.href = tgLink()));
document.getElementById("year").textContent = new Date().getFullYear();

// Lead form
const form = document.getElementById("lead-form");
const msg = document.getElementById("form-msg");
const btn = document.getElementById("submit-btn");

function setMsg(text, type) {
  msg.textContent = text;
  msg.className = "form-msg " + (type || "");
}

function validPhone(value) {
  const digits = value.replace(/[^\d]/g, "");
  return /^[+\d][\d\s\-()]*$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.trim();
  const platform = form.elements.platform.value;

  form.elements.name.classList.toggle("invalid", name.length < 2);
  form.elements.phone.classList.toggle("invalid", !validPhone(phone));

  if (name.length < 2) return setMsg("Please enter your full name.", "err");
  if (!validPhone(phone)) return setMsg("Please enter a valid phone number, including country code.", "err");

  // Honeypot: real people never fill this hidden field
  if (form.elements.website.value) return setMsg("Thanks! We'll be in touch soon.", "ok");

  if (CONFIG.sheetEndpoint.startsWith("PASTE_")) {
    return setMsg("Form not connected yet: add your Apps Script URL in script.js.", "err");
  }

  btn.disabled = true;
  btn.textContent = "Sending...";
  setMsg("");

  try {
    // URL-encoded body keeps this a "simple" request, so no CORS preflight is needed
    const body = new URLSearchParams({
      name,
      phone,
      platform,
      page: location.href,
      userAgent: navigator.userAgent,
    });
    const res = await fetch(CONFIG.sheetEndpoint, { method: "POST", body });
    const data = await res.json();
    if (data.result !== "success") throw new Error(data.error || "Unknown error");

    form.reset();
    setMsg(`Thanks ${name.split(" ")[0]}! We'll message you within 24 hours.`, "ok");

    // Offer to continue on WhatsApp straight away
    const followUp = `Hi, I'm ${name}. I just signed up on your website (${platform}). My number is ${phone}.`;
    const link = document.createElement("a");
    link.href = waLink(followUp);
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "btn btn-wa btn-block";
    link.style.marginTop = "12px";
    link.textContent = "💬 Continue on WhatsApp now";
    msg.after(link);
  } catch (err) {
    console.error(err);
    setMsg("Something went wrong. Please try again, or message us on WhatsApp.", "err");
  } finally {
    btn.disabled = false;
    btn.textContent = "Get my next steps";
  }
});
