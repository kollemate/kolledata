## kolledata

[![Build Status](https://travis-ci.org/kollemate/kolledata.svg?branch=master)](https://travis-ci.org/kollemate/kolledata)

#### 1. Install node

Preferably from the [official site](http://nodejs.org/download/).

#### 2. Clone the repo

```
$ git clone https://github.com/kollemate/kolledata.git && cd kolledata
```

#### 3. Install dependencies

```
$ npm install
```

#### 4. Create MySQL config

```
$ cp example_mysqlconfig.js mysqlconfig.js
```

edit ```mysqlconfig.js``` to match your settings

```
exports.config = {
	host: "host",
	user: "user",
	password: "password"
	// port: "port"
};
```

The last line can be uncommented if your MySQL port is not the standard `3306`.

#### 5. Start your MySQL server

#### 6. Setup the kolledata database

...
$ mysql -u USERNAME -p -h HOST < database/scripts/setup.sql
...

#### 7. Start the server

```
node app.js
```

Port can be passed in as an environment variable, the default is ```8080```.
