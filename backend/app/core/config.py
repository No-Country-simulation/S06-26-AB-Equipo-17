from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuração lida de variáveis de ambiente / arquivo .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ai_api_key: str = ""  # chave do Gemini (plugar pra ativar a IA)
    ai_model: str = "gemini-3.5-flash"
    ai_fallback_model: str = "gemini-3.5-flash-lite"  # usado se o principal der 503/429
    frontend_origin: str = "http://localhost:5173"
    port: int = 8000


settings = Settings()
