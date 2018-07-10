'use-strict';

const fse = require('fs-extra');
const util = require('util');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);

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
  console.log(chalk.green('Copying teacher\'s tests ...')); // eslint-disable-line no-console
  const sourceDir = teacherTestDir;
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
    fse.outputFileSync(installInfo.installErrorsFileName, error.stderr);
    process.exit(1);
  }
}

async function runTeacherTests(outputFileName) {
  console.log(chalk.green('Running tests ...')); // eslint-disable-line no-console
  try {
    const { stdout, stderr } = await exec('npm test'); // , { stdio: [0, 1, 2] }
    if (stderr) {
      fse.outputFileSync('./npm-test-errors.md', stderr);
    }
    fse.outputFileSync(outputFileName, stdout);
  } catch (error) {
    console.error(chalk.red('npm test error\n')); // eslint-disable-line no-console
    console.error(error.stderr); // eslint-disable-line no-console
    fse.outputFileSync('./npm-test-errors.md', error.stderr);
    process.exit(1);
  }
}

async function start(argv) {
  if (argv.teacher) {
    copyFilesIntoStudentTestDir(argv.teacher);
  }
  await installDependencies(productionDependencies);
  await installDependencies(developmentDependencies);
  await runTeacherTests(argv.output);
}

module.exports = {
  start,
};
