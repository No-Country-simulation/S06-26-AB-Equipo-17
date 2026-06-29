import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Junta classes (clsx) e resolve conflitos do Tailwind (tailwind-merge).
 *  Usado pelos componentes do shadcn (components/ui). Nos componentes à mão
 *  do nosso DS seguimos com o `cx` local. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
