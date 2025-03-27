# Grader 2

### Setup

Create a file `.env.local` and add your token and the id of the Canvas course to it. Copy the .env file:

```console
$ cp .env .env.local
```

```env
BASE_URL="https://bth.instructure.com"
COURSE_ID=<id>
CANVAS_TOKEN="<token>"
```



### Usage

Install npm packages, it's a JavaScript project so of course we need packages.

```console
$ npm install
```

Start the grader and see its menu.

```console
$ node main.js help
Usage: main.js <command> <option>

CLI to followup grading in courses

Options:
  -V, --version                                                output the version number
  -h, --help                                                   display help for command

Commands:
  fetch [options]                                              Fetches new data from Canvas
  magic [options]                                              Prints the magic table
  json                                                         Prints the raw JSON object
  count <string>                                               Counts the gradings and prints date for grader
  stat [options] <(section) <string>> <(assignment) <string>>  Counts submissions for <section> <kmom>
  help [command]                                               display help for command
```



### Development

Run the linter and the fixer.

```console
npm run eslint
npm run eslint:fix
```
