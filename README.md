# NC News Seeding

Link to the hosted project: https://nc-news-seedingproject.onrender.com

## **Installation**

postgres v8.15.6 at least is required
node v23.6.1 at least is required

`git clone https://github.com/gmharper/nc-news_seedingProject.git`
`npm install`

## **Setup**

Create 2 files in the root directory of the cloned repository with the following names:

- .env.development
- .env.test

For the following make sure they are formatted exactly as below with NO spaces or quotation marks
In the .env.development file add the following line

- PGDATABASE=nc_news

In the .env.test file add the following line with NO spaces or quotation marks:

- PGDATABASE=nc_news_test

### Ubuntu or WSL users

If you are using ubuntu on linux or WSL then you will also need to add the following two lines to BOTH .env files. Replace with your psql username and password.
Make sure there are NO spaces or quotation marks.

- PGUSER=your_psql_username
- PGPASSWORD=your_psql_password

To set your psql password type into the terminal:
`psql postgres`
`\password your_username`

Enter your new password into the terminal prompt
