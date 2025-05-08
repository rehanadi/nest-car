import { rm } from "fs/promises";
import { join } from "path";

// Delete the test database before each test run
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});