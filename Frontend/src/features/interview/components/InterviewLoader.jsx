import '../style/interviewLoader.scss'

const STEPS = [
    'Scanning role signals',
    'Mapping your strengths',
    'Drafting focused practice',
]

const InterviewLoader = ({ message = 'Loading your interview plan...' }) => {
    return (
        <main className='loading-screen' aria-live='polite' aria-busy='true'>
            <div className='interview-loader'>
                <div className='interview-loader__orb' aria-hidden='true'>
                    <span className='interview-loader__ring interview-loader__ring--outer' />
                    <span className='interview-loader__ring interview-loader__ring--middle' />
                    <span className='interview-loader__spark interview-loader__spark--one' />
                    <span className='interview-loader__spark interview-loader__spark--two' />
                    <span className='interview-loader__spark interview-loader__spark--three' />
                    <svg viewBox='0 0 24 24' role='img' aria-label='AI sparkle'>
                        <path d='M12 2l1.75 5.35L19 9.1l-5.25 1.75L12 16.2l-1.75-5.35L5 9.1l5.25-1.75L12 2Z' />
                        <path d='M18.5 14l.8 2.25 2.2.75-2.2.75-.8 2.25-.8-2.25-2.2-.75 2.2-.75.8-2.25Z' />
                    </svg>
                </div>

                <div className='interview-loader__copy'>
                    <p className='interview-loader__eyebrow'>AI interview planner</p>
                    <h1>{message}</h1>
                    <p>Turning your profile and target role into a sharper preparation plan.</p>
                </div>

                <div className='interview-loader__bar' aria-hidden='true'>
                    <span />
                </div>

                <div className='interview-loader__steps' aria-hidden='true'>
                    {STEPS.map((step) => (
                        <span key={step}>{step}</span>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default InterviewLoader
