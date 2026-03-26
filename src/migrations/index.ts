import * as migration_20260326_131422_init from './20260326_131422_init';

export const migrations = [
  {
    up: migration_20260326_131422_init.up,
    down: migration_20260326_131422_init.down,
    name: '20260326_131422_init'
  },
];
