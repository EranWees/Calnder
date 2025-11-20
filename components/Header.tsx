import React from 'react';
import { MONTH_NAMES } from '../utils/dateUtils';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          {MONTH_NAMES[currentDate.getMonth()]} <span className="text-slate-400 font-light">{currentDate.getFullYear()}</span>
        </h1>
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          <button 
            onClick={onPrevMonth} 
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition text-slate-600"
            aria-label="Previous Month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={onNextMonth} 
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition text-slate-600"
            aria-label="Next Month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <button 
          onClick={onToday}
          className="text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-1.5 border border-slate-200 rounded-md hover:border-brand-200 hover:bg-brand-50 transition"
        >
          Today
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
          AI
        </div>
        <span className="text-sm font-medium text-slate-600">Chrono</span>
      </div>
    </header>
  );
};
