<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'
import CalendarPickerDropdown from './CalendarPickerDropdown.vue'

interface Props {
  modelValue?: { start: Date | null; end: Date | null } | null
  mode?: 'single' | 'range'
  showActions?: boolean
  minDate?: Date | null
  maxDate?: Date | null
}

type RangeValue = { start: Date | null; end: Date | null }

type CalendarDay = {
  day: number
  date: Date
  isOtherMonth: boolean
}

type CalendarWeek = {
  id: number
  days: CalendarDay[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ start: null, end: null }),
  mode: 'range',
  showActions: false,
  minDate: null,
  maxDate: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: RangeValue | null]
  apply: [value: RangeValue | null]
  reset: []
}>()

const weekdayLabels = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']
const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const defaultMinDate = new Date(2020, 0, 1)
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

const effectiveMinDate = computed(() => startOfDay(props.minDate ?? defaultMinDate))
const effectiveMaxDate = computed(() => startOfDay(props.maxDate ?? new Date()))
const clampedMaxDate = computed(() => {
  const today = startOfDay(new Date())
  return effectiveMaxDate.value < today ? effectiveMaxDate.value : today
})

const clampDate = (date: Date) => {
  const normalized = startOfDay(date)
  if (effectiveMinDate.value > clampedMaxDate.value) {
    return clampedMaxDate.value
  }

  if (normalized < effectiveMinDate.value) return effectiveMinDate.value
  if (normalized > clampedMaxDate.value) return clampedMaxDate.value
  return normalized
}

const currentDate = ref(startOfMonth(clampDate(props.modelValue?.start ?? new Date())))
const hoverDate = ref<Date | null>(null)
const activePicker = ref<'month' | 'year' | null>(null)
const tempRange = ref<RangeValue>({
  start: props.modelValue?.start ?? null,
  end: props.modelValue?.end ?? null,
})

const syncStateFromProps = () => {
  const value = props.modelValue
  tempRange.value = {
    start: value?.start ?? null,
    end: value?.end ?? null,
  }
  hoverDate.value = null

  const nextDate = value?.start ?? new Date()
  currentDate.value = startOfMonth(clampDate(nextDate))
}

watch(() => props.modelValue, syncStateFromProps, { deep: true, immediate: true })
watch(() => [props.minDate, props.maxDate], syncStateFromProps, { immediate: true })

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => monthNames[currentMonth.value])
const monthPickerOpen = computed({
  get: () => activePicker.value === 'month',
  set: (value: boolean) => {
    activePicker.value = value ? 'month' : null
  },
})
const yearPickerOpen = computed({
  get: () => activePicker.value === 'year',
  set: (value: boolean) => {
    activePicker.value = value ? 'year' : null
  },
})
const monthOptions = computed(() => monthNames.map((month, index) => ({
  label: month,
  selected: index === currentMonth.value,
  value: index,
})))
const yearOptions = computed(() => {
  const minYear = effectiveMinDate.value.getFullYear()
  const maxYear = clampedMaxDate.value.getFullYear()
  const years: number[] = []

  for (let year = minYear; year <= maxYear; year += 1) {
    years.push(year)
  }
  return (years.length ? years : [currentYear.value]).map(year => ({
    label: String(year),
    selected: year === currentYear.value,
    value: year,
  }))
})

const canGoPrevMonth = computed(() => {
  const prevMonth = startOfMonth(new Date(currentYear.value, currentMonth.value - 1, 1))
  return endOfMonth(prevMonth) >= effectiveMinDate.value && prevMonth <= clampedMaxDate.value
})

const canGoNextMonth = computed(() => {
  const nextMonth = startOfMonth(new Date(currentYear.value, currentMonth.value + 1, 1))
  return nextMonth <= clampedMaxDate.value && endOfMonth(nextMonth) >= effectiveMinDate.value
})

const formatDate = (date: Date) =>
  `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`

const displayRangeText = computed(() => {
  const { start, end } = tempRange.value

  if (start && end) {
    return `${formatDate(start)} - ${formatDate(end)}`
  }

  if (start) {
    return `${formatDate(start)} - ...`
  }

  return 'Не выбран'
})

const activeRange = computed<RangeValue>(() => {
  const { start, end } = tempRange.value

  if (start && !end && hoverDate.value) {
    return start <= hoverDate.value
      ? { start, end: hoverDate.value }
      : { start: hoverDate.value, end: start }
  }

  return { start, end }
})

const calendarWeeks = computed<CalendarWeek[]>(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekday = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  const weeks: CalendarWeek[] = []
  let weekId = 0
  let currentWeek: CalendarDay[] = []

  const prevMonthLastDay = new Date(year, month, 0).getDate()

  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    currentWeek.push({
      day: prevMonthLastDay - i,
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isOtherMonth: true,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    currentWeek.push({
      day,
      date: new Date(year, month, day),
      isOtherMonth: false,
    })

    if (currentWeek.length === 7) {
      weeks.push({ id: weekId += 1, days: currentWeek })
      currentWeek = []
    }
  }

  let nextMonthDay = 1

  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({
      day: nextMonthDay,
      date: new Date(year, month + 1, nextMonthDay),
      isOtherMonth: true,
    })
    nextMonthDay += 1
  }

  if (currentWeek.length) {
    weeks.push({ id: weekId += 1, days: currentWeek })
  }

  while (weeks.length < 5) {
    const fillerWeek: CalendarDay[] = []

    for (let i = 0; i < 7; i += 1) {
      fillerWeek.push({
        day: nextMonthDay,
        date: new Date(year, month + 1, nextMonthDay),
        isOtherMonth: true,
      })
      nextMonthDay += 1
    }

    weeks.push({ id: weekId += 1, days: fillerWeek })
  }

  return weeks
})

const isSameDay = (left: Date | null, right: Date | null) =>
  !!left && !!right && left.toDateString() === right.toDateString()

const isDisabled = (day: CalendarDay) =>
  day.isOtherMonth
  || day.date < effectiveMinDate.value
  || day.date > clampedMaxDate.value

const isSelected = (date: Date) =>
  isSameDay(activeRange.value.start, date) || isSameDay(activeRange.value.end, date)

const isInRange = (date: Date) => {
  const { start, end } = activeRange.value

  if (!start || !end) return false
  return date > start && date < end
}

const isRangeStart = (date: Date) => isSameDay(activeRange.value.start, date)
const isRangeEnd = (date: Date) => isSameDay(activeRange.value.end, date)

const prevMonth = () => {
  if (!canGoPrevMonth.value) return
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  if (!canGoNextMonth.value) return
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const selectMonth = (monthIndex: number) => {
  currentDate.value = startOfMonth(clampDate(new Date(currentYear.value, monthIndex, 1)))
  activePicker.value = null
}

const selectYear = (year: number) => {
  currentDate.value = startOfMonth(clampDate(new Date(year, currentMonth.value, 1)))
  activePicker.value = null
}

const selectDate = (day: CalendarDay) => {
  if (isDisabled(day)) return

  if (!tempRange.value.start || tempRange.value.end) {
    tempRange.value = { start: day.date, end: null }
    hoverDate.value = null
    return
  }

  const start = tempRange.value.start
  if (!start) return

  tempRange.value = start <= day.date
    ? { start, end: day.date }
    : { start: day.date, end: start }

  emit('update:modelValue', tempRange.value)
}

const onDateHover = (day: CalendarDay) => {
  if (tempRange.value.start && !tempRange.value.end && !isDisabled(day)) {
    hoverDate.value = day.date
  }
}

const handleApply = () => {
  const value = tempRange.value.start && tempRange.value.end
    ? { start: tempRange.value.start, end: tempRange.value.end }
    : { start: null, end: null }

  emit('update:modelValue', value)
  emit('apply', value)
}

const handleReset = () => {
  tempRange.value = { start: null, end: null }
  hoverDate.value = null
  emit('update:modelValue', { start: null, end: null })
  emit('reset')
}
</script>

<template>
  <div class="w-full max-w-[380px]">
    <div class="space-y-4">
      <h3 class="text-[16px] font-font-medium leading-6 text-text-00">Календарь</h3>

      <div >
        <p class="text-xs leading-4 text-text-02">Выбранный период</p>
        <p class="text-[16px] leading-6 text-text-00">{{ displayRangeText }}</p>
      </div>
    </div>

    <div class="relative mt-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <CalendarPickerDropdown
          v-model:open="monthPickerOpen"
          :label="currentMonthName"
          :options="monthOptions"
          @select="selectMonth"
        />

        <CalendarPickerDropdown
          v-model:open="yearPickerOpen"
          :label="String(currentYear)"
          :options="yearOptions"
          @select="selectYear"
        />
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="cursor-pointer flex h-10 w-10 items-center justify-center rounded-[10px] bg-base-00 text-text-00 transition-colors hover:bg-base-01 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canGoPrevMonth"
          aria-label="Предыдущий месяц"
          @click="prevMonth"
        >
          <BaseIcon name="caret-left" class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="cursor-pointer flex h-10 w-10 items-center justify-center rounded-[10px] bg-base-00 text-text-00 transition-colors hover:bg-base-01 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canGoNextMonth"
          aria-label="Следующий месяц"
          @click="nextMonth"
        >
          <BaseIcon name="caret-right" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="mt-3 border-t border-border pt-1">
      <div class="grid grid-cols-7">
        <div
          v-for="weekday in weekdayLabels"
          :key="weekday"
          class="flex h-10 items-center justify-center text-[16px] leading-6 text-text-02"
        >
          {{ weekday }}
        </div>
      </div>

      <div
        v-for="week in calendarWeeks"
        :key="week.id"
        class="grid grid-cols-7"
      >
        <div
          v-for="day in week.days"
          :key="day.date.toISOString()"
          class="relative flex h-12 items-center justify-center"
          @mouseenter="onDateHover(day)"
        >
          <div
            v-if="isInRange(day.date)"
            class="absolute inset-y-1 left-0 right-0 bg-base-00 "
          />
          <div
            v-if="isRangeStart(day.date) && !isRangeEnd(day.date)"
            class="absolute inset-y-1 left-1/2 right-0 bg-base-00 "
          />
          <div
            v-if="isRangeEnd(day.date) && !isRangeStart(day.date)"
            class="absolute inset-y-1 left-0 right-1/2 bg-base-00 "
          />

          <button
            type="button"
            class="relative z-10 flex h-10 w-10 items-center justify-center rounded-[10px] text-[16px] leading-6 transition-colors"
            :class="[
              isSelected(day.date) && 'bg-primary text-white',
              !isSelected(day.date) && isDisabled(day) && 'text-text-02',
              !isSelected(day.date) && !isDisabled(day) && 'text-text-00 hover:bg-base-00',
            ]"
            :disabled="isDisabled(day)"
            @click="selectDate(day)"
          >
            {{ day.day }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showActions" class="mt-4 flex gap-2">
      <button
        type="button"
        class="h-10 flex-1 rounded-button bg-base-01 text-sm font-medium text-text-00 transition-colors hover:bg-border"
        @click="handleReset"
      >
        Сбросить
      </button>
      <button
        type="button"
        class="h-10 flex-1 rounded-button bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!tempRange.start || !tempRange.end"
        @click="handleApply"
      >
        Применить
      </button>
    </div>
  </div>
</template>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
