import { format, getUnixTime, fromUnixTime, addMonths, subMonths, startOfWeek, startOfMonth, endOfWeek, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay} from 'date-fns'

const datePickerButton = document.querySelector('.date-picker-button')
const datePicker = document.querySelector('.date-picker') 
const datePickerHeaderText = document.querySelector('.current-month')
const nextMonthButton = document.querySelector('.next-month-button')
const prevMonthButton = document.querySelector('.prev-month-button')
const dateGrid = document.querySelector('.date-picker-grid-dates')
let currentDate = new Date();

datePickerButton.addEventListener('click', e => {
    const selectedDate = fromUnixTime(datePicker.dataset.selectedDate)
    datePicker.classList.toggle('show')
    currentDate = selectedDate
    setUpDatePicker(selectedDate)

})

function setDate(date){
    datePickerButton.innerText = format(date, 'MMMM do, yyy')
    datePicker.dataset.selectedDate = getUnixTime(date)
}

function setUpDatePicker(selectedDate) {
    datePickerHeaderText.innerText = format(currentDate, 'MMMM - yyyy')
    setupDates(selectedDate)
}

function setupDates(selectedDate) {
    const firstWeekStart = startOfWeek(startOfMonth(currentDate))
    const lastWeekEnd = endOfWeek(endOfMonth(currentDate))
    dateGrid.innerHTML = ''
    const dates = eachDayOfInterval({
        start: firstWeekStart,
        end: lastWeekEnd
    })
    dates.forEach(date => {
        const dateElement = document.createElement('button')
        dateElement.classList.add('date')
        dateGrid.appendChild(dateElement)
        if(!isSameMonth(date, currentDate)) {
            dateElement.classList.add('date-picker-other-month-date')
        }
        if(isSameDay(date, selectedDate)) {
            dateElement.classList.add('selected')
        }
        dateElement.addEventListener('click', () => {
            setDate(date)
            datePicker.classList.remove('show') 
        })
        dateElement.innerText = date.getDate()
    })
}

nextMonthButton.addEventListener('click', () => {
    const selectedDate = fromUnixTime(datePicker.dataset.selectedDate)
    currentDate = addMonths(currentDate, 1)
    setUpDatePicker(selectedDate)
})  

prevMonthButton.addEventListener('click', () => {
    const selectedDate = fromUnixTime(datePicker.dataset.selectedDate)
    currentDate = subMonths(currentDate, 1)
    setUpDatePicker(selectedDate)
})

setDate(new Date())
