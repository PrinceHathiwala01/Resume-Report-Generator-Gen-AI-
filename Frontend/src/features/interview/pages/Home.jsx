import { useState } from 'react'
import { useNavigate } from 'react-router'
import { generateInterviewReport } from '../services/interview.api'
import '../style/home.scss'

const Home = () => {
    const navigate = useNavigate()
    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [resume, setResume] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (!jobDescription.trim()) {
            setError('Job description is required')
            return
        }

        if (!resume && !selfDescription.trim()) {
            setError('Either resume or self description is required')
            return
        }

        setLoading(true)

        try {
            const data = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resume
            })

            navigate(`/interview/${data.interviewReport._id}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to generate interview report')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className='home' onSubmit={handleSubmit}>
            <div className="interview-input-group">
                  <div className="left">
                  <textarea
                    name="jobDescription"
                    id="jobDescription"
                    placeholder="Enter your job description"
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                  ></textarea>              
            </div>
            <div className="right">
                    <div className="input-group">
                        <p className="highlight"><b>Enter both resume and self description for best results</b></p>
                    <label className="resume" htmlFor="resume">Upload your Resume</label>
                    <input
                        type="file"
                        name="resume"
                        id="resume"
                        accept=".pdf"
                        onChange={(event) => setResume(event.target.files?.[0] ?? null)}
                    />
                </div>
            <div className="input-group">
                        <textarea
                            name="selfDescription"
                            id="selfDescription"
                            placeholder="Enter your self description"
                            value={selfDescription}
                            onChange={(event) => setSelfDescription(event.target.value)}
                        ></textarea>
                        <p className="highlight"><b>Either Resume or Self description is required</b></p>
            </div>
                {error && <p className="form-error">{error}</p>}
                <button className='generate-button' type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Interview Report'}
                </button>
                </div>
            </div>
    </form>
  )
}

export default Home
