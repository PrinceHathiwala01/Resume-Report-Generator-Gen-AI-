import { createContext, useState } from "react";
export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => { 
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("Loading your interview plan...")
    const [error, setError] = useState("")
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={{ loading, setLoading, loadingMessage, setLoadingMessage, error, setError, reports, setReports, report, setReport }}>
            {children}
        </InterviewContext.Provider>
    )
}
