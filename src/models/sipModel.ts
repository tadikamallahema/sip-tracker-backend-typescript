import { db } from "../database/dbManager";

export function createSip(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const {investor_id,fund_id,sip_amount,sip_date,start_date,} = data;
    db.run(
      `
      INSERT INTO sip(investor_id,fund_id,sip_amount,sip_date,start_date)
      VALUES(?,?,?,?,?)
      `,
      [investor_id,fund_id,sip_amount,sip_date,start_date,],
      function (err: Error | null) {
        if (err) {
          //console.log(err);
          reject(err);
        } else {
          resolve({message: "Sip Created",sip_id: this.lastID,});
        }
      }
    );
  });
}

export function getSipByIdFromDB(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT * FROM sip WHERE sip_id=?
      `,
      [id],
      (err: Error | null, row: any) => {
        if (err) {
          //console.log(err);
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

export function processSip(sip_id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      db.get(
        `SELECT * FROM sip WHERE sip_id=?
        `,
        [sip_id],
        (err: Error | null, sip: any) => {
          if (err || !sip) {
            db.run("ROLLBACK");
            return reject({message: "SIP not found",});
          }
          db.get(
            `
            SELECT *
            FROM mutual_fund
            WHERE fund_id=?
            `,
            [sip.fund_id],
            (err: Error | null, fund: any) => {
              if (err || !fund) {
                db.run("ROLLBACK");
                return reject({message: "Fund not found",});
              }
              const nav = fund.latest_nav;
              const units =sip.sip_amount / nav;
              db.run(
                `
                INSERT INTO transactions(sip_id,fund_id,amount,nav,units)
                VALUES(?,?,?,?,?)
                `,
                [sip.sip_id,sip.fund_id,sip.sip_amount,nav,units,],

                function (err: Error | null) {
                  if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                  }
                  db.run("COMMIT");
                  resolve({message: "SIP Processed",transaction_id:this.lastID,
                  });
                }
              );
            }
          );
        }
      );
    });
  });
}

export function getSipTransactions(sip_id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT transaction_id,sip_id,fund_id,amount,nav,units,transaction_date FROM transactions
      WHERE sip_id=?
      `,
      [sip_id],
      (err: Error | null, rows: any) => {
        if (err) {
          //console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

export function getAllTransactionFromDb():Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM transactions
      `,
      (err: Error | null, rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}