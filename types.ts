export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  color: EventColor;
  location?: string;
}

export enum EventColor {
  BLUE = 'bg-blue-100 text-blue-700 border-blue-200',
  RED = 'bg-red-100 text-red-700 border-red-200',
  GREEN = 'bg-green-100 text-green-700 border-green-200',
  PURPLE = 'bg-purple-100 text-purple-700 border-purple-200',
  ORANGE = 'bg-orange-100 text-orange-700 border-orange-200',
  GRAY = 'bg-gray-100 text-gray-700 border-gray-200',
}

export interface DateGridItem {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface AIMagicResponse {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  colorSuggestion?: 'BLUE' | 'RED' | 'GREEN' | 'PURPLE' | 'ORANGE' | 'GRAY';
}
