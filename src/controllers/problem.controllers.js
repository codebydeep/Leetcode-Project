import db from "../libs/db.js"
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.libs.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"


// create-Problem controller -
const createProblem = asyncHandler(async(req, res) => {
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolution} = req.body
    
    if(req.user.role !== "ADMIN"){
        throw new ApiError(404, "You are not allowed to create a problem")
    }

    for(const [language, solutionCode] of Object.entries(referenceSolution)){
        const languageId = getJudge0LanguageId(language);
        
        if(!languageId){
               throw new ApiError(400, `Language ${language} is not supported!`);
        }
        
        const submissions = testcases.map(({input, output}) => ({
            source_code : solutionCode,
            language_id : languageId,
            stdin: input,
            expected_output : output,
        }))

        const submissionResults = await submitBatch(submissions)
        
        const tokens = submissionResults.map((res) => res.token)
        
        const results = await pollBatchResults(tokens)

        
        for(let i=0; i < results.length; i++){
            
            const result = results[i]
            console.log("Results-----", result);
            
            // console.log(
                // `Testcase ${i+1} and language ${language} -----result ${JSON.stringify(result.status.description)} `
                // );
                
                if(result.status.id !== 3){
                    throw new ApiError(400, `Testcase ${i + 1} failed for language ${language}`);
                };
        }
                
    }
            
        const newProblem = await db.problem.create({
            data: {
                title, 
                description,
                difficulty, 
                tags, 
                examples, 
                constraints, 
                testcases, 
                codeSnippets, 
                referenceSolution, 
                userId: req.user.id,
            }
        })

        return res.status(201).json(
            new ApiResponse(201, "Problem Created Successfully", {problem:newProblem})
        )

});


// get-All-Problems controller - 
const getAllProblems = asyncHandler(async(req, res) => {
    const problems = await db.problem.findMany();

    if(!problems){
        throw new ApiError(404, "No Problems found")
    }
    
    return res.status(200).json(
        new ApiResponse(200, "Problems fetched Successfully", {problems})
    )
})


// get-Problem-By-Id controller -
const getProblemById = asyncHandler(async(req, res) => {
    const {id} = req.params;

    const problem = await db.problem.findUnique({
        where: {
            id,
        }
    })

    if(!problem) throw new ApiError(404, "Problem not found")

    res.status(200).json(
        new ApiResponse(200, "Problem Fetched Successfully", {problem})
    )    
})
    

// update-Problem controller -
const updateProblem = asyncHandler(async(req, res) => {
    const {problemId} = req.params;

    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolution
    } = req.body
  
    const problem = await db.problem.findFirst({
        where: {
            id: problemId,
        }
    })

    if(!problem){
        throw new ApiError(404, "No Problem Found")
    }

    const updatedProblem = await db.problem.update({
        where: {
            id: problemId,
        },
        data: {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolution
        }
    });

    return res.status(200).json(
        new ApiResponse(200, "Problem Update Successfully")
    )
})

// delete-Problem controller - 
const deleteProblem = asyncHandler(async(req, res) => {
    const {id} = req.params;

    const problem = await db.problem.findUnique({
        where: {id}
    })

    if(!problem){
        throw new ApiError(404, "Problem Not Found")
    }

    await db.problem.delete(
        {
            where: {
                id
            }
        }
    )

    res.status(200).json(
        new ApiResponse(200, "Problem Deleted Successfully")
    )
})


// get-All-Problem-Solved-by-User controller -
const getAllProblemsSolvedByUser = asyncHandler(async(req, res) => {
    const problems = await db.problem.findMany({
        where: {
            solvedBy: {
                some: {
                    userId: req.userId,
                }
            }
        },
        include: {
            solvedBy: {
                where: {
                    userId: req.user.id,
                }
            }
        },
    });

    res.status(200).json(
        new ApiResponse(200, "Problems Fetched Successfully!", {problems})
    )
})


export {createProblem, getAllProblems, getProblemById, updateProblem, deleteProblem, getAllProblemsSolvedByUser}