import { MapFilterButton } from "@/components/MapFilterButton";
import { cx, styles } from "./MapFilterBar.styles";

export type MapFilterItem = {
  /** Valor único do tema (usado em value/onChange). */
  value: string;
  /** Rótulo exibido (ex.: "Visão Geral") — já traduzido pelo call-site. */
  label: string;
  disabled?: boolean;
};

export type MapFilterBarProps = {
  items: MapFilterItem[];
  /** Valor do tema ativo. */
  value: string;
  onChange?: (value: string) => void;
  /** Rótulo acessível do conjunto de filtros. */
  "aria-label"?: string;
  className?: string;
};

/**
 * Faixa de filtros temáticos sobre o mapa (Visão Geral, Educação, Saúde...).
 * Apenas seleciona o tema; o filtro dos dados do mapa fica em quem consome
 * (o `/mapa` traz tudo e a página filtra pelo `value`).
 */
export function MapFilterBar({
  items,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: MapFilterBarProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx(styles.bar, className)}>
      {items.map((item) => (
        <MapFilterButton
          key={item.value}
          active={item.value === value}
          disabled={item.disabled}
          onClick={() => onChange?.(item.value)}
        >
          {item.label}
        </MapFilterButton>
      ))}
    </div>
  );
}
