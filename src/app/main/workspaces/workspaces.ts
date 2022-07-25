export interface AttendanceMonthlySummary {
  date: string;
  attendees: UserTimeData[];
}

export interface UserTimeData {
  user: string;
  time: string[];
  duration: number;
}

export interface Workspace {
  id: string;
  ongoing: string;
  inviteCode: string;
  name: string;
  owner: string;
  schedule: string;
  attendance: {
    [year: number]: {
      [month: number]: {
        [date: number]: UserTimeData[];
      };
    };
  };
}

// just for dummy workspace id only
export interface WorkspacesTotal {
  total: number;
}
