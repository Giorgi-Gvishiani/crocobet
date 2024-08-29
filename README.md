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
$ cp .env.example .env
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

## [Swagger documentation](http://localhost:3000/api-docs)

## Test

At first need to create .env.test file update secrets for test env.
```bash
$ cp .env.example .env.test
```

```l
# unit tests
$ yarn run test
```

```bash
# integration tests
$ yarn run test:e2e
```