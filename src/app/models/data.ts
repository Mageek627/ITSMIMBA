import { Constants } from '../data/constants';
import { User } from './user';

export class Data {
  constructor(
    public user: User,
    public version: number = Constants.currentVersionNumber // Defines the version of the standard
  ) {}
}
