import { UsersRepository } from './src/modules/users/users.repository';
import { db } from './src/database/client';

async function run() {
  try {
    const user = await UsersRepository.findByEmail("test@test.com");
    console.log("User:", user);
  } catch (error) {
    console.error("DB Error:", error);
  }
  process.exit(0);
}

run();
