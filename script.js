// Registrera Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then((reg) => {
            console.log('Service worker registrerad.', reg);
        });
}

// Initiera variabler
const schedule = [
    'Jobb', 'Jobb', 'Jobb', 'Jobb', 'Jobb',
    'Ledig', 'Ledig', 'Ledig', 'Ledig',
    'Jobb', 'Jobb', 'Jobb', 'Jobb', 'Jobb',
    'Ledig', 'Ledig', 'Ledig', 'Ledig', 'Ledig',
    'Jobb', 'Jobb', 'Jobb', 'Jobb',
    'Ledig', 'Ledig', 'Ledig', 'Ledig', 'Ledig'
];

const startDate = new Date('2023-10-18');
let currentDate = new Date();

// Swipe-funktionalitet
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    console.log('Touch start:', touchStartX); // Logga värde
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    console.log('Touch end:', touchEndX); // Logga värde
    handleSwipeGesture();
}

function handleSwipeGesture() {
    if (touchEndX < touchStartX) {
        // Swipe Left, go to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    if (touchEndX > touchStartX) {
        // Swipe Right, go to previous month
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    populateCalendar();
    fetchRedDays();
}

// Funktioner för att hantera kalendern
function dayDifference(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}

function populateCalendar() {
    const today = new Date();
    const daysDiv = document.getElementById('days');
    daysDiv.innerHTML = '';
    document.getElementById('currentMonthYear').innerText = currentDate.toLocaleString('sv-SE', { month: 'long', year: 'numeric' });

    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    let dayIndex = dayDifference(startDate, firstDayOfMonth) + 1;
    
    const weekdays = ['Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör', 'Sön'];

    for (let i = 1; i <= lastDayOfMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';

        if (i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
            dayDiv.classList.add('current-day');
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.innerText = i;

        const weekday = document.createElement('div');
        weekday.className = 'day-weekday';
        weekday.innerText = weekdays[(new Date(currentDate.getFullYear(), currentDate.getMonth(), i).getDay() - 1 + 7) % 7];

        if (schedule[dayIndex % schedule.length] === 'Jobb') {
            dayDiv.classList.add('work-day');
        }

        dayDiv.appendChild(weekday);
        dayDiv.appendChild(dayNumber);
        daysDiv.appendChild(dayDiv);
        dayIndex++;
    }
}

function fetchRedDays() {
    console.log("Fetching red days...");
    fetch(`http://localhost:5000/red-days/${currentDate.getFullYear()}`)
        .then(response => response.json())
        .then(data => {
            const daysDiv = document.getElementById('days');
            const dayElements = daysDiv.getElementsByClassName('day');

            Array.from(dayElements).forEach((dayElement, index) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1);
                const dateString = date.toISOString().split('T')[0];
                if (data[dateString]) {
                    dayElement.classList.add('red-day');
                }
            });
        })
        .catch(error => console.log('Error fetching red days:', error));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', (event) => {
    currentDate = new Date();
    populateCalendar();
    fetchRedDays();
    
    const swipeContainer = document.getElementById('swipe-container');
    swipeContainer.addEventListener('touchstart', handleTouchStart, false);
    swipeContainer.addEventListener('touchend', handleTouchEnd, false);
});

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    populateCalendar();
    fetchRedDays();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    populateCalendar();
    fetchRedDays();
});
