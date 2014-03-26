## kolledata (working title) 

[![image](http://img.shields.io/badge/gitter-kolledata-brightgreen.svg)](https://gitter.im/kiliankoe/kolledata)


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
$ mv example_mysqlconfig.js mysqlconfig.js
$ emacs mysqlconfig.js
```

edit to match your settings

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