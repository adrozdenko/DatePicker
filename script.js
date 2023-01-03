import {
	format,
	getUnixTime,
	fromUnixTime,
	addMonths,
	subMonths,
	startOfWeek,
	startOfMonth,
	endOfWeek,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
} from 'date-fns'

const datePickerButton = document.querySelector('.date-picker-button')
const datePicker = document.querySelector('.date-picker')
const datePickerHeaderText = document.querySelector('.current-month')
const datePickerGridHeader = document.querySelector('.date-picker-grid-header')
const prevMonthButton = document.querySelector('.prev-month-button')
const nextMonthButton = document.querySelector('.next-month-button')
const dateGrid = document.querySelector('.date-picker-grid-dates')

let currentDate = new Date()

const WEEK_START = 'Mo' //'Sun', 'Mo', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'

const daysofWeekStart = ['Sun', 'Mo', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

setDate(new Date())

datePickerButton.addEventListener('click', (e) => {
	datePicker.classList.toggle('show')
	const selectedDate = fromUnixTime(datePicker.dataset.selectedDate)
	currentDate = selectedDate
	setupDatePicker(selectedDate)
	addWeekDays(restructureWeek(WEEK_START))
})

nextMonthButton.addEventListener('click', () => {
	const selectedDate = fromUnixTime(datePicker.dataset.selectedDate)
	currentDate = addMonths(currentDate, 1)
	setupDatePicker(selectedDate)
})

prevMonthButton.addEventListener('click', () => {
	const selectedDate = fromUnixTime(datePicker.dataset.selectedDate)
	currentDate = subMonths(currentDate, 1)
	setupDatePicker(selectedDate)
})

function restructureWeek(weekStartDay) {
	const indexOfDay = findIndexOfDay(daysofWeekStart, weekStartDay)

	const daysofWeekStartCopy = [...daysofWeekStart]

	const arr = daysofWeekStartCopy.splice(0, indexOfDay)

	return [...daysofWeekStartCopy, ...arr]
}

function findIndexOfDay(weekDays, weekStartDay) {
	return weekDays.findIndex((day) => day === weekStartDay)
}

function setWeekStartOn(weekDay = WEEK_START) {
	switch (weekDay) {
		case 'Sun':
			return 0
		case 'Mon':
			return 1
		case 'Tue':
			return 2
		case 'Wed':
			return 3
		case 'Thu':
			return 4
		case 'Fri':
			return 5
		case 'Sat':
			return 6
		default:
			return 1
	}
}

function setDate(date) {
	datePickerButton.innerText = format(date, 'MMMM do, yyyy')
	datePicker.dataset.selectedDate = getUnixTime(date)
}

function setupDatePicker(selectedDate) {
	datePickerHeaderText.innerText = format(currentDate, 'MMMM - yyyy')
	setupDates(selectedDate)
}

function setupDates(selectedDate) {
	const firstWeekStart = startOfWeek(startOfMonth(currentDate), {
		weekStartsOn: setWeekStartOn(),
	})
	const lastWeekEnd = endOfWeek(endOfMonth(currentDate), {
		weekStartsOn: setWeekStartOn(),
	})

	const dates = eachDayOfInterval({
		start: firstWeekStart,
		end: lastWeekEnd,
	})

	dateGrid.innerHTML = ''

	dates.forEach((date) => {
		const dateElement = document.createElement('button')

		dateElement.classList.add('date')

		dateGrid.appendChild(dateElement)

		if (!isSameMonth(date, currentDate)) {
			dateElement.classList.add('date-picker-other-month-date')
		}

		if (isSameDay(date, selectedDate)) {
			dateElement.classList.add('selected')
		}

		dateElement.addEventListener('click', (e) => {
			setDate(date)
			datePicker.classList.remove('show')
		})

		dateElement.innerText = date.getDate()
	})
}

function addWeekDays(days) {
	datePickerGridHeader.innerHTML = ''
	days.forEach((weekDay) => {
		const day = document.createElement('div')
		day.innerText = weekDay
		datePickerGridHeader.appendChild(day)
	})
}
