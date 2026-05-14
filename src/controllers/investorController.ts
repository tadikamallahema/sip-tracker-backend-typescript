import {addInvestorFromDB,fetchInvestorById,loginInvestorFromDb,logoutInvestorFromDb,invalidToken,getInvestorHoldings,getInvestorNetworth,} from "../models/investorModel";
import { signJWT } from "../utility/authManager";
import { Request, Response } from "express";
export const addInvestor = async (req: Request,res: Response) => {
  try {
    const investor =await addInvestorFromDB(req.body);
    return res.json(investor);
  } catch (err) {
    //console.log(err);
    return res.status(500).json({message: "Server Error",});
  }
};

export const getInvestorById = async (req: Request,res: Response) => {
  try {
    const investorId = req.params.investorId as string;
    const investor =await fetchInvestorById(investorId);
    if (!investor) {
      return res.json({message: "No investor found",});
    }
    return res.json(investor);
  } catch (err) {
    //console.log(err);
    return res.status(500).json({message: "Server Error",});
  }
};

export const loginInvestor = async (req: Request,res: Response) => {
  const { email, password } = req.body;
  try {
    const result =await loginInvestorFromDb(email,password) as any;
    if (result.message ==="Invalid email and password") {
      return res.json(result);
    }
    const token = signJWT({ email,role: "investor",});
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 60 * 1000,
    });
    return res.json({message: "Login successful",});
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: "Server Error",});
  }
};

export const logoutInvestor = async (req: Request,res: Response) => {
  try {
    const token = req.cookies.token;
    const { investor_id } = req.body;
    const result =await logoutInvestorFromDb(investor_id) as any;
    if (result.message ==="Investor Not Found") {
      return res.json(result);
    }
    invalidToken.push(token);
    res.clearCookie("token");
    return res.json({message: "Logout Successful",});
  } catch (e) {
    //console.log(e);
    return res.status(500).json({message: "Server Error",});
  }
};

export const getHoldings = async (req: Request,res: Response) => {
  try {
    const investorId = req.params.investorId as string;
    const result =await getInvestorHoldings(investorId);
    return res.json(result);
  } catch (err) {
    //console.log(err);
    return res.status(500).json(err);
  }
};

export const getNetworth = async (req: Request,res: Response) => {
  try {
    const investorId = req.params.investorId as string;
    const result =await getInvestorNetworth(investorId);
    return res.json(result);
  } catch (err) {
   // console.log(err);
    return res.status(500).json(err);
  }
};