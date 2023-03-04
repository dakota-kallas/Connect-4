import { Theme } from './theme';

export interface Game {
  id: string;
  owner: string;
  start: string;
  end: string;
  theme: Theme;
  status: string;
  grid: String[][];
}
