import jwt from 'jsonwebtoken';
import {Request,Response,NextFunction} from 'express';
const { invalidToken } = require('../models/investorModel');
const secret='mysecret';

export function signJWT(payload:any){
   try{
     const token=jwt.sign(payload,secret,{
        expiresIn:'35m'
     });
     return token;
   }catch(exception){
      console.log(exception);
      return undefined;
   }
   
}

export function verifyJWT(token:string){
   try{
      const payload=jwt.verify(token,secret);
      return payload;
   }catch(exception){
      console.error(exception)
     return {status:401,message:'Invalid token',"error":exception};
   }
};

export const investorAuth=(req:Request,res:Response,next:NextFunction)=>{
   try{
      const token=req.headers.authorization;
      if(!token){
         return res.json("Token required");
      }
      if(invalidToken.find((t:string)=>t===token)){
         return res.json("Token expired");
      }
      const payload:any=verifyJWT(token);
      if(payload.role!=='investor')
      {
         return res.json("Authorization failed");
      }
      next();
   }catch(e){
      return res.json({
         message:"Authorization failed",
      })

   }
}

