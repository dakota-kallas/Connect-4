import { Theme } from './theme';

export interface Game {
  id: string;
  owner: string;
  start: Date;
  end: Date;
  theme: Theme;
  status: string;
  grid: String[][];
}
