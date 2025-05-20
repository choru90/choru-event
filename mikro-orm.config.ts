import { Options } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import { User } from 'apps/auth/src/users/entity/user.entity';

const config: Options<MongoDriver> = {
  driver: MongoDriver,
  clientUrl: process.env.MONGO_URI,
  dbName: process.env.AUTH_DB_NAME ?? 'auth_db',
  entities: [User],
  ensureIndexes: true,
  debug: process.env.NODE_ENV !== 'production',
};

export default config;
