import { useCallback, useState } from "react";
import { getInterviewReport } from "../services/interview.api";

const DUMMY_REPORT = {
    _id: "dummy",
    matchScore: 82,
    resume: "Dummy resume content for preview mode.",
    technicalQuestions: [
        {
            question: "How would you design a scalable authentication flow for this role?",
            intention: "Checks your ability to think about security, sessions, tokens, and user experience together.",
            answer: "Start with secure password handling, token or session strategy, refresh behavior, route protection, and logout/token invalidation. Mention rate limiting, validation, and monitoring."
        },
        {
            question: "How would you debug a slow API endpoint in production?",
            intention: "Tests practical troubleshooting and performance diagnosis.",
            answer: "Inspect logs and metrics, reproduce with realistic inputs, profile database queries, check network latency, add tracing, then optimize the most expensive operation first."
        },
        {
            question: "What makes a React component reusable without becoming over-engineered?",
            intention: "Looks for balanced component design judgment.",
            answer: "Keep clear props, isolate state carefully, avoid hidden side effects, support composition, and only abstract after repeated usage patterns are visible."
        }
    ],
    behaviourQuestions: [
        {
            question: "Tell me about a time you handled unclear requirements.",
            intention: "Evaluates communication, ownership, and ambiguity handling.",
            answer: "Use the STAR format. Explain how you clarified goals, documented assumptions, shared tradeoffs, and delivered an incremental result."
        },
        {
            question: "How do you respond when you are blocked?",
            intention: "Checks collaboration and ownership.",
            answer: "Explain that you investigate first, collect useful context, then communicate early with specific asks and possible paths forward."
        }
    ],
    skillGaps: [
        { skill: "Redis", severity: "medium" },
        { skill: "Message queues", severity: "high" },
        { skill: "Testing strategy", severity: "medium" },
        { skill: "System design", severity: "low" }
    ],
    preparationPlan: [
        {
            day: 1,
            focus: "Core role fundamentals",
            task: ["Revise the job description keywords", "Prepare concise project explanations", "Practice two technical questions"]
        },
        {
            day: 2,
            focus: "Backend and async concepts",
            task: ["Review queues and background jobs", "Practice event loop explanations", "Map one system design flow"]
        },
        {
            day: 3,
            focus: "Mock interview readiness",
            task: ["Run a 45-minute mock interview", "Refine STAR stories", "Review weak answers and rewrite them"]
        },
        {
            day: 4,
            focus: "Project deep dive",
            task: ["Pick two strongest projects", "Prepare architecture explanations", "List tradeoffs and improvements"]
        },
        {
            day: 5,
            focus: "Data structures and problem solving",
            task: ["Practice arrays and strings", "Solve two medium problems", "Explain time and space complexity aloud"]
        },
        {
            day: 6,
            focus: "System design basics",
            task: ["Review caching and queues", "Design a simple notification system", "Prepare scaling bottleneck notes"]
        },
        {
            day: 7,
            focus: "Final interview polish",
            task: ["Run one full mock interview", "Review resume talking points", "Prepare questions for the interviewer"]
        }
    ]
};

const isDummyReportId = (id) => {
    const mongoObjectIdPattern = /^[a-f\d]{24}$/i;
    return !id || ["dummy", "demo", "sample", "test"].includes(id.toLowerCase()) || !mongoObjectIdPattern.test(id);
};

export function useInterview() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getReportById = useCallback(async (id) => {
        setLoading(true);
        setError("");

        if (isDummyReportId(id)) {
            setReport(DUMMY_REPORT);
            setLoading(false);
            return DUMMY_REPORT;
        }

        try {
            const data = await getInterviewReport(id);
            setReport(data?.interviewReport ?? null);
            return data?.interviewReport ?? null;
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message;

            if (!err.response) {
                setError("Unable to reach backend server. Make sure Backend is running on port 3000.");
            } else {
                setError(message || `Unable to load interview report (${status})`);
            }

            setReport(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getResumePdf = useCallback(() => {
        if (!report?.resume) return;

        const blob = new Blob([report.resume], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "resume.txt";
        link.click();
        URL.revokeObjectURL(url);
    }, [report]);

    return { report, loading, error, getReportById, getResumePdf };
}
