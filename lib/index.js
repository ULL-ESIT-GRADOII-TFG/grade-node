'use-strict';

const fse = require('fs-extra');
const glob = require('glob');
const { exec } = require('child_process');
const USER_HOME_DIRECTORY = require('os').homedir();
const path = require('path');

function copyFilesIntoStudentTestDir(teacherTestDir) {
  const sourceDir = `${USER_HOME_DIRECTORY}${teacherTestDir}`;
  fse.copySync(sourceDir, './test', {overwrite: true});
}

function installProductionDependencies() {
  console.log('HOLA prod');
  exec('npm install', (error, stdout, stderr) =>{
    if (error) {
      console.error(`npm install error: ${error}`);
      process.exit(1);
      // return;
    }
    if (stderr) {
      fse.outputFileSync('./npm_install_reports/npm-install-errors.md', stderr);
    }
    fse.outputFileSync('./npm_install_reports/npm-install-output.md', stdout);

  });
}

function installDevelopmentDependencies() {
  console.log('HOLA dev');
  exec('npm install --only=dev', (error, stdout, stderr) =>{
    if (error) {
      console.error(`npm install --only=dev error: ${error}`);
      process.exit(1);
      // return;
    }
    if (stderr) {
      fse.outputFileSync('./npm_install_reports/npm-install-dev-errors.md', stderr);
    }
    fse.outputFileSync('./npm_install_reports/npm-install-dev-output.md', stdout);
  });
}

function runTests(outputFileName) {
  exec('npm test', (error, stdout, stderr) => {
    if (error) {
      console.error(`npm test error: ${error}`);
      process.exit(1);
      // return;
    }
    if (stderr) {
      fse.outputFileSync('./test/npm-test-errors.md', stderr);
    }
    fse.outputFileSync(outputFileName, stdout);
  });
}

function removeTeachersTestsFiles(teacherTestsDir) {
  const sourceDir = `${USER_HOME_DIRECTORY}${teacherTestsDir}`;
  glob(sourceDir, (err, files) => {
    if (err) {
      console.error(err);
      process.exit(1);
      // return;
    }
    files.forEach((file) => {
      fse.removeSync(`./test/${path.basename(file)}`);
    });
  });
}

async function init(argv) {
  copyFilesIntoStudentTestDir(argv.teacher);
  await installProductionDependencies();
  await installDevelopmentDependencies();
  await runTests(argv.output);
  removeTeachersTestsFiles(argv.teacher);
}

module.exports = {
  init
};
