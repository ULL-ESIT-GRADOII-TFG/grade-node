# ghedsh-grade-node

[![npm](https://img.shields.io/badge/version-1.0.5-blue.svg)](https://www.npmjs.com/package/ghedsh-grade-node)

To be used with ghedsh. Helps grading Node assignments.

<img src="img/ghedsh-grade-node.png" width="200">

## Prerequisites

Node.js version `>=8.0.0` (async/await support).

## Install

    npm install ghedsh-grade-node --save

## Usage

    grade-node [--teacher/-t] </dir> <--output/-o> <output_file.extension>

### Options

`--teacher` or `-t` is the absolute path directory containing teacher's private tests.

`--output` or `-o` tests output file name.

`--version` or `-v` shows current package version.

`--help` or `-h` prints usage help.

## Performance

If `--teacher` or `-t` option provided, `ghedsh-grade-node` will copy teacher's private tests into student's `/test` dir. (Else, jump to install dependencies process).

Runs `npm intall`.

Runs `npm install --only=dev`.

Runs `npm test`. (Assumes that `npm test` command from `package.json` will run all tests under `/test` directory).

Captures `stdout` and `stderr` into files.

## Context (WIP)

Se trata de escribir un paquete npm que contiene un script grade-node que complementa la funcionalidad de evaluación de ghedsh.

Esta es la forma de uso desde ghedsh:

```bash
crguezl> ULL-ESIT-PL-1718> new_eval ale-eval /ale/i
...
crguezl> ULL-ESIT-PL-1718> cd repo ale-eval
...
crguezl> ULL-ESIT-PL-1718> foreach grade-node --teacher teacher-tests-dir  --output grade.test.md
...
```

grade-node recibe como argumento un directorio `teacher-tests-dir/` que contiene las pruebas privadas (en mocha u otro framework) que ha escrito el profesor para la práctica
Para cada repo `grade-node` copia en el subdirectorio `test/` del alumno los contenidos de `teacher-tests-dir/`
Recuerda que dentro de un `git submodule foreach`
... The command has access to the variables `$name`, `$path`, `$sha1` and `$toplevel`:

* `$name` is the name of the relevant submodule section in .gitmodules
* `$path` is the name of the submodule directory relative to the superproject
* `$sha1` is the commit as recorded in the superproject
* `$toplevel` is the absolute path to the top-level of the superproject.

`grade-node` hace un `npm install` y si tiene éxito un `npm test` redirigiendo la salida a un fichero markdown **grade-test.md** que queda en el repo del alumno.
Ahora el profe si quiere puede hacer algo como:

```bash
crguezl> ULL-ESIT-PL-1718> foreach gh-issue --title 'Resultado de las pruebas' --input grade-test.md
```

...
que ejecutaría otro script `gh-issue` que enviaría los issues.
