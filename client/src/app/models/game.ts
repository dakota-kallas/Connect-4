import { Theme } from './theme';

export interface Game {
  id: string;
  owner: string;
  start: Date;
  end: string;
  theme: Theme;
  status: string;
  grid: String[][];
}
