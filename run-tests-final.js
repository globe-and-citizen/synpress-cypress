import { execSync } from "child_process";
import { readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get the current directory in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

// Get the test directory from the command-line argument or use default
const testDir = process.argv[2]
  ? join(__dirname, process.argv[2])
  : join(__dirname, "test/cypress/e2e/advertisements");

console.log(`📂 Using test directory: ${testDir}`);

// Get all .cy.js test files
const testFiles = (await readdir(testDir)).filter((file) =>
  file.endsWith(".cy.js")
);

if (testFiles.length === 0) {
  console.log("No test files found.");
  process.exit(1);
}

// Function to run tests one by one
const runTestsSequentially = async () => {
  for (const testFile of testFiles) {
    console.log(`\n Running test: ${testFile}...\n`);

    try {
      execSync(
        `npx cypress run --browser chrome --headed --spec "${join(
          testDir,
          testFile
        )}"`,
        { stdio: "inherit" } // Show live output
      );
    } catch (error) {
      console.error(`❌ Test failed: ${testFile}`);
    }
  }
  console.log("\n✅ All tests completed.\n");
};

// Run the tests
await runTestsSequentially();
