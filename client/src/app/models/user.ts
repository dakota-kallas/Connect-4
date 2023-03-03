import { Metadata } from './metadata';

export interface User {
  id: string;
  email: string;
  defaults: Metadata;
}
