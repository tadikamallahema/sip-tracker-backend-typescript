import {db} from '../database/dbManager';
export const invalidToken:string[]=[];
export function addInvestorFromDB(data:any){
    return new Promise((resolve,reject)=>{
         const {investor_id,first_name,middle_name,last_name,pancard_no,adhaar_no,date_of_birth,gender,occupation,passport_no,password,email} = data;

         db.run(
            `INSERT INTO investor (investor_id,first_name,middle_name,last_name,pancard_no,adhaar_no,date_of_birth,gender,occupation,passport_no,password,email
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,
            [investor_id,first_name,middle_name,last_name,pancard_no,adhaar_no,date_of_birth,gender,occupation,passport_no,password,email],
            (err)=>{
                if(err){
                    //console.log(err);
                    reject(err);
                }else{
                    resolve({
                        message:'Investor Added'
                    })
                }
            }
         )
    })
}

export function fetchInvestorById(investorId:string){
    return new Promise((resolve,reject)=>{
        db.get(
            `select * from investor where investor_id=?`,[investorId],(err,row)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            }
        )
    })
}

export function loginInvestorFromDb(email:string,password:string){
    return new Promise((resolve,reject)=>{
        db.get(`
            select * from investor where email=? and password=?
            `,[email,password],(err,row)=>{
                if(err){
                    reject(err);
                }else if(!row){
                    resolve({
                        message:"Invalid email and password"
                    })
                }else{
                    resolve({
                        message:"Login successfull"
                    })
                }
            }
        )
    })
}

export function logoutInvestorFromDb(investor_id:string) {
    return new Promise((resolve, reject) => {
        db.get(
            `
            select * from investor where investor_id = ?
            `,
            [investor_id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve({
                     
                        message: "Investor Not Found"
                    });
                } else {
                    resolve({
                        message: "Logout Successful"
                    });
                }
            }
        );
    });
}
export function getInvestorHoldings(investor_id:string){
    return new Promise((resolve,reject)=>{
        db.all(
            `
            SELECT mf.fund_name,
                ROUND(SUM(t.units),2)AS total_units, mf.latest_nav,
                ROUND(SUM(t.units) * mf.latest_nav,2) AS current_value
            FROM transactions t
            JOIN sip s ON t.sip_id = s.sip_id
            JOIN mutual_fund mf ON t.fund_id = mf.fund_id
            WHERE s.investor_id = ?
            GROUP BY mf.fund_id
            `,
            [investor_id],
            (err,rows)=>{
                if(err){
                    //console.log(err);
                    reject(err);
                }else{
                    resolve(rows);
                }
            }
        );
    });
}
export function getInvestorNetworth(investor_id:string){
    return new Promise((resolve,reject)=>{
        db.get(
            `
            SELECT s.investor_id,
                ROUND(SUM(t.units * mf.latest_nav),2) AS total_networth
            FROM transactions t
            JOIN sip s
            ON t.sip_id = s.sip_id
            JOIN mutual_fund mf
            ON t.fund_id = mf.fund_id
            WHERE s.investor_id = ?
            `,
            [investor_id],
            (err,row)=>{
                if(err){
                    //console.log(err);
                    reject(err);
                }else{
                    resolve(row);

                }
            }
        );
    });
}
