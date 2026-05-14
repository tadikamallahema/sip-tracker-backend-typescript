import { db } from "../database/dbManager";
export function createSip(data) {
    return new Promise((resolve, reject) => {
        const { investor_id, fund_id, sip_amount, sip_date, start_date, } = data;
        db.run(`
      INSERT INTO sip(
        investor_id,
        fund_id,
        sip_amount,
        sip_date,
        start_date
      )
      VALUES(?,?,?,?,?)
      `, [
            investor_id,
            fund_id,
            sip_amount,
            sip_date,
            start_date,
        ], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve({
                    message: "Sip Created",
                    sip_id: this.lastID,
                });
            }
        });
    });
}
export function getSipByIdFromDB(id) {
    return new Promise((resolve, reject) => {
        db.get(`
      SELECT *
      FROM sip
      WHERE sip_id=?
      `, [id], (err, row) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}
export function processSip(sip_id) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            db.get(`
        SELECT *
        FROM sip
        WHERE sip_id=?
        `, [sip_id], (err, sip) => {
                if (err || !sip) {
                    db.run("ROLLBACK");
                    return reject({
                        message: "SIP not found",
                    });
                }
                db.get(`
            SELECT *
            FROM mutual_fund
            WHERE fund_id=?
            `, [sip.fund_id], (err, fund) => {
                    if (err || !fund) {
                        db.run("ROLLBACK");
                        return reject({
                            message: "Fund not found",
                        });
                    }
                    const nav = fund.latest_nav;
                    const units = sip.sip_amount / nav;
                    db.run(`
                INSERT INTO transactions(
                  sip_id,
                  fund_id,
                  amount,
                  nav,
                  units
                )
                VALUES(?,?,?,?,?)
                `, [
                        sip.sip_id,
                        sip.fund_id,
                        sip.sip_amount,
                        nav,
                        units,
                    ], function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            return reject(err);
                        }
                        db.run("COMMIT");
                        resolve({
                            message: "SIP Processed",
                            transaction_id: this.lastID,
                        });
                    });
                });
            });
        });
    });
}
export function getSipTransactions(sip_id) {
    return new Promise((resolve, reject) => {
        db.all(`
      SELECT
        transaction_id,
        sip_id,
        fund_id,
        amount,
        nav,
        units,
        transaction_date
      FROM transactions
      WHERE sip_id=?
      `, [sip_id], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
export function getAllTransactionFromDb() {
    return new Promise((resolve, reject) => {
        db.all(`
      SELECT *
      FROM transactions
      `, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
