export interface Workspace {
  id: number;
  ongoing: boolean;
  name: string;
  owner: string;
  when: string;
  members: string[];
  attendance: {};
}
