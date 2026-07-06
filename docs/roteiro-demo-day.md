# 🎤 Roteiro do Demo Day — App BiT (Equipo 17)

> **Demo Day: 10/07/2026** · Pitch de **até 5 min, em ESPANHOL** · Estrutura: 2 slides lidos
> (dor + solução) → demo ao vivo do site → tração → pedido (QR).
> **Total falado: 538 palavras (+24 da linha reserva, só se a IA demorar) ≈ 4:08–4:19 a 130 ppm
> + ~30 s de interação não coberta pela fala ≈ 4:38–4:49** (folga de ~11–22 s; o corte seguro rende +6 s).
> ⚠️ A consulta à IA leva **15–30 s** — todo esse tempo é coberto por fala (explicação técnica + linha reserva).

**Como usar este roteiro:**
- O que está `[entre colchetes]` é ação/palco — **não se lê em voz alta** (não conta palavra).
- Ritmo de referência: espanhol de apresentação memorizada ≈ **130 palavras/min**.
- Decorar por bloco; cada bloco tem contagem e tempo próprios. Se estourar o tempo, o corte
  seguro é a última frase da Tração (Brasil/Angola).

---

## SLIDE 1 — El Dolor · 61 palavras · ~30 s

**No slide (poucas palavras):**
> **Las políticas públicas llegan tarde.**
> · Datos dispersos que no se cruzan · Sin mapa de las desigualdades
> · Consultar exige SQL · Decisiones por intuición

**Guion (decorar):**

> Hola, somos el Equipo 17. ¿Cómo decide un gestor público dónde invertir en inclusión
> digital? Hoy, con intuición. Los datos existen, pero están dispersos en fuentes que no se
> cruzan, sin visualización geográfica, y consultarlos exige saber SQL. Resultado: las
> políticas llegan tarde, a los lugares equivocados, y la desigualdad se profundiza antes de
> que alguien la vea en un mapa.

---

## SLIDE 2 — La Solución · 115 palavras · ~55 s

**No slide:**
> **App BiT — Panel de Datos Públicos con IA**
> Pregunta en lenguaje natural → **mini-paper**: afirmación + evidencias + fuentes + nivel de confianza → PDF
> IA **anclada** en datos reales (Vísent CDRView, 132 antenas) · PWA · PT/ES/EN

**Guion:**

> Por eso creamos App BiT: un panel de datos públicos con inteligencia artificial. Pensemos
> en Carla, coordinadora de inclusión digital. Ella no escribe SQL — simplemente pregunta,
> en su idioma: "¿Dónde hay mucha gente con mala cobertura de red?". Y la IA le responde
> con un mini-paper: una afirmación, las evidencias con números reales, las fuentes citadas
> y el nivel de confianza. Exportable en PDF para llevar a la reunión del Consejo.
>
> ¿Y por qué confiar? Porque la IA está anclada en datos reales — el dataset Vísent
> CDRView, 132 antenas reales de Florianópolis — y nunca inventa un número. En la demo les
> muestro cómo. Los dashboards muestran datos; App BiT entrega la decisión fundamentada y
> citable.

---

## DEMO AO VIVO (no site) · 186 palavras (+24 reserva) · ~2 min com a carga da IA

**Roteiro de tela:** app já aberta no mapa (tema *Visión general*) → filtro *Cobertura de red* →
filtro *Movilidad* → barra de IA → pergunta → paper → Exportar PDF → fechar **citando as seções
mockadas como roadmap**. **Não abrir Analytics/Reports** (dados de exemplo) — elas são *citadas*
de propósito no encerramento, com enquadramento honesto ("datos de ejemplo… ruta del producto");
opcional abrir o sino de notificações por ~2 s enquanto fala.

**Guion:**

> `[App aberta no mapa, tema "Visión general"]`
> Esto es App BiT, en vivo, instalable como app en el celular. Este es el mapa de
> Florianópolis: 56 barrios, y cada pin indica si el barrio está monitoreado — en total,
> 132 antenas reales.
>
> `[Trocar filtro para "Cobertura de red"]`
> Cambio el filtro: calidad de red por zona, con la congestión medida — y en rojo, las
> zonas sin datos.
>
> `[Trocar filtro para "Movilidad"]`
> Y aquí, movilidad: cómo se mueven las personas entre zonas.
>
> Ahora, la pregunta de Carla.
> `[Clicar na barra de IA e digitar:]`
> "¿Dónde hay concentración de personas pero cobertura de red precaria?"
>
> `[Enviar. A consulta leva 15–30 s — a explicação técnica (~20 s) cobre o início; se o
> resultado aparecer antes de terminar, seguir falando e só então apresentá-lo:]`
> Mientras carga, el secreto técnico: el frontend nunca habla con la IA. Nuestro endpoint
> recibe la pregunta, filtra del dataset solo los datos relevantes, y se los envía a la IA
> con un formato obligatorio. Recibimos la respuesta estructurada — redactada únicamente
> con esos datos.
>
> `[LINHA RESERVA (~11 s) — falar SÓ SE ainda estiver carregando:]`
> Esta espera es el precio de una respuesta verificada — no una frase pre-armada. Y llega
> en el idioma que elijan: portugués, español o inglés.
>
> `[Apresentar o resultado na tela]`
> Y aquí está el mini-paper: afirmación, evidencias con valores, fuentes y nivel de
> confianza.
>
> `[Clicar em Exportar]`
> Y con un clic, el PDF listo para la reunión. Todo esto salió de la API en vivo.
>
> `[Apontar para a sidebar (notificações/reportes/alertas); opcional: abrir o sino de
> notificações por ~2 s enquanto fala]`
> Y las secciones que no abrí — notificaciones, reportes, alertas — ya están diseñadas con
> datos de ejemplo: son la ruta del producto. Imaginen alertas automáticas cuando un
> indicador cae debajo de un umbral.

---

## TRAÇÃO E VALIDAÇÃO (falada sobre a app; slide opcional) · 120 palavras · ~1 min

**Guion:**

> No es solo teoría. En tres semanas, un equipo de tres personas construyó esto: los cinco
> requisitos del MVP, completos — pipeline de ingestión, IA en lenguaje natural, mapa,
> interfaz responsiva y documentación. Y sumamos opcionales: exportación en PDF y la app
> completa en tres idiomas — portugués, español e inglés.
>
> Todo corre sobre el dataset oficial Vísent CDRView: 132 antenas reales de Anatel, 27
> zonas, 7 municipios y 200 mil suscriptores anonimizados — privacidad por diseño.
>
> Está desplegada en la nube, con integración continua, y la arquitectura ya está preparada
> para enchufar nuevas fuentes: IBGE, DATASUS, OMS. El mismo panel sirve para cualquier
> región — de Brasil o de Angola. Lo que ven hoy no es un prototipo de diapositivas: es
> software funcionando.

---

## O PEDIDO — CTA (slide final com QR) · 56 palavras · ~30 s

**No slide:** logo + **QR code apontando para a URL do `appbit-web` no Render** + "Pruébenla ahora".

**Guion:**

> No venimos a pedir inversión — venimos a pedir preguntas. App BiT está en línea ahora
> mismo: escaneen el código QR, instálenla, pregunten en su idioma y expórtennos su primer
> paper. Su feedback define las próximas fuentes de datos. Porque los datos ya existen; lo
> que faltaba era una herramienta para escucharlos. Somos el Equipo 17. Gracias.

---

## Contagem oficial (exigência: pitch ≤ 5 min)

| Bloco | Palavras faladas | Tempo (130 ppm) |
|---|---|---|
| 1. El Dolor (slide 1) | 61 | ~30 s |
| 2. La Solución (slide 2) | 115 | ~55 s |
| 3. Demo ao vivo | 186 (fala cobre ~20 s da carga; fecha com o roadmap das seções mockadas) | ~1 min 55 s |
| — linha reserva (só se a IA demorar) | +24 | +11 s |
| 4. Tracción y validación | 120 | ~55 s |
| 5. El Pedido (CTA) | 56 | ~25 s |
| **Total** | **538 (pior caso 562)** | **~4:38–4:49** ✅ |

A carga da IA (15–30 s) fica **integralmente coberta por fala**: explicação técnica (~20 s) +
linha reserva (~11 s) = até ~31 s sem silêncio no palco.

---
