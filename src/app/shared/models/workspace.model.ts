export interface UserTimeData {
  user: string;
  time: string[];
  duration: number;
}

export interface AttendanceMonthlySummary {
  date: string;
  attendees: UserTimeData[];
}

export interface Attendance {
  [year: number]: {
    [month: number]: {
      [date: number]: UserTimeData[];
    };
  };
}

export interface Workspace {
  id?: string;
  ongoing?: 'true' | 'false';
  inviteCode?: string;
  name?: string;
  owner?: string;
  schedule?: string;
  attendance?: Attendance;
}

// just for dummy workspace id only
export interface WorkspacesTotal {
  total: number;
}
