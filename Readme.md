## How to start

It has to be an `.env` file. Sample: `.env-sample`

### Checking node version

```bash
node -v # 16.14.0
```

### Installing packages

```bash
npm install
```

### Start server

```bash
npm run start # listens via port number in local .env file
# or
npm run dev
```

## Documentation

[http://localhost:8080/api-docs](http://localhost:8080/api-docs)

## Socket

[ws://localhost:9093](ws://localhost:9093)

#### Events
* online
  * message: string
* offline
  * message: string
* register
  * message: string

## Migrations

### How to create a migration

```bash
npm run migration:add -- --name="$migrationName"
```

### How to run migrations

```bash
npm run migration:up
```

### How to undo migration

```bash
npm run migration:down
```

## Test

### How to run unit test

```bash
npm run test:unit
```

### How to run integration test

```bash
npm run test:integration
```
