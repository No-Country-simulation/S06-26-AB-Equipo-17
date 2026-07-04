"""Acesso aos dados (pandas) — um módulo por conjunto, interface estável aqui.

`buscar()` = concentração + rede + renda; `buscar_mobilidade()` = fluxos OD;
`buscar_monitoramento()` = referencial de bairros × antenas (overview do mapa).
O molde comum (normalização, filtro, serialização) vive em `base.py`; a regra
de agregação de cada conjunto vive no seu módulo. Conjunto novo (ex. fluxo de
vias) = módulo novo no mesmo molde, re-exportado aqui.
"""

from app.services.dados.concentracao import buscar
from app.services.dados.mobilidade import buscar_mobilidade
from app.services.dados.monitoramento import buscar_monitoramento

__all__ = ["buscar", "buscar_mobilidade", "buscar_monitoramento"]
