import logoWhite from "../../assets/logo-white.png";

export type LogoProps = {
  /** Classe utilitária p/ tamanho. Sem ela, usa o tamanho original do arquivo. */
  className?: string;
};

/**
 * Logo AppBiT — versão branca (para fundos escuros).
 * Sem `className`, renderiza no tamanho original (131×43).
 * TODO: quando houver a versão escura, adicionar prop `variant`.
 */
export function Logo({ className }: LogoProps) {
  return <img src={logoWhite} alt="AppBiT" className={className} />;
}
