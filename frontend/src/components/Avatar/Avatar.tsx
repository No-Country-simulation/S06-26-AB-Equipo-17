import { cx, styles } from "./Avatar.styles";
import { sizeStyles, type AvatarSize } from "./Avatar.states";

/** Extrai até 2 iniciais do nome (primeiro + último; ou 2 primeiras letras). */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type AvatarProps = {
  /** Nome do usuário — gera as iniciais e o alt da imagem. */
  name: string;
  /** Tamanho (default: md). */
  size?: AvatarSize;
  /** Imagem opcional; sem ela, mostra as iniciais. */
  src?: string;
  /** Texto alternativo da imagem (default: name). */
  alt?: string;
};

/**
 * Avatar do usuário — círculo azul com iniciais (ou imagem).
 * Tamanhos: sm (32) · md (40) · lg (48).
 */
export function Avatar({ name, size = "md", src, alt }: AvatarProps) {
  return (
    <span className={cx(styles.root, sizeStyles[size])} role="img" aria-label={alt ?? name}>
      {src ? (
        <img src={src} alt={alt ?? name} className={styles.image} />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}
