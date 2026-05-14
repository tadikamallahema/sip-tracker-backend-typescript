import { createSip, getSipByIdFromDB, processSip, getSipTransactions, getAllTransactionFromDb, } from "../models/sipModel";
export const addSip = async (req, res) => {
    try {
        const result = await createSip(req.body);
        return res.json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
export const getSipById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await getSipByIdFromDB(id);
        return res.json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
export const processSipInstallment = async (req, res) => {
    try {
        const sipId = req.params.sipId;
        const result = await processSip(sipId);
        return res.json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
export const getTransactions = async (req, res) => {
    try {
        const sipId = req.params.sipId;
        const result = await getSipTransactions(sipId);
        return res.json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
export const getAllTransactions = async (req, res) => {
    try {
        const result = await getAllTransactionFromDb();
        return res.json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
