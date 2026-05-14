import sqlite3 from 'sqlite3';
export const db = new sqlite3.Database("C:/Users/Dell/Documents/WebileApps/Traning may4/Backend codes may4-9/Database/sip_usage.db",
    (error) => {
        if(error){
            console.error(error);
        }else{
            console.log("DB connected successfully");
        }
    }
);
db.run("PRAGMA foreign_keys = ON");
