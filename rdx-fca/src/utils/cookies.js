// © SARDAR RDX — RDX-FCA | github.com/sardarrdx
const fs = require("fs");
const path = require("path");

const appStateDir = path.join(__dirname, "..", "..", "Fca_Database");
const appStateFile = path.join(appStateDir, "appState.json");

function appStatePath(newAppState) {
  if (!fs.existsSync(appStateDir)) {
    fs.mkdirSync(appStateDir, { recursive: true });
  }
  if (newAppState) {
    fs.writeFileSync(appStateFile, JSON.stringify(newAppState, null, 2));
  }
  return appStateFile;
}

function loadAppState() {
  try {
    if (fs.existsSync(appStateFile)) {
      return JSON.parse(fs.readFileSync(appStateFile, "utf8"));
    }
  } catch (e) {
    return null;
  }
  return null;
}

function saveAppState(appState) {
  appStatePath(appState);
}

function parseCookieString(cookieStr) {
  if (!cookieStr) return [];
  return cookieStr.split(";").map(c => {
    const parts = c.trim().split("=");
    return { key: parts[0], value: parts.slice(1).join("=") || "" };
  }).filter(c => c.key);
}

function cookiesToString(cookies) {
  if (!cookies) return "";
  if (typeof cookies === "string") return cookies;
  return cookies.map(c => `${c.key}=${c.value}`).join("; ");
}

function getCookieValue(cookies, key) {
  if (!cookies) return null;
  const arr = Array.isArray(cookies) ? cookies : parseCookieString(cookies);
  const found = arr.find(c => c.key === key);
  return found ? found.value : null;
}

function validateAppState(appState) {
  if (!appState || !Array.isArray(appState)) return false;
  const required = ["c_user", "xs"];
  const keys = appState.map(c => c.key);
  return required.every(r => keys.includes(r));
}

module.exports = {
  appStatePath,
  loadAppState,
  saveAppState,
  parseCookieString,
  cookiesToString,
  getCookieValue,
  validateAppState
};