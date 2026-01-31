const express= require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminmiddleware')
const {createProblem, updateProblem, deleteProblem,getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem}  = require('../controllers/userProblem');
const userMiddleware = require('../middleware/usermiddelware')

problemRouter.post('/create',adminMiddleware, createProblem);
problemRouter.put('/update/:id', adminMiddleware, updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware, deleteProblem);

problemRouter.get('/problemById/:id',userMiddleware, getProblemById);
problemRouter.get('/getAllproblem',userMiddleware, getAllProblem);
problemRouter.get('/problemSolvedByUser',userMiddleware,  solvedAllProblembyUser);
problemRouter.get('/submittedProblem/:id', userMiddleware, submittedProblem)

module.exports = problemRouter;