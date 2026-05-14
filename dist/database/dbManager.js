import sqlite3 from 'sqlite3';
export const db = new sqlite3.Database('E:\\Database\\sip-db', (error) => {
    if (error) {
        console.error(error);
    }
    else {
        console.log("DB connected successfully");
    }
});
db.run("PRAGMA foreign_keys = ON");
