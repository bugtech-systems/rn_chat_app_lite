/* eslint-disable prettier/prettier */
import { createRealmContext } from '@realm/react';
import { users, Profile, Item } from './Models';

export const realmContext = createRealmContext({
	schema: [
		users,
		Profile,
		Item,
	],
	schemaVersion: 1,
});
