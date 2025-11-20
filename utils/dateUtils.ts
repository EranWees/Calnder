import { DateGridItem } from '../types';

export const getMonthGrid = (year: number, month: number): DateGridItem[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  
  const grid: DateGridItem[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    grid.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
      isToday: false
    });
  }

  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    grid.push({
      date: date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString()
    });
  }

  // Next month padding
  const remainingSlots = 42 - grid.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingSlots; i++) {
    grid.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      isToday: false
    });
  }

  return grid;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
