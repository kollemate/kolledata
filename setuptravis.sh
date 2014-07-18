#! /bin/sh

echo "1. Creating MySQL config file"
cp -n example_mysqlconfig.js mysqlconfig.js

sed '2s/"host"/"127.0.0.1"/' mysqlconfig.js > tmpconfig.js
sed '4s/"user"/"root"/' tmpconfig.js > tmpconfig2.js
sed '5s/"password"/""/' tmpconfig2.js > tmpconfig3.js
rm -f tmpconfig.js
rm -f tmpconfig2.js
rm -f mysqlconfig.js
mv tmpconfig3.js mysqlconfig.js
# Never ever... EVER judge me on something I write in my bash scripts!

echo "2. Setting up the databases"
mysql -u root -h 127.0.0.1 < database/scripts/setup.sql
mysql -u root -h 127.0.0.1 < database/scripts/insertExampleData.sql
