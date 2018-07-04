'use-strict';

const fse = require('fs-extra');
const util = require('util');
const glob = require('glob');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const USER_HOME_DIRECTORY = require('os').homedir();
const path = require('path');

const productionDependencies = {
  command: 'npm install',
  startMessage: 'Installing production dependencies ...',
  installErrorsFileName: './npm_install_reports/npm-install-errors.md',
  installOutputFileName: './npm_install_reports/npm-install-output.md',
  errorMessage: 'npm install error\n',
};

const developmentDependencies = {
  command: 'npm install --only=dev',
  startMessage: 'Installing development dependencies ...',
  installErrorsFileName: './npm_install_reports/npm-install-dev-errors.md',
  installOutputFileName: './npm_install_reports/npm-install-dev-output.md',
  errorMessage: 'npm install --only=dev error\n',
};

function copyFilesIntoStudentTestDir(teacherTestDir) {
  const sourceDir = `${USER_HOME_DIRECTORY}${teacherTestDir}`;
  const destination = './test';
  fse.copySync(sourceDir, destination, { overwrite: true });
}

async function installDependencies(installInfo) {
  console.log(chalk.green(installInfo.startMessage)); // eslint-disable-line no-console
  try {
    const { stdout, stderr } = await exec(installInfo.command);
    if (stderr) {
      fse.outputFileSync(installInfo.installErrorsFileName, stderr);
    }
    fse.outputFileSync(installInfo.installOutputFileName, stdout);
  } catch (error) {
    console.error(chalk.red(installInfo.errorMessage)); // eslint-disable-line no-console
    console.error(error.stderr); // eslint-disable-line no-console
    process.exit(1);
  }
}

async function runTeacherTests(outputFileName) {
  console.log(chalk.green('Running tests ...')); // eslint-disable-line no-console
  try {
    const { stdout, stderr } = await exec('npm test'); // , { stdio: [0, 1, 2] }
    if (stderr) {
      fse.outputFileSync('./test/npm-test-errors.md', stderr);
    }
    fse.outputFileSync(outputFileName, stdout);
  } catch (error) {
    console.error(chalk.red('npm test error\n')); // eslint-disable-line no-console
    console.error(error.stderr); // eslint-disable-line no-console
    process.exit(1);
  }
}

function removeTeachersTestsFiles(teacherTestsDir) {
  const sourceDir = `${USER_HOME_DIRECTORY}${teacherTestsDir}/*`;
  glob(sourceDir, (err, files) => {
    if (err) {
      console.error(err); // eslint-disable-line no-console
      process.exit(1);
    }
    files.forEach((file) => {
      fse.removeSync(`./test/${path.basename(file)}`);
    });
  });
}

async function start(argv) {
  copyFilesIntoStudentTestDir(argv.teacher);
  await installDependencies(productionDependencies);
  await installDependencies(developmentDependencies);
  await runTeacherTests(argv.output);
  removeTeachersTestsFiles(argv.teacher); // preguntar si es necesario borrar los tests del profe
}

module.exports = {
  start,
};
