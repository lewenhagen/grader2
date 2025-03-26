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

```bash
npm install
```

Start the grader and see its menu.

```bash
node main.js
```

Fetch new data.
```bash
node main.js fetch
```

Generate table and print it.
```bash
node main.js magic
```


### Development

Run the linter and the fixer.

```bash
npm run eslint
npm run eslint:fix
```
