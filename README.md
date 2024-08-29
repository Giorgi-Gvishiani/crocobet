## Docker compose
It will run mongodb and redis in container.

```bash
$ docker compose up
```

## Installation

```bash
$ yarn install --frozen-lockfile
```

```bash
$ cp env.example .env
```


## Running the app

```bash
# development
$ yarn run start
```

```bash
# watch mode
$ yarn run start:dev
```

```bash
# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test
```

```bash
# integration tests
$ yarn run test
```