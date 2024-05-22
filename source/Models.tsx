/* eslint-disable prettier/prettier */
import { BSON } from 'realm';
import Realm from 'realm';

export class users extends Realm.Object<users> {
  _id!: BSON.ObjectId;
  email!: string;
  role!: 'user' | 'admin' | 'moderator';
  status!: 'pending' | 'profile_setup' | 'completed';
  iDeleted!: boolean;
  profile!: Profile;
  timestamp?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'users',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      email: 'string',
      role: { type: 'string', default: 'user' },
      status: { type: 'string', default: 'pending' },
      isDeleted: { type: 'bool', default: false },
      profile: 'Profile',
      timestamp: 'date?',
    },
  };
}

export class Profile extends Realm.Object<Profile> {
  _id!: BSON.ObjectId;
  email!: string;
  first_name!: string;
  last_name!: string;
  date_of_birth!: Date;
  phone!: string;
  gender!: 'male' | 'female' | 'n/a';
  address?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Profile',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new BSON.ObjectId() },
      email: 'string',
      first_name: {type: 'string', default: 'n/a'},
      last_name: {type: 'string', default: 'n/a'},
      date_of_birth: {type: 'date', default: () => new Date()},
      phone: {type: 'string', default: 'n/a'},
      gender: { type: 'string', default: 'n/a'},
      address: 'string?',
    },
  };
}

export class Item extends Realm.Object<Item> {
  _id!: BSON.ObjectId;
  isViewed!: Date;
  message!: string;
  owner_id!: string;
  sender_id!: string;

  static schema: Realm.ObjectSchema = {
    name: 'message',
    primaryKey: '_id',
    properties: {
      // This allows us to automatically generate a unique _id for each Item
      _id: {type: 'objectId', default: () => new BSON.ObjectId()},
      // All todo items will default to incomplete
      isViewed: {type: 'date', default: () => new Date()},
      message: 'string',
      sender_id: 'string',
      receiver_id: 'string',
    },
  };
}


