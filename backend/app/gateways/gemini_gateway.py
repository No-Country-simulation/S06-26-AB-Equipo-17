"""Gateway real — Google Gemini (SDK google-genai, models.generate_content).

Saída estruturada via `response_schema` (modelo Pydantic) + `response_mime_type=json`.
Ref.: https://ai.google.dev/gemini-api/docs/structured-output
"""
from pydantic import BaseModel

from app.core.config import settings


class GeminiGateway:
    def __init__(self) -> None:
        from google import genai  # import lazy (só quando o gateway é usado)
        self._client = genai.Client(api_key=settings.ai_api_key)

    def gerar(self, prompt: str, *, system: str | None = None,
              response_schema: type[BaseModel]) -> str:
        resp = self._client.models.generate_content(
            model=settings.ai_model,
            contents=prompt,
            config={
                "system_instruction": system,
                "response_mime_type": "application/json",
                "response_schema": response_schema,  # o SDK converte o Pydantic (inclusive aninhado)
                "temperature": 0.2,
            },
        )
        return resp.text
