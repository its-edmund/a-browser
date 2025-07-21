import punycode from "punycode";

function looksResolvable(host: string): boolean {
  if (host === "localhost") return true; // dev servers
  if (host.includes(".")) return true; // foo.com, intranet.corp
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true; // IPv4
  if (/^\[?[A-F0-9]*:[A-F0-9:]+\]?$/.test(host)) return true; // IPv6
  return false; // single label → likely search
}

const DEFAULT_PORTS: Record<string, string> = {
  "http:": "80",
  "https:": "443",
};

const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

export function canonicaliseInput(input: string): string | null {
  const raw = input.trim();

  if (!raw) return null;

  const candidate = SCHEME_RE.test(raw) ? raw : `http://${raw}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null; // Fall back to search
  }

  if (!looksResolvable(url.hostname)) {
    return null; // treat as search query
  }

  url.protocol = url.protocol.toLowerCase();

  url.hostname = punycode.toASCII(url.hostname.toLowerCase());

  if (url.port === DEFAULT_PORTS[url.protocol]) url.port = "";
  if (!url.pathname) url.pathname = "/";

  url.pathname = encodeURI(decodeURI(url.pathname));
  url.search = new URLSearchParams(url.search).toString()
    ? `?${new URLSearchParams(url.search).toString()}`
    : "";

  return url.href;
}
