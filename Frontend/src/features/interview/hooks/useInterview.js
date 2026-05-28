import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, loadingMessage, setLoadingMessage, error, setError, report, setReport, reports, setReports } = context

    const getApiErrorMessage = (error, fallback) => {
        return error.response?.data?.message || error.message || fallback
    }

    const startLoading = (message) => {
        setError("")
        setLoadingMessage(message)
        setLoading(true)
    }

    const generateReport = async ({ title, jobDescription, selfDescription, resumeFile }) => {
        startLoading("Building your custom interview strategy...")
        let response = null
        try {
            response = await generateInterviewReport({ title, jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            setError(getApiErrorMessage(error, "Unable to generate interview report."))
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        startLoading("Opening your interview plan...")
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            setError(getApiErrorMessage(error, "Unable to load interview report."))
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        startLoading("Finding your recent interview plans...")
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            setError(getApiErrorMessage(error, "Unable to load recent interview reports."))
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        startLoading("Preparing your resume PDF...")
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            setError(getApiErrorMessage(error, "Unable to generate resume PDF."))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
        // getReportById/getReports intentionally read the latest context state for this route.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ interviewId ])

    return { loading, loadingMessage, error, report, reports, generateReport, getReportById, getReports, getResumePdf }

}
