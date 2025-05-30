import { ApiError } from "../utils/api-error"
import { asyncHandler } from "../utils/async-handler.js"

const executeCode = asyncHandler((req, res) => {
    const {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId
    } = req.body

    const userId = req.user.id

    if(
        !Array.isArray(stdin) || 
        stdin.length === 0 || 
        !Array.isArray(expected_outputs) || 
        expected_outputs.length !== stdin.length
    ){
        return res.status(400).json({
            error: "Invalid or Missing Test Cases"
        })
    }

    const submissions = stdin.map((input) =>({
        source_code,
        language_id,
        stdin: input
    }))

    const submitResponse = submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    const results = pollBatchResults(tokens);

    console.log(`Results----------`);
    console.log(results);

    res.status(200).json(
        new ApiError(200, {message: "Code Executed"})
    )
})

export default executeCode