import { db } from "../database/dbManager";

export function addFundToDB(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const {fund_name,amc_id,category,latest_nav,} = data;
    db.run(
      `
      INSERT INTO mutual_fund(fund_name,amc_id,category,latest_nav)  VALUES(?,?,?,?)
      `,
      [fund_name,amc_id,category,latest_nav,],
      function (err: Error | null) {
        if (err) {
          //console.log(err);
          reject(err);
        } else {
          resolve({
            message:"Fund Added Successfully",
          });
        }
      }
    );
  });
}

export function fetchFunds():Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM mutual_fund
      `,[],
      (err: Error | null,rows: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

export function updateNav(fundId: string,latest_nav: number): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE mutual_fund
      SET latest_nav = ?,
      nav_updated_at = CURRENT_TIMESTAMP
      WHERE fund_id = ?
      `,
      [latest_nav, fundId],
      function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve({
            message:"NAV Updated Successfully",
          });
        }
      }
    );
  });
}