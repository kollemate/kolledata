## kolledata (working title)


#### 1. Install node

[Official Site](http://nodejs.org/download/)

#### 2. Get this repo

```
$ git clone <this repo>
```

#### 3. Install dependencies

```
$ npm install
```

#### 4. Create mysql config

```
$ emacs mysqlconfig.js
```

```
exports.config = {
	host: "host",
	user: "user",
	password: "password",
	port: "port"
};
```

#### 5. Start the server

```
node app.js
```