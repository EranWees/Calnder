import React, { useState, useEffect } from 'react';
import { CalendarEvent, EventColor } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  initialDate?: Date;
  existingEvent?: CalendarEvent | null;
}

const toLocalISOString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toLocalTimeString = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, onClose, onSave, onDelete, initialDate, existingEvent 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState<EventColor>(EventColor.BLUE);

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        setTitle(existingEvent.title);
        setDescription(existingEvent.description || '');
        const start = new Date(existingEvent.startTime);
        const end = new Date(existingEvent.endTime);
        
        setStartDate(toLocalISOString(start));
        setStartTime(toLocalTimeString(start));
        setEndTime(toLocalTimeString(end));
        setColor(existingEvent.color);
      } else if (initialDate) {
        setTitle('');
        setDescription('');
        setStartDate(toLocalISOString(initialDate));
        setStartTime('09:00');
        setEndTime('10:00');
        setColor(EventColor.BLUE);
      }
    }
  }, [isOpen, existingEvent, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [year, month, day] = startDate.split('-').map(Number);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDateTime = new Date(year, month - 1, day, startHour, startMinute);
    const endDateTime = new Date(year, month - 1, day, endHour, endMinute);

    const newEvent: CalendarEvent = {
      id: existingEvent?.id || crypto.randomUUID(),
      title,
      description,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      color,
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">
            {existingEvent ? 'Edit Event' : 'New Event'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
              placeholder="Meeting with..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
              <input 
                type="time" 
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
              <input 
                type="time" 
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
            <div className="flex gap-2">
              {Object.entries(EventColor).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(val)}
                  className={`w-8 h-8 rounded-full border-2 ${val.replace('text-', 'bg-').split(' ')[0].replace('100', '500')} ${color === val ? 'ring-2 ring-offset-2 ring-slate-400' : 'border-transparent'}`}
                  aria-label={`Select ${key} color`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-between pt-2">
             {existingEvent ? (
               <button 
                type="button"
                onClick={() => {
                  if(existingEvent) onDelete(existingEvent.id);
                  onClose();
                }}
                className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-2"
               >
                 Delete Event
               </button>
             ) : <div></div>}
             <div className="flex gap-2">
               <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
               >
                 Cancel
               </button>
               <button 
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium shadow-md shadow-brand-200 transition transform active:scale-95"
               >
                 Save
               </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};