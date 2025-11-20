import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EventModal } from './components/EventModal';
import { MagicInput } from './components/MagicInput';
import { getMonthGrid, formatTime } from './utils/dateUtils';
import { CalendarEvent, DateGridItem } from './types';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('chrono_events');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    localStorage.setItem('chrono_events', JSON.stringify(events));
  }, [events]);

  const grid = getMonthGrid(currentDate.getFullYear(), currentDate.getMonth());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === event.id ? event : ev));
    } else {
      setEvents([...events, event]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Header 
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col">
        
        <MagicInput onAddEvent={(evt) => setEvents(prev => [...prev, evt])} currentDate={currentDate} />

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {daysOfWeek.map(day => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 grid grid-cols-7 grid-rows-6">
            {grid.map((item: DateGridItem, idx) => {
              const dayEvents = getEventsForDay(item.date);
              
              return (
                <div 
                  key={idx}
                  onClick={() => handleDayClick(item.date)}
                  className={`
                    min-h-[100px] border-b border-r border-slate-100 p-2 relative group transition-colors
                    ${!item.isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white hover:bg-slate-50 cursor-pointer'}
                    ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`
                      text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                      ${item.isToday ? 'bg-brand-600 text-white shadow-md shadow-brand-200' : ''}
                    `}>
                      {item.date.getDate()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {dayEvents.slice(0, 3).map(event => (
                      <div 
                        key={event.id}
                        onClick={(e) => handleEventClick(e, event)}
                        className={`
                          text-xs px-2 py-1 rounded-md truncate font-medium cursor-pointer
                          transition hover:opacity-80 hover:shadow-sm
                          ${event.color}
                        `}
                      >
                        <span className="opacity-75 mr-1 text-[10px]">{formatTime(event.startTime)}</span>
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-slate-400 pl-1 font-medium">
                        + {dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Plus Icon */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-brand-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={selectedDate || new Date()}
        existingEvent={editingEvent}
      />
    </div>
  );
};

export default App;
