# Документация по компонентам

## Что это за приложение

Это Vue 3 приложение с картой Yandex Maps 3, Pinia-хранилищем, Vue Router и Tailwind v4.
Главный сценарий: пользователь выбирает категорию, смотрит точки на карте, открывает карточки, фильтрует список и переходит между проектом, задачами и описанием.

## Страницы и маршруты

### `src/router/index.ts`

- `/` - редирект на `/map?category=projects`
- `/map` - основная карта
- `/ui-kit` - демонстрация UI-компонентов

### `src/views/MapPage.vue`

Главная страница приложения.

Состав:

- `MapView` - сама карта
- `Cards/Index` - desktop-панель карточек
- `CardsMobile/Index` - mobile-оверлей

Логика:

- на desktop карта занимает фон, панель карточек висит слева сверху
- на mobile панель карточек заменяется bottom sheet-сценарием

### `src/views/UIKitPage.vue`

Страница для проверки UI-компонентов.

Показывает:

- `Button`
- `Tabs` / `TabItem`
- `Input`
- `Chip`
- `Checkbox`
- `Calendar`
- `BottomSheet`
- тестовые фильтры

### `src/views/AuthView.vue`

Отдельный auth-экран, пока живет отдельно от основного роутера.

Функции:

- проверка email и пароля
- показ ошибок
- имитация загрузки
- переход после успешного submit

## Общая схема

```text
MapPage
  ├─ MapView
  │   ├─ YMap
  │   ├─ YMapMarker
  │   ├─ Marker
  │   └─ ProjectCard
  ├─ Cards/Index (desktop)
  │   ├─ Main
  │   ├─ List
  │   ├─ Filter
  │   ├─ Description
  │   └─ TaskList
  └─ CardsMobile/Index (mobile)
      ├─ Tabs
      ├─ BottomSheet
      ├─ List
      ├─ Search
      ├─ Description
      └─ TaskList
```

## Данные и хранилище

### `src/data/mock.ts`

Базовая схема сущностей:

- `Marker` - любая точка на карте
- `Tag` - тег
- `MarkerImage` - изображение карточки

Ключевые поля `Marker`:

- `id`
- `title`
- `description`
- `coordinates`
- `category`
- `date`
- `city`
- `tags`
- `status`
- `images`
- `tasks`

### `src/stores/map.ts`

Pinia-store управляет всем состоянием карты и карточек.

Обычно хранит:

- текущую категорию
- строку поиска
- выбранный маркер
- центр и zoom карты
- фильтры
- список доступных городов/тегов/видов спорта
- флаг открытия фильтр-панели

## Базовые UI-компоненты

### `BaseIcon.vue`

Назначение:

- рендер иконки из sprite через `<use>`

Как работает:

- принимает `name`
- принимает `class`
- принимает `size`
- вычисляет размер SVG
- пробрасывает click-событие

### `Button.vue`

Назначение:

- универсальная кнопка с вариантами оформления

Как работает:

- `variant` выбирает цветовую схему
- `size` выбирает высоту и padding
- `disabled` блокирует кнопку и меняет стиль
- `loading` показывает спиннер и отключает кнопку
- слоты `leftIcon` и `rightIcon` добавляют иконки

### `Input.vue`

Назначение:

- поле ввода с иконками, очисткой и ошибкой

Как работает:

- хранит локальное `inputValue`
- синхронизирует его с `modelValue`
- отслеживает фокус через `isFocused`
- меняет рамку в зависимости от `disabled`, `error`, focus
- `handleInput()` эмитит `update:modelValue`
- `handleClear()` очищает поле и эмитит `clear`

### `Chip.vue`

Назначение:

- кнопка-чип для фильтров и быстрых переключателей

Как работает:

- `variant` меняет визуальный стиль
- `iconLeft` / `iconRight` добавляют иконки
- `number` показывает счетчик
- `handleClick()` ничего не делает, если `disabled`

### `Checkbox.vue`

Назначение:

- кастомный чекбокс

Как работает:

- строит классы по `size`, `disabled`, `modelValue`
- `handleClick()` переключает значение через `update:modelValue`
- если `modelValue = true`, показывает `check`

### `Tabs.vue`

Назначение:

- контейнер для набора вкладок

Как работает:

- хранит `activeTab`
- через `provide()` передает в `TabItem`:
  - активную вкладку
  - вариант отображения
  - позицию иконки
  - функцию `setActive()`
- эмитит `update:modelValue`

### `TabItem.vue`

Назначение:

- одна вкладка внутри `Tabs`

Как работает:

- получает `TabsContext` через `inject()`
- `isActive()` сравнивает значение с активной вкладкой
- `iconPosition()` читает позицию иконки
- `handleClick()` меняет активную вкладку через контекст

### `EmptyState.vue`

Назначение:

- универсальный empty state

Как работает:

- принимает `icon`, `title`, `description`
- рисует иконку и текст

### `BottomSheet.vue`

Назначение:

- нижняя выезжающая панель для mobile

Как работает:

- монтируется через `Teleport` в `body`
- открывается/закрывается через `v-model`
- `handleStart()`, `handleMove()`, `handleEnd()` реализуют drag-to-close
- `close()` синхронизирует внутреннее состояние и `update:modelValue`

## Карта

### `MapView.vue`

Назначение:

- отрисовка карты, маркеров и активной карточки

Внутренние части:

- `displayedMarkers` - набор маркеров для показа
- `calculateBounds()` - расчет центра и zoom по списку точек
- `onMarkerClick()` - выбор маркера

Watchers:

- `watch(mapStore.category)` - центрирует карту на категории
- `watch(mapStore.selectedMarker)` - приближает карту к выбранной точке

Поток работы:

1. берет данные из Pinia
2. решает, какие точки рисовать
3. рендерит `Marker` внутри `YMapMarker`
4. при выборе открывает `ProjectCard`

### `Marker.vue`

Назначение:

- визуальный маркер на карте

Как работает:

- `categoryConfig` задает цвета, иконку и тип маркера
- `stateClasses` меняет масштаб для default/hover/click
- `isCircle` и `isPin` выбирают форму
- для circle рисуется круглая кнопка
- для pin используется SVG-структура с `foreignObject`

### `ProjectCard.vue`

Назначение:

- простая карточка выбранного маркера поверх карты

Как работает:

- читает `mapStore.selectedMarker`
- `closeCard()` вызывает `clearSelection()`

Это legacy-версия, основная логика сейчас живет в `Cards/*`.

## Desktop-карточки

### `Cards/Index.vue`

Назначение:

- верхний оркестратор всей desktop-панели

Состояние:

- `selectedProject`
- `selectedTaskIndex`
- `showContent`
- `showDescription`
- `showTaskList`
- `selectedProjectTasks`

Функции:

- `applyResolvedSelection()` - переводит кликнутый маркер в проект / задачу / обычную точку
- `handleProjectSelect()` - открывает проект и первую задачу
- `handleBack()` - закрывает проектный режим
- `handleTaskSelect()` - переключает активную задачу
- `handleOpenFilter()` - открывает фильтр-панель

Watchers:

- `watch([selectedProject, selectedTaskIndex])` - синхронизирует активную задачу с картой
- `watch(mapStore.category)` - сбрасывает проектный контекст при смене категории
- `watch(mapStore.selectedMarker)` - подхватывает выбор с карты

### `Cards/Main.vue`

Назначение:

- табы категорий и поиск

Как работает:

- `activeTab` хранит выбранную категорию
- `onMounted()` подхватывает категорию из store
- `watch(activeTab)` пишет категорию в store
- `handleSearch()` обновляет query и сбрасывает выбор
- `getTabClass()` и `getIconClass()` строят стили активного таба

### `Cards/Filter.vue`

Назначение:

- фильтрация списка по дате, локации, типу спорта и тегам

Как работает:

- `showCalendar` открывает календарь
- `tempDateRange` хранит временный выбор
- `dateText` формирует текст для поля даты
- `handleDateApply()` записывает диапазон в store
- `handleDateReset()` и `handleRemoveDate()` очищают дату
- `handleSportTypeToggle()` переключает виды спорта
- `handleTagToggle()` переключает теги
- `handleReset()` сбрасывает локальные и глобальные фильтры
- `handleApply()` переносит локальный выбор в store и применяет фильтрацию

### `Cards/List.vue`

Назначение:

- список элементов категории, сгруппированный по годам

Как работает:

- `markers` берет `filteredMarkers` из store
- `statusChips` считает количество активных и завершенных точек
- `visibleMarkers` применяет `statusFilter`
- `groupedMarkers` группирует точки по году и сортирует по дате
- `handleClick()` либо открывает проект, либо выбирает обычный маркер
- `handleStatusClick()` переключает статус-фильтр
- `handleOpenFilter()` открывает фильтр
- `runFakeLoading()` имитирует перерисовку при смене фильтров
- `scrollToItem()` прокручивает к выбранному элементу

Watchers:

- `watch([markers, selectedStatus])` запускает короткую загрузку
- `watch([selectedMarkerId, markers, isLoading])` прокручивает список к активному элементу

### `Cards/Description.vue`

Назначение:

- правая карточка с подробностями выбранной точки или задачи

Как работает:

- `marker` читает текущий выбор из store
- `hasTasks` понимает, есть ли у элемента дочерние задачи
- `currentTask` выбирает либо текущую задачу, либо сам маркер
- `completedCount` / `totalCount` показывают прогресс проекта
- `displayedDescription` сворачивает длинный текст
- `heroImage` / `secondaryImage` подбирают изображения
- `canGoPrev` / `canGoNext` управляют кнопками навигации
- `handleClose()` очищает выбор
- `toggleExpanded()` раскрывает / сворачивает текст
- `goPrev()` и `goNext()` двигают индекс задачи

### `Cards/TaskList.vue`

Назначение:

- список задач внутри проекта

Как работает:

- `tasks` берет `project.tasks`
- `completedCount` / `totalCount` считают прогресс
- `projectStartYear` и `projectEndLabel` формируют шапку
- `activeTaskId` определяет активную строку
- `handleTaskClick()` эмитит выбор задачи
- `scrollToItem()` держит активную задачу в зоне видимости

Watchers:

- `watch([activeTaskId, tasks])` скроллит к активной задаче

### `Cards/selection.ts`

Назначение:

- мост между кликнутым маркером и правильным сценарием UI

Как работает:

1. сначала проверяет, является ли объект самим проектом
2. если нет, ищет его среди задач всех проектов
3. если не находит, возвращает обычный marker

Это нужно, чтобы один клик мог открыть:

- проект
- задачу проекта
- отдельную точку

## Mobile-карточки

### `CardsMobile/Index.vue`

Назначение:

- координатор мобильного сценария

Состояние:

- `activeTab`
- `showList`
- `showDescription`
- `showSearch`
- `selectedMarker`

Функции:

- `handleOpenList()` / `handleCloseList()` - управление листом
- `handleOpenDescription()` - выбор точки и открытие описания
- `handleCloseDescription()` - закрытие описания и сброс выбора
- `handleOpenSearch()` / `handleCloseSearch()` - управление поиском
- `handleSelectFromSearch()` - выбор из поиска

### `CardsMobile/Tabs.vue`

Назначение:

- мобильные табы категорий

Как работает:

- `handleClick()` выставляет категорию и открывает список
- `getTabClass()` и `getIconClass()` рисуют активное состояние

### `CardsMobile/List.vue`

Назначение:

- мобильный список маркеров

Как работает:

- берет `filteredMarkers`
- показывает поиск сверху
- показывает города-чипы
- по клику эмитит `select`
- `getProgressProps()` строит SVG-progress для активных точек
- `handleOpenFilter()` сейчас заглушка

### `CardsMobile/Search.vue`

Назначение:

- полноэкранный поиск на мобильном

Как работает:

- локальный `searchQuery` синхронизируется с полем ввода
- `watch(searchQuery)` обновляет `mapStore.searchQuery`
- при длине меньше 2 символов список не показывается
- `handleCancel()` очищает поиск и закрывает экран
- `getProgressProps()` строит прогресс для результатов

### `CardsMobile/TaskList.vue`

Назначение:

- упрощенный список задач проекта на mobile

Как работает:

- просто рендерит `project.tasks`
- `formatDate()` сокращает дату до короткого русского формата
- по клику эмитит `select`

### `CardsMobile/Description.vue`

Назначение:

- мобильное описание выбранного маркера

Как работает:

- показывает изображения галереей
- выводит текст, город, дату и теги
- для проекта показывает прогресс или галочку завершения

## Вспомогательные компоненты и демо

### `Calendar.vue`

Назначение:

- календарь диапазона дат

Как работает:

- `currentDate` хранит текущий месяц
- `hoverDate` нужен для preview range
- `tempRange` хранит временный выбор
- `currentYear`, `currentMonth`, `currentMonthName` вычисляют заголовок
- `calendarWeeks` строит сетку дней
- `selectDate()` меняет начало/конец диапазона
- `onDateHover()` подсвечивает диапазон при наведении
- `handleApply()` подтверждает выбор
- `handleReset()` очищает выбор

### `DateItem.vue`

Назначение:

- отдельная ячейка даты для календаря

Как работает:

- строит классы по состояниям selected / inRange / disabled / rangeStart / rangeEnd
- эмитит `click` и `mouseenter`

### `FilterPanel.vue`

Назначение:

- старый общий фильтр-экран с табами, поиском и чекбоксами

Статус:

- выглядит как экспериментальный / альтернативный вариант фильтра

### `TestFilter.vue` и `TestAllFilter.vue`

Назначение:

- тестовые экраны для проверки комбинации фильтров, календаря и чекбоксов

Статус:

- не являются частью основного пользовательского сценария

### `HelloWorld.vue`

Назначение:

- стандартный стартовый экран Vite/Vue

Статус:

- служебный шаблон, не относится к основной архитектуре

## Типичные пользовательские цепочки

### 1. Выбор категории

```text
Main / Tabs
  -> store.category
  -> MapView пересчитывает центр и zoom
  -> List показывает новые точки
```

### 2. Выбор маркера

```text
click marker
  -> mapStore.selectMarker
  -> Cards/Index решает, что открыть
  -> Description или TaskList
  -> MapView подсвечивает выбранную точку
```

### 3. Выбор проекта

```text
List -> project
  -> resolveSelection
  -> selectedProject
  -> первая задача
  -> TaskList + Description синхронизируются
```

### 4. Фильтрация

```text
Filter / Search
  -> store filters
  -> filteredMarkers
  -> List / MapView / Mobile Search обновляются
```

## Кто за что отвечает

- `MapView.vue` - карта и центрирование
- `Cards/Index.vue` - desktop-логика отображения
- `CardsMobile/Index.vue` - mobile-логика отображения
- `selection.ts` - распознавание проекта / задачи / точки
- `stores/map.ts` - единый источник состояния
- `BaseIcon.vue`, `Button.vue`, `Input.vue`, `Chip.vue`, `Tabs.vue` - переиспользуемые UI-блоки

## Короткий вывод

Архитектура строится вокруг одного центра состояния: пользовательское действие идет через компонент, затем в Pinia-store, потом через computed/watchers обновляет карту и правую панель.
