import { Theme } from './theme';

export interface User {
  id: string;
  email: string;
  defaults: Theme;
}
