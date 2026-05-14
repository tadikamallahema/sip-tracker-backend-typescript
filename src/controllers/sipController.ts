import {createSip,getSipByIdFromDB,processSip,getSipTransactions,getAllTransactionFromDb,} from "../models/sipModel";
import { Request, Response } from "express";
export const addSip = async (req: Request,res: Response) => {
  try {
    const result =await createSip(req.body);
    return res.json(result);
  } catch (err) {
    //console.log(err);
    return res.status(500).json(err);
  }
};

export const getSipById = async (req: Request,res: Response) => {
  const id = req.params.id as string;
  try {
    const result =await getSipByIdFromDB(id);
    return res.json(result);
  } catch (err) {
    //console.log(err);
    return res.status(500).json(err);
  }
};

export const processSipInstallment =async (req: Request,res: Response) => {
  try {
    const sipId =req.params.sipId as string;
    const result =await processSip(sipId);
    return res.json(result);
  } catch (err) {
   // console.log(err)
    return res.status(500).json(err);
  }
};

export const getTransactions =async (req: Request,res: Response) => {
  try {
    const sipId =req.params.sipId as string;
    const result =await getSipTransactions(sipId);
    return res.json(result);
  } catch (err) {
    //console.log(err);
    return res.status(500).json(err);
  }
};

export const getAllTransactions =async (req: Request,res: Response) => {
  try {
    const result =await getAllTransactionFromDb();
    return res.json(result);
  } catch (err) {
    //console.log(err);
    return res.status(500).json(err);
  }
};