const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'problem', 
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['cpp', 'java', 'javascript'], 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'error', 'wrong', 'Compilation Error', 'Runtime Error', 'Time Limit Exceeded'],
    default: 'Pending'
  },
  runtime: {
    type: Number, // in milliseconds
    default: null
  },
  memory: {
    type: Number, // in KB or MB
    default: null
  },
  errorMessage:{
    type:String,
    default:""
  },
  testCasesPassed:{
    type:Number,
    default:0

  },
  testCasesTotal:{
    type:Number,
    default:0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
},{
    timestamps:true
});

module.exports = mongoose.model('submission', submissionSchema);