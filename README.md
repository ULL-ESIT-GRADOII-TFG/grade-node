# grade-node package

## Context (WIP)

```bash
Se trata de escribir un paquete npm que contiene un script grade-node que complementa la funcionalidad de evaluación de ghedsh.

Esta es la forma de uso desde ghedsh:

crguezl> ULL-ESIT-PL-1718> new_eval ale-eval /ale/i
...
crguezl> ULL-ESIT-PL-1718> cd repo ale-eval
...
crguezl> ULL-ESIT-PL-1718> foreach grade-node --teacher teacher-tests-dir  --output grade.test.md
...
grade-node recibe como argumento un directorio teacher-tests-dir/ que contiene las pruebas privadas (en mocha u otro framework) que ha escrito el profesor para la práctica
Para cada repo grade-node copia en el subdirectorio test/ del alumno los contenidos de teacher-tests-dir/
Recuerda que dentro de un git submodule foreach
... The command has access to the variables $name, $path, $sha1 and $toplevel:
$nameis the name of the relevant submodule section in .gitmodules, $path is the name of the submodule directory relative to the superproject, $sha1 is the commit as recorded in the superproject, and $toplevel is the absolute path to the top-level of the superproject.
grade-node hace un npm instally si tiene éxito un npm test redirigiendo la salida a un fichero markdown grade-test.md que queda en el repo del alumno
Ahora el profe si quiere puede hacer algo como:

crguezl> ULL-ESIT-PL-1718> foreach gh-issue --title 'Resultado de las pruebas' --input grade-test.md
...
que ejecutaría otro script gh-issue que enviaría los issues
```