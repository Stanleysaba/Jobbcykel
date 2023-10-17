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
  
  function dayDifference(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  }
  
  function populateCalendar() {
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
  
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    populateCalendar();
  });
  
  document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    populateCalendar();
  });
  
  populateCalendar();
  