## kolledata (working title) 

[![Build Status](https://travis-ci.org/kollemate/kolledata.svg?branch=master)](https://travis-ci.org/kollemate/kolledata)

#### 1. Install node

[Official Site](http://nodejs.org/download/)

#### 2. Get this repo

```
$ git clone git@github.com:kollemate/kolledata.git
```

#### 3. Install dependencies

```
$ npm install
```

#### 4. Create mysql config

```
$ cp example_mysqlconfig.js mysqlconfig.js
$ vim mysqlconfig.js
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