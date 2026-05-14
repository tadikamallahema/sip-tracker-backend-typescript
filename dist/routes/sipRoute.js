import express from 'express';
import { addSip, getAllTransactions, getTransactions, processSipInstallment, getSipById } from '../controllers/sipController';
const router = express.Router();
router.post('/', addSip);
router.get('/transactions', getAllTransactions);
router.get('/:sipId/transactions', getTransactions);
router.post('/:sipId/process', processSipInstallment);
router.get('/:id', getSipById);
export default router;
