#! /bin/sh

# this script will perform basic setup and get you ready to start the app
# node & mysql should already be installed and running

# TODO: how could we make this work with travis? maybe prefill the variables/default fallback?
echo "What's your MySQL host? (Probably localhost)"
read -e HOST

echo "What's your MySQL user? (Probably root)"
read -e USERNAME

echo "That user's password for accessing the database? (Probably root as well)"
read -e PASSWORD

echo "What's your MySQL port? (default is 3306)"
read -e PORT



# 1. install npm and bower dependencies

echo "1. Installing necessary dependencies through npm and bower"
npm install         # also installs dev-dependencies
bower install



# 2. create mysql config

echo "2. Creating MySQL config file"
cp -n example_mysqlconfig.js mysqlconfig.js

# TODO: Editing JSON in bash is super simple, just like editing basically *anything* else... AWK \o/


# 3. setup the databases if not there already

echo "3. Setting up the databases"
while true; do
    read -p "Do you want to set up the kolledata MySQL database? (y/n)" yn
    case $yn in
        [Yy]* ) mysql -u $USERNAME -p $PASSWORD -h $HOST < database/scripts/setup.sql; break;;
        [Nn]* ) break;;
        * ) echo "Please answer yes or no.";;
    esac
done

while true; do
    read -p "Do you want to pre-fill the database with some sample entries? (y/n)" yn
    case $yn in
        [Yy]* ) mysql -u $USERNAME -p $PASSWORD -h $HOST < database/scripts/insertExampleData.sql; break;;
        [Nn]* ) break;;
        * ) echo "Please answer yes or no.";;
    esac
done



echo "You're all set, run \`node app.js\` to start the application"
