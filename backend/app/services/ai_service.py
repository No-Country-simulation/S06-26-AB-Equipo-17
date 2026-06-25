"""Service de IA — lógica de aplicação (NÃO faz a chamada externa).

Monta o prompt (padrão ANCORADO: usa só os dados recebidos), delega a chamada ao
`AIGateway` e valida a resposta no schema do "paper".
"""
import json

from app.schemas.dados import RespostaPaper
from app.gateways.ai_gateway import AIGateway

_SYSTEM = (
    "Você é um analista de dados públicos para gestores. Responda à PERGUNTA usando "
    "SOMENTE os dados em DADOS_JSON. NUNCA invente números nem fatos. Se os dados não "
    "bastarem, diga isso na 'afirmacao' e use nivel_confianca='baixa'. Cite sempre a "
    "fonte. Escreva no idioma '{idioma}'. Responda estritamente no schema pedido."
)


class AIService:
    def __init__(self, gateway: AIGateway) -> None:
        self._gateway = gateway

    def montar_prompt(self, consulta: str, dados: list[dict], idioma: str) -> str:
        return (
            _SYSTEM.format(idioma=idioma)
            + "\n\nDADOS_JSON:\n"
            + json.dumps(dados, ensure_ascii=False, default=str)
            + "\n\nPERGUNTA:\n"
            + consulta
        )

    def responder(self, consulta: str, dados: list[dict], idioma: str = "pt") -> RespostaPaper:
        prompt = self.montar_prompt(consulta, dados, idioma)
        bruto = self._gateway.gerar(prompt, RespostaPaper.model_json_schema())
        return RespostaPaper.model_validate_json(bruto)
