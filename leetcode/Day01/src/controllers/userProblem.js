const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");
const problem = require("../models/problem");
const User = require('../models/user');
const submission = require("../models/submission");

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      console.log("Submitting batch:", submissions);
      const submitResult = await submitBatch(submissions);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res
          .status(500)
          .send("Judge0 failed to return submission tokens");
      }

      console.log("submitResult", submitResult);
      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);
      if (!testResult) {
        return res
          .status(500)
          .send("Judge0 failed to return execution results");
      }

      for (const test of testResult) {
        const statusId = test.status?.id;
        if (statusId === 4) return res.status(400).send("Wrong Answer");
        if (statusId === 5) return res.status(400).send("Time Limit Exceeded");
        if (statusId === 6) return res.status(400).send("Compilation Error");
        if (statusId === 7) return res.status(400).send("Runtime Error");
        if (statusId !== 3) {
          return res
            .status(400)
            .send(
              `Judge0 returned status ${statusId}: ${
                test.status?.description || "Unknown"
              }`
            );
        }
      }
    }

    const userProblem = await problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    return res.status(201).send({
      message: "Problem created successfully",
      data: userProblem,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    if(!id)
    {
      return  res.status(400).send("Invalid or missing Id")
    }

   const Dsaproblem =  problem.findById(id);
   if(!Dsaproblem)
   {
   return res.status(404).send("Id is not present in server")
   }
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      console.log("Submitting batch:", submissions);
      const submitResult = await submitBatch(submissions);

      if (!submitResult || !Array.isArray(submitResult)) {
        return res
          .status(500)
          .send("Judge0 failed to return submission tokens");
      }

      console.log("submitResult", submitResult);
      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);
      if (!testResult) {
        return res
          .status(500)
          .send("Judge0 failed to return execution results");
      }

      for (const test of testResult) {
        const statusId = test.status?.id;
        if (statusId === 4) return res.status(400).send("Wrong Answer");
        if (statusId === 5) return res.status(400).send("Time Limit Exceeded");
        if (statusId === 6) return res.status(400).send("Compilation Error");
        if (statusId === 7) return res.status(400).send("Runtime Error");
        if (statusId !== 3) {
          return res
            .status(400)
            .send(
              `Judge0 returned status ${statusId}: ${
                test.status?.description || "Unknown"
              }`
            );
        }
      }
    }
    const newProblem= await problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true})
    res.status(200).send(newProblem)

  } catch (err) {
    res.status(400).send("Error"+err);

  }
};

const deleteProblem = async (req, res)=>{
    const {id} = req.params
    try
    {
            if(!id){
                    return res.status(400).send("invalid ID");
            }
            const Dsaproblem =  problem.findById(id);
            if(!Dsaproblem)
            {
            return res.status(404).send("Id is not present in server")
            }

           const deletedproblem = await problem.findByIdAndDelete(id);
            if(!deletedproblem)
            {
                return res.status(404).send("not delete or missing problem")
            }

            res.status(200).send("successfully deleted");

    }
    catch(err)
    {
        res.status(500).send("error"+err);

    }

    
    

}

const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Invalid ID or ID is missing");
        }

        const problemData = await problem.findById(id)
            .select('_id title description difficulty tags visibleTestCases startCode');

        if (!problemData) {
            return res.status(404).send("Problem not found");
        }

        res.status(200).json(problemData); //  .json for object response
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
};

const getAllProblem = async (req, res) => {
    try {
        const problems = await problem.find({}).select('_id title difficulty tags'); //  Await the result

        if (problems.length === 0) {
            return res.status(404).send("No problems found");
        }

        res.status(200).json(problems); //  Send resolved data
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
};
 
const solvedAllProblembyUser = async (req, res)=>{
    try{

        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"

        });
        res.status(200).send(user.problemSolved);

    }
    catch(err){
res.status(500).send("Error: " + err.message);

    }
}


const submittedProblem = async (req, res)=>
{
    try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await submission.find({userId, problemId});

    if(ans.length===0){
        res.status(200).send("no of submission is present");
    }

    res.status(200).send(ans);

    }
    catch(err){
        res.status(500).send("Error: " + err.message);

    }

}



module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem };
