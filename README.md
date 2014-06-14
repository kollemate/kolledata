## kolledata

[![Build Status](https://travis-ci.org/kollemate/kolledata.svg?branch=master)](https://travis-ci.org/kollemate/kolledata)

#### 1. Install node

Preferably from the [official site](http://nodejs.org/download/).

#### 2. Install a MySQL server

The original MySQL and [MariaDB](https://mariadb.org/) have been tested and work fine without any differences in the following steps. MariaDB is a clear recommendation because of severe *awesomness*.

#### 3. Clone the repo

```
$ git clone https://github.com/kollemate/kolledata.git && cd kolledata
```

#### 4. Install dependencies

If you don't have Bower installed you might need to run ```sudo npm install -g bower``` first.

```
$ npm install
$ bower install
```

#### 5. Create MySQL config

```
$ cp example_mysqlconfig.js mysqlconfig.js
```

edit ```mysqlconfig.js``` to match your settings

```
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

If your distribution uses systemd, type:

```
$ sudo systemctl restart mysqld.service
```

or


```
$ sudo systemctl enable mysqld.service
```
if you want to start the MySQL server at boot.


#### 7. Setup the kolledata database

```
$ mysql -u USERNAME -p -h HOST < database/scripts/setup.sql
```

You might want to add some example data as well:

```
$ mysql -u USERNAME -p -h HOST < database/scripts/insertExampleData.sql
```

#### 8. Start the server

```
node app.js
```

The server can now be viewed at [localhost:8080](localhost:8080) at the default port. This can be passed in as an environment variable if you want a different port.

### Troubleshooting

Make sure you've installed all the dependencies with bower *and* npm ([step 4](#4-install-dependencies)).

Is your MySQL server running and are the correct details in your `mysqlconfig.js` ([step 5](#5-create-mysql-config))?

Something entirely different? Please write an [issue](https://github.com/kollemate/kolledata/issues) :)
