"""Gateway real — Google Gemini (SDK google-genai, models.generate_content).

Saída estruturada via `response_schema` (modelo Pydantic) + `response_mime_type=json`.
Client criado de forma lazy: se faltar a chave, o erro acontece em `gerar()` (não na
resolução da dependência) → o `AIService` captura e devolve um "paper" de baixa confiança.

Fallback de modelo: se o principal (`AI_MODEL`) estiver sobrecarregado (5xx) ou com rate
limit (429), tenta o reserva (`AI_FALLBACK_MODEL`). Outros erros (chave inválida, créditos
esgotados — 402) sobem direto: trocar de modelo não resolve, é o mesmo projeto.
Ref.: https://ai.google.dev/gemini-api/docs/structured-output
"""

import logging

from pydantic import BaseModel

from app.core.config import settings

logger = logging.getLogger(__name__)

_TIMEOUT_MS = 30_000  # 30s (HttpOptions.timeout é em milissegundos)


def _vale_tentar_outro_modelo(erro: Exception) -> bool:
    from google.genai import errors

    return isinstance(erro, errors.ServerError) or (
        isinstance(erro, errors.ClientError) and erro.code == 429
    )


class GeminiGateway:
    def __init__(self) -> None:
        self._client = None  # criado na 1ª chamada (lazy)

    def _client_ou_erro(self):
        if self._client is None:
            if not settings.ai_api_key:
                raise RuntimeError("AI_API_KEY ausente — configure a chave do Gemini.")
            from google import genai  # import lazy

            self._client = genai.Client(api_key=settings.ai_api_key)
        return self._client

    def gerar(
        self, prompt: str, *, system: str | None = None, response_schema: type[BaseModel]
    ) -> str:
        modelos = [settings.ai_model]
        if settings.ai_fallback_model and settings.ai_fallback_model != settings.ai_model:
            modelos.append(settings.ai_fallback_model)

        for i, modelo in enumerate(modelos):
            try:
                resp = self._client_ou_erro().models.generate_content(
                    model=modelo,
                    contents=prompt,
                    config={
                        "system_instruction": system,
                        "response_mime_type": "application/json",
                        "response_schema": response_schema,  # o SDK converte o Pydantic (inclusive aninhado)
                        "temperature": 0.2,
                        "http_options": {"timeout": _TIMEOUT_MS},
                    },
                )
                return resp.text
            except Exception as e:
                if i == len(modelos) - 1 or not _vale_tentar_outro_modelo(e):
                    raise
                logger.warning(
                    "Modelo %s indisponível (%s: %s) — tentando %s",
                    modelo,
                    type(e).__name__,
                    str(e)[:200],
                    modelos[i + 1],
                )
        raise AssertionError("inalcançável")
