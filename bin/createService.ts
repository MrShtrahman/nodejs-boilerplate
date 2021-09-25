#!/usr/bin/env node
import { promisify } from 'util';
import { join } from 'path';
import { mkdirSync, unlinkSync, rmdirSync, copyFileSync } from 'fs';

// Utility functions
const exec = promisify(require('child_process').exec);
const runCmd = async (command: string): Promise<void> => {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error: Error) => console.error(error);
  }
};

// Validate arguments
if (process.argv.length < 3) {
  console.log('Please specify the target project directory.');
  console.log('For example:');
  console.log('    npx create-service my-app');
  process.exit(1);
}

// Define constants
const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = join(ownPath, folderName);
const repo = 'the-repo';

// Check if directory already exists
try {
  mkdirSync(appPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log('Directory already exists. Please choose another name for the project.');
  } else {
    console.log(err);
  }
  process.exit(1);
}

(async () => {
  try {
    // Clone repo
    console.log(`Downloading files from repo ${repo}`);
    await runCmd(`git clone --depth 1 ${repo} ${folderName}`);
    console.log('Cloned successfully.');
    console.log('');

    // Change directory
    process.chdir(appPath);

    // Install dependencies
    console.log('Checking for updates...');
    await runCmd('npx ncu -u');
    console.log();
    console.log('Installing dependencies...');
    await runCmd('npm i');
    console.log('Dependencies installed successfully.');
    console.log();

    // Copy envornment variables
    copyFileSync(join(appPath, '.env.example'), join(appPath, '.env'));
    console.log('Environment files copied.');

    // Delete .git folder
    await runCmd('npx rimraf ./.git');

    // Remove extra files
    unlinkSync(join(appPath, 'bin', 'createService.ts'));
    rmdirSync(join(appPath, 'bin'));

    console.log('Installation is now complete!');
    console.log();
    console.log('Enjoy bitch');
  } catch (error) {
    console.error(error);
  }
})();
