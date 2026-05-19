export function randDigits(n: number): string {
  let out = "";
  for (let i = 0; i < n; i++) out += Math.floor(Math.random() * 10).toString();
  return out;
}

export function makeLastFour(): string {
  return randDigits(4);
}

export function makeFullNumber(lastFour: string): string {
  return `4242 ${randDigits(4)} ${randDigits(4)} ${lastFour}`;
}

export function makeExpiry(yearsAhead = 5): string {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const year = String((now.getUTCFullYear() + yearsAhead) % 100).padStart(2, "0");
  return `${month}/${year}`;
}

export function makeCvv(): string {
  return randDigits(3);
}

export function makeDemoCardSecrets(lastFour: string) {
  return {
    fullNumber: makeFullNumber(lastFour),
    expiry: makeExpiry(5),
    cvv: makeCvv(),
  };
}
