# Grader 2

### Setup

Create a file `.env.local` and add your token and the id of the Canvas course to it.

```env
COURSE_ID=59505
CANVAS_TOKEN="123123..."
```



### Usage

Start the grader and see its menu.

```bash
npm start
```

Fetch new data.
```bash
npm start fetch
```

Generate table and print it.
```bash
npm start magic
```



### Development

Run the linter and the fixer.

```bash
npm run eslint
npm run eslint:fix
```
