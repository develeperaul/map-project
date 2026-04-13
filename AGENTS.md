# Map Project

Vue 3 + Yandex Maps 3 + Pinia + Router + Tailwind

## Текущее состояние

### Работающие компоненты
- YMaps 3 подключен через vuefy
- MapView.vue - карта с маркерами
- ProjectCard.vue - карточка проекта
- Button.vue - кнопки с variants (primary, secondary, base, outline, ghost, white) и sizes (sm, md, lg, xl)
- Pinia store (map.ts) - управление категориями и маркерами
- Tailwind v4 с дизайн-токенами из Figma

### Структура
```
src/
├── lib/ymaps.ts           # Yandex Maps 3 vuefy wrapper
├── stores/map.ts         # Pinia store (категории, маркеры)
├── data/mock.ts           # Mock данные (5 маркеров на category)
├── styles/tokens.ts       # Дизайн-токены из Figma
├── style.css              # Tailwind v4 с @theme
├── components/
│   ├── MapView.vue        # Карта с маркерами
│   ├── ProjectCard.vue    # Карточка проекта
│   └── Button.vue         # Кнопка (variants, sizes)
├── views/
│   ├── MapPage.vue        # Страница /map
│   ├── UIKitPage.vue      # Демо UI компонентов
│   └── AuthView.vue       # Авторизация
├── router/index.ts        # Роутер с ?category= param
├── App.vue
└── main.ts
```

## Figma

### Подключение

**Figma API Token:** `figd_SLFHhJyS5rLlZIFxYA8zesb8BY5D5eOJNw5qdvgH`

**File IDs:**
- Основной: `hmbogrvJZng3RN8zgdAES4`
- Копия: `piCpcnHZxTrn1Ove4z0JwM`

### Как читать из Figma

#### Через curl (REST API)
```bash
curl -s -H "X-Figma-Token: figd_SLFHhJyS5rLlZIFxYA8zesb8BY5D5eOJNw5qdvgH" \
  "https://api.figma.com/v1/files/{FILE_ID}/nodes?ids={NODE_ID}"
```

Пример получения UI-Kit (node 348:50950):
```bash
curl -s -H "X-Figma-Token: figd_SLFHhJyS5rLlZIFxYA8zesb8BY5D5eOJNw5qdvgH" \
  "https://api.figma.com/v1/files/piCpcnHZxTrn1Ove4z0JwM/nodes?ids=348:50950"
```

#### Через MCP (VS Code)
В VS Code установлен MCP для Figma. Используй task с subagent_type: explore для получения данных.

### UI-Kit (node 348:50950)
- Проекты, Путешествия, Спорт - категории
- Chips, Tabs, Text Field, Button, Badge

### Desktop экраны (node 174:3461)
- Карта + Карточка проекта (305:21009)
- Проекты - Фильтр (307:18162)
- Авторизация (313:28507)

### Mobile (node 286:16774)
- Главный экран, Проекты - Список + Карта

## Tailwind v4 Design Tokens

### Colors
```css
@theme {
  --color-primary: #4527A0;
  --color-primary-hover: #7A30A8;
  --color-primary-20: rgba(69, 39, 160, 0.2);
  --color-primary-80: rgba(69, 39, 160, 0.8);
  --color-primary-10: rgba(69, 39, 160, 0.1);
  
  --color-secondary: #9C27B0;
  --color-secondary-75: rgba(156, 39, 176, 0.75);
  --color-secondary-85: rgba(156, 39, 176, 0.85);
  
  --color-base-00: #F9F6FA;
  --color-base-01: #EBE3EF;
  --color-base-02: #FDE6F3;
  
  --color-text-00: #1A1A1A;
  --color-text-01: #6B6375;
  --color-text-02: #A7A7A7;
  
  --color-white: #FFFFFF;
  --color-border: #E5E4E7;
}
```

### Border Radius
- button: 8px
- card: 16px
- chip: 20px

### Button Sizes & Padding
| Size | Height | Padding |
|------|--------|---------|
| sm   | 24px   | 10px    |
| md   | 32px   | 10px    |
| lg   | 48px   | 12px    |
| xl   | 48px   | 16px    |

## Запуск

```bash
npm run dev -- --host 0.0.0.0
```

## Ключевые моменты

1. **Top-level-await** в `lib/ymaps.ts` - обязательно для работы vuefy
2. **Vite config** - нужен alias для vue: `vue/dist/vue.esm-bundler.js`
3. **index.html** - скрипт Yandex Maps должен загружаться ДО Vue приложения
4. **VPN** - Yandex Maps API не работает через VPN
5. **Tailwind v4** - использует `@theme` директиву в CSS, НЕ tailwind.config.js