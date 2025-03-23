# Load Monitoring

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Server

In order to run this SPA a simple server is needed to get the data.

### Start development server

```bash
cd server
make start
```

The server should be running on port `3000`.

## SPA

Using Vue.js, this SPA gets information from a server (explained before) and lists it.

### Start development app

```bash
make start
```

## Other SPA commands

### Install the server dependencies using:

```bash
pnpm install --frozen-lockfile
```

or

```bash
npm install --frozen-lockfile
```

### Compile and Hot-Reload for Development

```bash
pnpm dev
```

or

```bash
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm build
pnpm test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Improvements

The main file, [cpu.ts](./src/stores/cpu.ts) could be improved. 
Currently its complexity is O(n), which is not problematic because we're keeping at most ~60 records (10 minutes, one sample per 10 seconds).

| bindEvents()                   | Complexity |
|--------------------------------|------------|
| cleanOutdatedHistory()         | O(n)       |
| cpuHistory.value.unshift(data) | O(n)       |
| checkHeavyLoad()               | O(1)       |


Because the overall complexity was going to be O(n) due to the use of `unshift`, I opted with precision when cleaning the records. However one simple improvement, could be to change `cleanOutdatedHistory()` to a capped logic, eg.:

```
const MAX_RECORDS = (RECORDS_WINDOW * 60 * 1000) / UPDATE_TIMESPAN_ML; 
if (cpuHistory.value.length === (MAX_RECORDS)) {
  cpuHistory.value.pop();
}
```

The most important thing to notice is that if the `RECORDS_WINDOW` where to change (eg. hours or days) or the `UPDATE_TIMESPAN_ML` (eg. every second), this solution could become problematic and we should try to achieve a complexity of O(1).

This should be achieved by avoiding shift/unshift/filter and opting by a deque (double-ended queue) or a circular buffer solution (which javascript does not provide natively).

Finally, in this scenario, the history of records could also be stored in the backend and provided through an API. For instance, only store and represent 10 minutes per page, and older pages should be provided by a paginated API.

UI, UX could also be improved. Unit tests should be finished (there are only a few examples) and e2e tests should also be implemented.