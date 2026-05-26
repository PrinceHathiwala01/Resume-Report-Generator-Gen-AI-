const mongoose = require("mongoose");

//This is the sub schema for technicalQuestion section
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

//This is the sub schema for behaviourQuestion section
const behaviourQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Behaviour question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

//This is the sub schema for skillGap section
const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum:["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
}, {
    _id: false
})

//This is sub schema for preparation plan
const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Plan is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    task: [{
        type: String,
        required: [true, "Task is required"]
    }]
}, {
    _id: false
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type:String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviourQuestions: [behaviourQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User_detail"
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
}, { timestamps: true })


const interviewReportModel = mongoose.model("Interview_Report", interviewReportSchema);
module.exports = interviewReportModel;
