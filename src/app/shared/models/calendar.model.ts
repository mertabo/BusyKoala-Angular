export interface CalendarEvent {
  title: string;
  time: string;
  workplace: string;
}

export interface Calendar {
  id: string;
  events: {
    [year: number]: {
      [month: number]: {
        [date: number]: CalendarEvent[];
      };
    };
  };
}
