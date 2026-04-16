# Map Project

Vue 3 + Yandex Maps 3 + Pinia + Router + Tailwind

## Текущее состояние

### Работающие компоненты
- YMaps 3 подключен через vuefy
- MapView.vue - карта с маркерами и синхронизацией selection → mapCenter/mapZoom
- Cards/Index.vue - контейнер карточек
- Cards/Main.vue - табы категорий + поиск
- Cards/Filter.vue - фильтры (только для projects)
- Cards/List.vue - desktop список элементов, группировка по годам, fake loading, status chips
- Cards/TaskList.vue - список задач проекта + active row + автоскролл
- Cards/Description.vue - desktop detail + slider задач проекта
- Cards/selection.ts - резолвер selection по marker/task id
- CardsMobile/* - мобильная карточная навигация
- Calendar.vue / DateItem.vue - календарь диапазона дат
- EmptyState.vue - универсальное пустое состояние
- Button.vue - кнопки с variants (primary, secondary, base, outline, ghost, white) и sizes (sm, md, lg, xl)
- Input.vue - инпут с иконками
- Chip.vue - чип компонент
- Tabs.vue / TabItem.vue - табы
- BaseIcon.vue - компонент для SVG иконок из спрайта
- Marker.vue - кастомный маркер карты (пин/точка)
- Pinia store (map.ts) - управление категориями, маркерами, фильтрами
- Tailwind v4 с дизайн-токенами из Figma

### Структура
```
src/
├── lib/ymaps.ts              # Yandex Maps 3 vuefy wrapper
├── stores/map.ts            # Pinia store (категории, маркеры, фильтры)
├── data/mock.ts             # Mock данные + типы (Marker, Tag, MarkerImage)
├── composables/useSprite.ts  # Загрузка спрайта иконок
├── styles/tokens.ts         # Дизайн-токены из Figma
├── style.css                # Tailwind v4 с @theme + анимации маркеров
├── assets/icons/            # SVG иконки для спрайта
│   ├── search.svg
│   ├── close.svg
│   ├── check.svg
│   ├── project.svg
│   ├── travel.svg
│   ├── sport.svg
│   └── arrow-left.svg
├── components/
│   ├── MapView.vue         # Карта с маркерами
│   ├── Marker.vue          # Кастомный маркер (пин/точка)
│   ├── BaseIcon.vue        # Компонент иконки
│   ├── Button.vue          # Кнопка
│   ├── Input.vue          # Инпут
│   ├── Chip.vue           # Чип
│   ├── Tabs.vue          # Табы
│   ├── TabItem.vue       # Элемент таба
│   ├── EmptyState.vue     # Пустое состояние
│   ├── Calendar.vue       # Диапазон дат
│   ├── DateItem.vue       # Ячейка календаря
│   └── Cards/
│       ├── Index.vue      # Контейнер карточек
│       ├── Main.vue       # Табы + поиск
│       ├── Filter.vue    # Chips фильтры
│       ├── List.vue      # Desktop список элементов
│       ├── Description.vue # Desktop detail + slider задач
│       ├── TaskList.vue  # Список задач проекта
│       ├── selection.ts  # Selection resolver
│       └── *.spec.ts     # Тесты карточек
│   └── CardsMobile/
│       ├── Index.vue     # Mobile cards container
│       ├── List.vue      # Mobile list
│       ├── Description.vue # Mobile description
│       ├── TaskList.vue  # Mobile task list
│       └── Tabs.vue      # Mobile tabs
├── views/
│   ├── MapPage.vue        # Страница карты
│   ├── UIKitPage.vue      # Демо UI компонентов
│   └── AuthView.vue       # Авторизация
├── router/index.ts        # Роутер
├── App.vue               # Загрузка спрайта
└── main.ts
```

### Типы данных (src/data/mock.ts)
```ts
export interface Marker {
  id: string
  title: string
  description: string
  coordinates: [number, number]
  category: 'projects' | 'travel' | 'sport'
  date: string           // год-месяц-день
  city: string
  tags?: Tag[]
  status?: number | 'completed'  // прогресс (0-100) или завершён
  images: MarkerImage[]
  tasks?: Marker[]     // задачи проекта
}
```

### Логика работы
1. По умолчанию: главная панель видна, карточки скрыты
2. При выборе таба (Проекты/Путешествия/Спорт):
   - карта центруется и зумится на маркеры категории
   - показываются List + Description
   - для projects: + Filter (chips)
3. При клике на проект: открывается TaskList и slider задач в Description
4. При клике на задачу/элемент или маркер на карте: открывается соответствующий item
5. Для `all`-состояния карточки открываются после клика по маркеру, таб не меняется
6. Автоскролл активного элемента ставит его в верх списка
7. Поиск фильтрует по title
8. Анимация карты и маркеров при переключении

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

### UI-Kit (node 348:50950)
- Проекты, Путешествия, Спорт - категории
- Chips, Tabs, Text Field, Button, Badge

### Desktop экраны (node 174:3461)
- Карта + Карточка проекта (305:21009)
- Проекты - Фильтр (307:18162)
- Проекты - Состояния проекта
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
  
  --color-orange: #FF9800;
  --color-purple: #9C27B0;
  
  --color-red: #F44336;
  --color-blue: #2196F3;
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
6. **SVG Sprite** - автоматически генерируется плагином в vite.config.ts из файлов в `src/assets/icons/`
7. **BaseIcon** - компонент для использования иконок из спрайта, принимает name и class для стилей
