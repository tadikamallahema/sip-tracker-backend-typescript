import {addFundToDB,fetchFunds,updateNav,} from "../models/fundModel";
import { Request, Response } from "express";

export const addFund = async (req: Request,res: Response) => {
  try {
    const result =await addFundToDB(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getFunds = async (req: Request,res: Response) => {
  try {
    const funds =await fetchFunds();
    return res.json(funds);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateFundNav = async (req: Request,res: Response) => {
  try {
    const fundId =req.params.fundId as string;
    const { latest_nav } =req.body;
    const result =await updateNav(fundId,latest_nav);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};