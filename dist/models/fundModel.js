import { db } from "../database/dbManager";
export function addFundToDB(data) {
    return new Promise((resolve, reject) => {
        const { fund_name, amc_id, category, latest_nav, } = data;
        db.run(`
      INSERT INTO mutual_fund(
        fund_name,
        amc_id,
        category,
        latest_nav
      )
      VALUES(?,?,?,?)
      `, [
            fund_name,
            amc_id,
            category,
            latest_nav,
        ], function (err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve({
                    message: "Fund Added Successfully",
                });
            }
        });
    });
}
export function fetchFunds() {
    return new Promise((resolve, reject) => {
        db.all(`
      SELECT *
      FROM mutual_fund
      `, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}
export function updateNav(fundId, latest_nav) {
    return new Promise((resolve, reject) => {
        db.run(`
      UPDATE mutual_fund
      SET latest_nav = ?,
      nav_updated_at = CURRENT_TIMESTAMP
      WHERE fund_id = ?
      `, [latest_nav, fundId], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    message: "NAV Updated Successfully",
                });
            }
        });
    });
}
