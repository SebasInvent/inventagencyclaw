import { Founder } from "@/lib/types/database";

export interface CapitalCalculation {
  totalShares: number;
  shareNominalValue: number;
  authorizedCapital: number;
  subscribedCapital: number;
  paidCapital: number;
  founderShares: {
    founderId: string;
    name: string;
    percentage: number;
    shareCount: number;
    shareValue: number;
  }[];
}

export function calculateCapital(
  totalCapital: number,
  shareNominalValue: number,
  founders: Pick<Founder, "id" | "full_name" | "share_percentage">[]
): CapitalCalculation {
  const totalShares = Math.floor(totalCapital / shareNominalValue);
  const authorizedCapital = totalShares * shareNominalValue;

  const founderShares = founders.map((f) => {
    const shareCount = Math.floor(totalShares * (f.share_percentage / 100));
    return {
      founderId: f.id,
      name: f.full_name,
      percentage: f.share_percentage,
      shareCount,
      shareValue: shareCount * shareNominalValue,
    };
  });

  return {
    totalShares,
    shareNominalValue,
    authorizedCapital,
    subscribedCapital: authorizedCapital,
    paidCapital: authorizedCapital,
    founderShares,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CO").format(value);
}

export function numberToWords(n: number): string {
  const units = ["", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const teens = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
  const tens = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const hundreds = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

  if (n === 0) return "cero";
  if (n < 0) return "menos " + numberToWords(-n);

  let result = "";

  if (n >= 1000000) {
    const millions = Math.floor(n / 1000000);
    if (millions === 1) {
      result += "un millón ";
    } else {
      result += numberToWords(millions) + " millones ";
    }
    n %= 1000000;
  }

  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    if (thousands === 1) {
      result += "mil ";
    } else {
      result += numberToWords(thousands) + " mil ";
    }
    n %= 1000;
  }

  if (n >= 100) {
    const h = Math.floor(n / 100);
    if (n === 100) {
      result += "cien ";
    } else {
      result += hundreds[h] + " ";
    }
    n %= 100;
  }

  if (n >= 20) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) {
      result += tens[t] + " ";
    } else {
      result += tens[t] + " y " + units[u] + " ";
    }
  } else if (n >= 10) {
    result += teens[n - 10] + " ";
  } else if (n > 0) {
    result += units[n] + " ";
  }

  return result.trim();
}

export function capitalToWords(value: number): string {
  return numberToWords(value).toUpperCase() + " PESOS M/CTE";
}

export const SUGGESTED_CAPITALS = [
  { label: "Mínimo ($1.000.000)", value: 1000000, shareValue: 1000, tip: "Registro más económico ~$87K" },
  { label: "Bajo ($5.000.000)", value: 5000000, shareValue: 1000, tip: "Capital bajo" },
  { label: "Medio ($10.000.000)", value: 10000000, shareValue: 1000, tip: "Capital medio" },
  { label: "Alto ($50.000.000)", value: 50000000, shareValue: 1000, tip: "Capital alto" },
  { label: "Personalizado", value: 0, shareValue: 1000, tip: "Define tu propio capital" },
];
