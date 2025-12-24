import React, { useState, useEffect } from 'react';

const MonthCalendar = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentTime, setCurrentTime] = useState('');

  const daysInSelectedMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfSelectedMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const getDaysArray = () => {
    const daysArray = [];
    for (let i = 1; i <= daysInSelectedMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  };

  const renderCalendarHeader = () => (
    <thead>
      <tr>
        <th colSpan="7" className="text-lg font-bold text-center p-2">{months[selectedMonth]} {selectedYear}</th>
      </tr>
      <tr>
        {daysOfWeek.map(day => (
          <th key={day} className="text-gray-600">{day}</th>
        ))}
      </tr>
    </thead>
  );

  const renderCalendarBody = () => {
    const daysArray = getDaysArray();
    const weeksArray = [];

    for (let i = 0; i < daysInSelectedMonth; i += 7) {
      const week = Array(7).fill(0).map((_, dayIndex) => i + dayIndex + 1 - firstDayOfSelectedMonth);
      weeksArray.push(week);
    }

    return (
      <tbody>
        {weeksArray.map((week, index) => (
          <tr key={index}>
            {week.map(day => {
              const isToday = day === currentDay && selectedMonth === currentMonth && selectedYear === currentYear;
              return (
                <td
                  key={day}
                  className={`p-4 text-center ${isToday ? 'font-bold text-red-500' : ''}`}
                >
                  {day > 0 ? day : ''}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const renderClock = () => {
    const now = new Date();
    const nepalTime = now.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' });
    const americaTime = now.toLocaleString('en-US', { timeZone: 'America/New_York' });

    return (
      <div className="flex justify-around mt-6">
        <div className="flex flex-col items-center">
          <h3 className="font-bold">Nepal Time</h3>
          <p className="text-xl">{nepalTime}</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="font-bold">America Time</h3>
          <p className="text-xl">{americaTime}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-5">Month Calendar</h2>

      <div className="flex justify-between mb-5">
        <select className="border border-gray-300 rounded p-2" value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
        <select className="border border-gray-300 rounded p-2" value={selectedYear} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => currentYear + i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        {renderCalendarHeader()}
        {renderCalendarBody()}
      </table>
      {renderClock()}
    </div>
  );
};

export default MonthCalendar;
