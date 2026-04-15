<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  modelValue?: { start: Date | null; end: Date | null } | null
  mode?: 'single' | 'range'
  showActions?: boolean
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

const currentDate = ref(new Date(2026, 1, 1))
const hoverDate = ref<Date | null>(null)
const tempRange = ref<RangeValue>({
  start: props.modelValue?.start ?? new Date(2026, 1, 25),
  end: props.modelValue?.end ?? new Date(2026, 2, 3),
})

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => monthNames[currentMonth.value])

const canGoPrevMonth = computed(() => {
  const prevMonth = new Date(currentYear.value, currentMonth.value - 1, 1)
  return prevMonth >= new Date(2020, 0, 1)
})

const canGoNextMonth = computed(() => {
  const nextMonth = new Date(currentYear.value, currentMonth.value + 1, 1)
  return nextMonth <= new Date(2030, 11, 1)
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

  return '01.01.2024 - 01.01.2025'
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

const isDisabled = (day: CalendarDay) => day.isOtherMonth

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
      <h3 class="text-[16px] font-semibold leading-6 text-text-00">Календарь</h3>

      <div class="space-y-1">
        <p class="text-xs leading-4 text-text-02">Выбранный период</p>
        <p class="text-[16px] leading-6 text-text-00">{{ displayRangeText }}</p>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <button type="button" class="text-sm font-medium leading-5 text-primary underline underline-offset-2">
        {{ currentMonthName }} {{ currentYear }}
      </button>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-[10px] bg-base-00 text-text-01 transition-colors hover:bg-base-01 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canGoPrevMonth"
          aria-label="Предыдущий месяц"
          @click="prevMonth"
        >
          <BaseIcon name="arrow-left" class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-[10px] bg-base-00 text-text-01 transition-colors hover:bg-base-01 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canGoNextMonth"
          aria-label="Следующий месяц"
          @click="nextMonth"
        >
          <BaseIcon name="arrow-left" class="h-5 w-5 rotate-180" />
        </button>
      </div>
    </div>

    <div class="mt-4 border-t border-border pt-2">
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
            class="absolute inset-y-1 left-0 right-0 bg-base-00"
          />
          <div
            v-if="isRangeStart(day.date) && !isRangeEnd(day.date)"
            class="absolute inset-y-1 left-1/2 right-0 bg-base-00"
          />
          <div
            v-if="isRangeEnd(day.date) && !isRangeStart(day.date)"
            class="absolute inset-y-1 left-0 right-1/2 bg-base-00"
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
