import '../style/interviewLoader.scss'

const STEPS = [
    'Reading the role',
    'Checking your profile',
    'Building the plan',
]

const InterviewLoader = ({ message = 'Loading your interview plan...' }) => {
    return (
        <main className='loading-screen' aria-live='polite' aria-busy='true'>
            <div className='interview-loader'>
                <div className='interview-loader__sheet' aria-hidden='true'>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                <div className='interview-loader__copy'>
                    <h1>{message}</h1>
                    <p>Please wait while we prepare your interview plan.</p>
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
