# NC News Seeding

In order to use this repo you will need to create 2 .env files:
in the root directory of the repository create:
a file named .env.development
a file named .env.test

In the .env.development file create this line:
PGDATABASE = nc_news

In the .env.test file create this line:
PGDATABASE = nc_news_test

If you are on Ubuntu then you will also need to add these lines to BOTH .env files
and replace with your psql username and password:
PGUSER = 'your_psql_username'
PGPASSWORD = 'your_psql_password'

to set your psql password type into the terminal:
psql postgres
\password 'your_username'

a prompt should appear to enter your new password
