## kolledata 

[![Build Status](https://travis-ci.org/kollemate/kolledata.svg?branch=master)](https://travis-ci.org/kollemate/kolledata)

#### 1. Install node

Preferably from the [official site](http://nodejs.org/download/).

#### 2. Get this repo

```
$ git clone git@github.com:kollemate/kolledata.git && cd kolledata
```

#### 3. Install dependencies

```
$ npm install
```

#### 4. Create mysql config

```
$ cp example_mysqlconfig.js mysqlconfig.js
```

edit ```mysqlconfig.js``` to match your settings

```
exports.config = {
	host: "host",
	user: "user",
	password: "password",
	port: "port"
};
```
#### 5. Start your MySQL server

However this is handled for your system ;)

#### 6. Start the node server

```
node app.js
```

Port can be passed in as an environment variable, the default is ```8080```.
