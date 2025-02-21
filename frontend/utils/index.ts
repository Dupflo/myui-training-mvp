export function jsonToFormData(json: object) {
  const formData = new FormData();

  Object.entries(json).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

export function generateRandomPassword(
  length: number = 12,
  options: {
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    specialChars?: boolean;
  } = {}
): string {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    specialChars = true,
  } = options;

  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialCharacters = "!@#$%^&*()_+[]{}|;:',.<>?";

  let characterPool = "";

  if (uppercase) characterPool += upperCaseChars;
  if (lowercase) characterPool += lowerCaseChars;
  if (numbers) characterPool += numberChars;
  if (specialChars) characterPool += specialCharacters;

  if (!characterPool) {
    throw new Error("At least one character type must be enabled.");
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length);
    password += characterPool[randomIndex];
  }

  return password;
}

export const hexToRgbCssVariable = (hex: string): string | undefined => {
  if (hex) {
    const color = hex.replace(/#/g, '')
    const r = parseInt(color.slice(0, 2), 16)
    const g = parseInt(color.slice(2, 4), 16)
    const b = parseInt(color.slice(4, 6), 16)
    return `${r}, ${g}, ${b};`
  }
}

export const hexToHslCssVariable = (hex: string): string | undefined => {
  if (hex) {
    const color = hex.replace(/#/g, '');
    const r = parseInt(color.slice(0, 2), 16) / 255;
    const g = parseInt(color.slice(2, 4), 16) / 255;
    const b = parseInt(color.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h}, ${s}%, ${l}%;`;
  }
}

export const isDarkBackground = (color: string) => {
  // Convertir la couleur en RGB si elle est en hexadécimal
  let r, g, b;
  if (color.startsWith("#")) {
    const bigint = parseInt(color.slice(1), 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (match) {
      [r, g, b] = match.map(Number);
    } else {
      console.error("Format de couleur RGB non valide");
      return;
    }
  } else {
    console.error("Format de couleur non pris en charge");
    return;
  }

  // Luminance relative (formule de perception)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  if (luminance < 0.5) return hexToHslCssVariable("#ffffff")
  return hexToHslCssVariable("#000000")
}