# Airlines Promos API

**Step 1**: Clone the repository:

```sh
git clone
```

**Step 2**: Install dependencies (this project uses `pnpm`):

```sh
pnpm install
```

**Step 3**: Setup your environment variables:

This project uses [doppler](https://www.doppler.com/) to manage the env vars, and all you have to do is create a project in doppler, and setup your project:

```sh
doppler login
```

```sh
doppler setup
```

In case you want to use local variables, create a `.env` file and add the proper keys and secrets (you can check the variables reference on `.env.example`):

```sh
touch .env
```

**Step 4**: Run the migrations:

```sh
pnpm run migrate:dev
```

**Step 5**: Run the local development server:

```sh
pnpm run dev
```

The API will be available on `http://localhost:{PORT}`, where `PORT` will be the PORT that you chose in the env variables or `3333` if not specified.
