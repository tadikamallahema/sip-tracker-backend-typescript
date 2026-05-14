import { db } from "./dbManager";

export  const createTables = () => {
  db.serialize(() => {

    db.run(
        `CREATE TABLE IF NOT EXISTS  investor (
            investor_id varchar(10) PRIMARY KEY ,
            first_name varchar ,
            middle_name varchar,
            last_name varchar,
            pancard_no  varchar(10),
            adhaar_no varchar(12),
            date_of_birth DATE ,
            gender varchar,
            occupation varchar,
            passport_no varchar,
            password varchar,
            email varchar
            );`
    );

    db.run(`
            CREATE TABLE IF NOT EXISTS portfolio(
                portfolio_id INTEGER PRIMARY KEY AUTOINCREMENT,
                investor_id varchar(10) ,
                

                FOREIGN KEY(investor_id)
                REFERENCES investor(investor_id)
                ON DELETE CASCADE
            )
        `);

    db.run(`
        CREATE TABLE IF NOT EXISTS amc(
            amc_id INTEGER PRIMARY KEY AUTOINCREMENT,
            amc_name TEXT UNIQUE NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS mutual_fund(
            fund_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fund_name varchar ,
            amc_id INTEGER ,
            category varchar,
            latest_nav REAL NOT NULL,
            nav_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(amc_id)
            REFERENCES amc(amc_id)
            ON DELETE CASCADE
        )
    `);
     db.run(`
        CREATE TABLE IF NOT EXISTS sip(
            sip_id INTEGER PRIMARY KEY AUTOINCREMENT,
            investor_id varchar(10) ,
            fund_id INTEGER ,
            sip_amount REAL ,
            sip_date INTEGER ,
            start_date DATE,
            status TEXT DEFAULT 'ACTIVE',

            FOREIGN KEY(investor_id)
            REFERENCES investor(investor_id)
            ON DELETE CASCADE,

            FOREIGN KEY(fund_id)
            REFERENCES mutual_fund(fund_id)
            ON DELETE CASCADE
        )
    `);

     db.run(`
       CREATE TABLE IF NOT EXISTS transactions(
        transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        sip_id INTEGER,
        fund_id INTEGER,
        amount REAL,
        nav REAL,
        units REAL,
        transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(sip_id)
        REFERENCES sip(sip_id)
        ON DELETE CASCADE,

        FOREIGN KEY(fund_id)
        REFERENCES mutual_fund(fund_id)
        ON DELETE CASCADE)`
    );
  })
}
