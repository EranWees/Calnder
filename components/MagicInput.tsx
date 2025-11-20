import React, { useState } from 'react';
import { parseNaturalLanguageEvent } from '../services/geminiService';
import { CalendarEvent, EventColor } from '../types';

interface MagicInputProps {
  onAddEvent: (event: CalendarEvent) => void;
  currentDate: Date;
}

export const MagicInput: React.FC<MagicInputProps> = ({ onAddEvent, currentDate }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMagicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await parseNaturalLanguageEvent(input, currentDate);
      
      if (result) {
        // Map AI color string to enum
        let colorEnum = EventColor.BLUE;
        if (result.colorSuggestion && (result.colorSuggestion in EventColor)) {
             colorEnum = EventColor[result.colorSuggestion as keyof typeof EventColor];
        }

        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(),
          title: result.title,
          description: result.description,
          startTime: result.startTime,
          endTime: result.endTime,
          color: colorEnum,
          location: result.location
        };

        onAddEvent(newEvent);
        setInput('');
      } else {
        setError("Couldn't understand that. Try 'Lunch tomorrow at 1pm'.");
      }
    } catch (err) {
      console.error(err);
      setError("AI Service currently unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200 relative">
       <form onSubmit={handleMagicSubmit} className="flex items-center gap-2">
          <div className="pl-3 text-brand-500" aria-hidden="true">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI: 'Schedule a team sync next Tuesday at 2pm for 1 hour'..."
            className="flex-1 py-2 bg-transparent outline-none text-slate-700 placeholder-slate-400 text-sm"
            disabled={isLoading}
            aria-label="Natural language event creation"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isLoading 
                ? 'bg-slate-100 text-slate-400 cursor-wait' 
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-200'
            }`}
          >
            {isLoading ? 'Thinking...' : 'Create'}
          </button>
       </form>
       {error && (
         <div className="absolute top-full mt-2 left-0 text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100" role="alert">
           {error}
         </div>
       )}
    </div>
  );
};