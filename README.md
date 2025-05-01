# NC News Seeding

In order to use this repo you will need to create 3 .env files in the root directory of the repository with the following names:
.env.development
.env.test
.env.production

In the .env.development file add the following line with NO spaces or quotation marks:
PGDATABASE=nc_news

In the .env.test file add the following line with NO spaces or quotation marks:
PGDATABASE=nc_news_test

In the .env.production file add the following line:
DATABASE_URL=

For Ubuntu users or Ubuntu running on WSL:
If you are using Ubuntu then you will also need to add the following two lines to BOTH .env files. Replace with your psql username and password.
Make sure there are NO spaces or quotation marks.

PGUSER=your_psql_username
PGPASSWORD=your_psql_password

To set your psql password type into the terminal:
psql postgres

followed by:
\password your_username

A prompt should appear to enter your new password

db password:
Tcy4PDQhnajic16o
