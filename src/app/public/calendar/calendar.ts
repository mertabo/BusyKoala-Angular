export interface CalendarEvent {
  date: Date;
  event: string;
}

export interface Calendar {
  id: string;
  events: {
    [year: number]: {
      [month: number]: {
        [date: number]: string[];
      };
    };
  };
}
