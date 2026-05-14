import express from 'express';
import { addInvestor,getInvestorById,loginInvestor,logoutInvestor,getHoldings,getNetworth } from '../controllers/investorController';
 const router=express.Router();
router.post('/',addInvestor);
router.get('/:investorId',getInvestorById);
router.post('/login',loginInvestor);
router.post('/logout',logoutInvestor);
router.get('/:investorId/holdings',getHoldings);
router.get('/:investorId/networth',getNetworth);

export default router;
