import type { Chat, Message } from '@/types';

// ── Mock Chats ───────────────────────────────
export const mockChats: Chat[] = [
  {
    id: '1',
    title: 'Problema de encendido Corolla 2018',
    model: 'gemini-2.0-flash',
    createdAt: '2026-04-25T10:00:00Z',
    updatedAt: '2026-04-25T10:30:00Z',
  },
  {
    id: '2',
    title: 'Cambio de frenos Civic 2020',
    model: 'gemini-2.0-flash',
    createdAt: '2026-04-24T15:00:00Z',
    updatedAt: '2026-04-24T15:45:00Z',
  },
  {
    id: '3',
    title: 'Diagnóstico OBD-II Mazda 3',
    model: 'gemini-2.0-flash',
    createdAt: '2026-04-23T09:00:00Z',
    updatedAt: '2026-04-23T09:20:00Z',
  },
];

// ── Mock Messages ────────────────────────────
export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      chatId: '1',
      role: 'user',
      content: 'Tengo un Toyota Corolla 2018 que no enciende bien en las mañanas, ¿qué puede ser?',
      sources: null,
      model: null,
      tokenCount: null,
      createdAt: '2026-04-25T10:00:00Z',
    },
    {
      id: 'm2',
      chatId: '1',
      role: 'assistant',
      content: `## Posibles causas de arranque difícil en frío — Toyota Corolla 2018

Hay varias razones por las que tu Corolla podría tener problemas de encendido en frío:

1. **Bujías desgastadas** — Las bujías originales del Corolla 2018 (motor 2ZR-FE) son de iridio y duran ~100,000 km, pero pueden degradarse antes en condiciones extremas.

2. **Sensor de temperatura del refrigerante (ECT)** — Si envía una señal incorrecta, la ECU no enriquece la mezcla correctamente para el arranque en frío.

3. **Batería débil** — Una batería con menos de 12.4V en reposo puede causar arranque lento.

### Diagnóstico rápido:
| Prueba | Herramienta | Valor esperado |
|--------|------------|----------------|
| Voltaje batería | Multímetro | ≥ 12.6V en reposo |
| Bujías | Inspección visual | Gap 1.0-1.1mm |
| Código OBD | Scanner | Sin códigos P0xxx |

¿Ya revisaste alguno de estos puntos?`,
      sources: [
        {
          title: 'Toyota Corolla 2018 - Manual de Servicio',
          url: 'https://www.toyota.com/owners/resources/warranty-owners-manuals/corolla/2018',
        },
        {
          title: 'Problemas comunes de arranque en frío - AutoZone',
          url: 'https://www.autozone.com/diy/ignition/cold-start-problems',
        },
      ],
      model: 'gemini-2.0-flash',
      tokenCount: 245,
      createdAt: '2026-04-25T10:00:05Z',
    },
  ],
  '2': [
    {
      id: 'm3',
      chatId: '2',
      role: 'user',
      content: '¿Cada cuánto se deben cambiar los frenos de un Honda Civic 2020?',
      sources: null,
      model: null,
      tokenCount: null,
      createdAt: '2026-04-24T15:00:00Z',
    },
    {
      id: 'm4',
      chatId: '2',
      role: 'assistant',
      content: `## Intervalos de cambio de frenos — Honda Civic 2020

### Pastillas de freno
- **Delanteras:** Cada **40,000 - 60,000 km** dependiendo del estilo de conducción
- **Traseras:** Cada **50,000 - 80,000 km** (menos desgaste que las delanteras)

### Discos de freno
- **Delanteros:** Cada **80,000 - 100,000 km** o cuando el grosor esté por debajo de **22mm**
- **Traseros:** Cada **100,000 - 120,000 km** o bajo **9mm** de grosor

### Señales de que necesitas cambiarlos:
- 🔊 Sonido metálico al frenar
- 📏 Pedal de freno más largo de lo normal
- 🔄 Vibración en el volante al frenar
- ⚠️ Luz de freno en el tablero

> **Tip:** Siempre mide el grosor de las pastillas con un calibrador. Si tienen menos de **3mm**, cámbialas inmediatamente.`,
      sources: [
        {
          title: 'Honda Civic 2020 Maintenance Schedule',
          url: 'https://www.honda.com/owners/maintenance-schedule',
        },
      ],
      model: 'gemini-2.0-flash',
      tokenCount: 198,
      createdAt: '2026-04-24T15:00:04Z',
    },
  ],
  '3': [],
};

// ── Mock Stream Response ─────────────────────
export const mockStreamResponse = `## Procedimiento para cambiar bujías — Toyota Corolla 2018 (Motor 2ZR-FE)

### Herramientas necesarias:
- Llave de bujías de **16mm** (5/8")
- Extensión de 6"
- Ratchet 3/8"
- Calibrador de gap
- Torquímetro

### Pasos:

1. **Desconecta la batería** — Terminal negativo primero para evitar cortocircuitos.
2. **Retira la cubierta del motor** — Tiene 4 clips de presión, jala hacia arriba.
3. **Desconecta las bobinas de encendido** — Presiona el seguro del conector y jala suavemente.
4. **Retira los tornillos de las bobinas** — 1 tornillo de 10mm por bobina (4 en total).
5. **Saca las bobinas** — Jala hacia arriba con firmeza pero sin forzar.
6. **Retira las bujías** — Con la llave de 16mm, gira en sentido antihorario.
7. **Verifica el gap** de las bujías nuevas — Debe ser **1.0-1.1mm** según especificación Toyota.
8. **Instala las nuevas** — Enrosca a mano primero para no dañar la rosca, luego aprieta con torquímetro.
9. **Reinstala todo** en orden inverso (bobinas → tornillos → conectores → cubierta).

> ⚠️ **Importante:** No uses anti-seize en bujías de iridio. El torque correcto es **18 N·m** (13 lb·ft).

### Bujías recomendadas:
| Marca | Modelo | Precio aprox. |
|-------|--------|--------------|
| NGK | ILKAR7B11 | $8-12 USD c/u |
| Denso | FK16HR-A8 | $7-10 USD c/u |

Ambas son de iridio y cumplen especificación OEM.`;

export const mockStreamSources = [
  {
    title: 'Toyota 2ZR-FE Spark Plug Replacement Guide',
    url: 'https://www.toyota.com/service/spark-plugs',
  },
  {
    title: 'NGK Iridio IX - Especificaciones técnicas',
    url: 'https://www.ngk.com/spark-plugs/iridium-ix',
  },
  {
    title: 'Torque Specifications - Toyota Corolla',
    url: 'https://www.toyotanation.com/threads/torque-specs.123456/',
  },
];
