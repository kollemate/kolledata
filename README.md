## kolledata

[![buildstatus](http://img.shields.io/travis/kollemate/kolledata.svg?style=flat)](https://travis-ci.org/kollemate/kolledata)
[![githubissues](http://img.shields.io/github/issues/kollemate/kolledata.svg?style=flat)](https://github.com/kollemate/kolledata/issues)
[![release](http://img.shields.io/github/release/kollemate/kolledata.svg?style=flat)](https://github.com/kollemate/kolledata/releases)
[![dependencies](http://img.shields.io/david/kollemate/kolledata.svg?style=flat)](https://david-dm.org/kollemate/kolledata)
[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/kollemate/kolledata/master/LICENSE)

#### 1. Install node

Preferably from the [official site](http://nodejs.org/download/).

#### 2. Install a MySQL server

The original MySQL and [MariaDB](https://mariadb.org/) have been tested and work fine without any differences in the following steps. MariaDB is a clear recommendation because of severe *awesomness*.

#### 3. Clone the repo

```bash
$ git clone https://github.com/kollemate/kolledata.git && cd kolledata
```

#### 4. Install dependencies

If you don't have Bower installed you might need to run ```sudo npm install -g bower``` first.

```bash
$ npm install
$ bower install
```

#### 5. Create MySQL config

```bash
$ cp ./config/example_mysqlconfig.js ./config/mysqlconfig.js
```

edit ```./config/mysqlconfig.js``` to match your settings

```js
exports.config = {
    host: "host",
    // port: "port",
    user: "user",
    password: "password",
    database: "kolledata"
};
```

The port line can be uncommented if your MySQL port is not the standard `3306`.

#### 6. Start your MySQL server

If your linux distribution uses systemd, use one of the following commands if you want to start the MySQL server at boot.

```bash
$ sudo systemctl restart mysqld.service
$ sudo systemctl enable mysqld.service
```

Or... you know, just start your MAMP, XAMPP or whatever right now.



#### 7. Setup the kolledata database

```bash
$ mysql -u USERNAME -p -h HOST < database/scripts/setup.sql
```

You might want to add some example data as well:

```bash
$ mysql -u USERNAME -p -h HOST < database/scripts/insertExampleData.sql
```

#### 8. Start the server

```bash
node app.js
```

The server can now be viewed at [localhost:8080](localhost:8080) at the default port. This can be passed in as an environment variable if you want a different port.

### Troubleshooting

Make sure you've installed all the dependencies with bower *and* npm ([step 4](#4-install-dependencies)).

Is your MySQL server running and are the correct details in your `mysqlconfig.js` ([step 5](#5-create-mysql-config))?

Something entirely different? Please write an [issue](https://github.com/kollemate/kolledata/issues) :)
