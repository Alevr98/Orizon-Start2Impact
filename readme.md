### Configuration guidel

```
git clone https://github.com/Alevr98/Orizon-Start2Impact.git
```

In the folder project:

```
npm install
```

create .env file with the following content:

```
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/Orizon_db
API_PORT=3000
API_PORT_UNIT_TEST=3001
```

==Please make sure to call the database "Orizon_db".==
Let's now run

```
npx prisma generate
```

and then

```
npx prisma migrate
```
let's now run the populate.js files in order to generate random data for our API:

```
node ./src/populate.js
```

Now the application is finally ready, you can run it with:

```
npm start
```

Tests can be performed with:
```
npx jest
```