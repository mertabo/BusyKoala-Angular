export interface Workspace {
  id: string;
  ongoing: boolean;
  name: string;
  owner: string;
  when: string;
  members: string[];
  attendance: any;
}
