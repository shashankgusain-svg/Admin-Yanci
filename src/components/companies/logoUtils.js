export const LOGO_MAX_BYTES = 10 * 1024 * 1024;

export const LOGO_MIME_BY_EXT = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};

export const LOGO_ACCEPT = Object.keys(LOGO_MIME_BY_EXT)
  .map((ext) => `.${ext}`)
  .join(",");

export const fileExtension = (name = "") => {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return match ? match[1].toLowerCase() : "";
};

export const validateLogoFile = (file) => {
  if (!file) return "No file selected.";
  if (!LOGO_MIME_BY_EXT[fileExtension(file.name)]) {
    return "Logo must be a PNG, JPG, WebP, or SVG image.";
  }
  if (file.size > LOGO_MAX_BYTES) return "Logo must be 10 MB or smaller.";
  return null;
};

const normalize = (value) =>
  String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const NOISE_WORDS = /\b(logo|icon|brand|image|img|final|new|copy|\d+x\d+)\b/gi;

const nameVariants = (fileName) => {
  const base = fileName.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[_-]+/g, " ").replace(NOISE_WORDS, " ");
  const firstToken = base.split(/[\s_.-]+/)[0];
  return [...new Set([base, cleaned, firstToken].map(normalize).filter(Boolean))];
};

/**
 * Matches a logo file name to a company: exact symbol first, then company
 * name. Visible (listed) companies win when several records share a key.
 */
export const buildLogoMatcher = (companies) => {
  const bySymbol = new Map();
  const byName = new Map();
  const ranked = [...companies].sort(
    (a, b) => Number(Boolean(a.duplicateOf || a.isHidden || a.isDelisted)) -
      Number(Boolean(b.duplicateOf || b.isHidden || b.isDelisted))
  );
  ranked.forEach((company) => {
    const sym = normalize(company.symbol);
    if (sym && !bySymbol.has(sym)) bySymbol.set(sym, company);
    const name = normalize(company.companyName || company.company);
    if (name && !byName.has(name)) byName.set(name, company);
  });

  return (fileName) => {
    const variants = nameVariants(fileName);
    for (const key of variants) {
      if (bySymbol.has(key)) return { company: bySymbol.get(key), matchedBy: "symbol" };
    }
    for (const key of variants) {
      if (byName.has(key)) return { company: byName.get(key), matchedBy: "name" };
    }
    return null;
  };
};
