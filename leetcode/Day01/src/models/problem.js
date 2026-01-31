const mongoose = require('mongoose');
const {Schema} = mongoose;

const problemSchema = new Schema (
    {
        title:{
            type:String,
            required: true,
        },
        description:{
            type:String,
            required: true,
        },
        difficulty:{
            type:String,
            enum: ['easy', 'meduim', 'hard'],
            required: true,
        },
        tags:{
            type: [String],
            enum: ['array', 'string', 'linkedlist', 'tree', 'graph', 'dynamic programming', 'greedy', 'backtracking', 'sorting', 'searching'],
            required: true,
        },
        visibleTestCases:[
            {
                input:{
                    type: String,
                    required: true,
                },
                output:{
                    type: String,
                    required: true,
                },
                explanation:{
                    type: String,
                    required: true,
                }
            }
        ],
        hiddenTestCases:[
            {
                input:{
                    type: String,
                    required: true,
                },
                output:{
                    type: String,
                    required: true,
                }
            }
        ],
        startCode:[
            {
                language:{
                    type: String,
                    // enum: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'swift'],
                    required: true,
                },
                initialCode:{
                    type: String,
                    required: true,
                }
            }
        ],
        referenceSolution:[
            {
                language:{
                    type: String,
                    // enum: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'swift'],
                    required: true,
                },
                completeCode:{
                    type: String,
                    required: true,
                }
            }
        ],
        problemCreator:{
            type: Schema.Types.ObjectId,
            ref: 'user',   // Reference to the User model
            required: true,
        },
    }
)
const Problem = mongoose.model('problem', problemSchema);
module.exports = Problem;
