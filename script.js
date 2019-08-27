function TimeBoxEditor() {
    return (
        <div className="TimeboxEditor inactive">
            <label>Co robisz ?<input disabled value="Uczę się skrótów klawiszowych" type="text"/></label><br/>
            <label>Ile minut ?<input disabled value="25" type="number"/></label><br/>
            <button disabled>Zacznij</button>
        </div>
    );
}

function Clock({className="", minutes = 20, seconds = 48}) {
    return (
        <h2 className={"Clock " + className}>Pozostało {minutes}:{seconds}</h2>
    );
}

function ProgressBar({ className = "", percent = 33 }) {
    return (
        <div className={"ProgressBar " + className}>
            <div style={{width: `${percent}%`}}></div>
        </div>
    );
}

class TimeBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            isPaused: false,
            pauseCount: 0
        }
        this.handleStart = this.handleStart.bind(this)
        this.handleStop = this.handleStop.bind(this)
        this.togglePause = this.togglePause.bind(this)
    }
    
    handleStart(event) {
        this.setState({
            isRunning: true
        })

    }

    handleStop(event) {
        this.setState({
            isRunning: false,
            isPaused: false,
            pauseCount: 0
        })
    }
    
    togglePause() {
        this.setState(
            function(prevState) {
                const isPaused = !prevState.isPaused;
                return {
                    isPaused,
                    pauseCount: isPaused ? prevState.pauseCount + 1 : prevState.pauseCount
                }
            }
        )
    }
    render() {
        const {isPaused, isRunning, pauseCount} = this.state;
        return (
            <div className="Timebox">
                <h1>Ucze się skrótów klawiszowych</h1>

                <Clock className={isPaused ? "inactive" : ""}/>
          <ProgressBar className={isPaused ? "inactive" : ""}/>

                <button onClick={this.handleStart} disabled={isRunning}>Start</button>
                <button onClick={this.handleStop} disabled={!isRunning}>Stop</button>
                <button onClick={this.togglePause} disabled={!isRunning}>{isPaused ? "Wznów" : "Pauza"}</button>

                Liczba przerw: {pauseCount}
            </div>
        );
    }
}

function App() {
    return (
        <div className="App">
            <TimeBoxEditor/>
            <TimeBox />
        </div>
    );
}

ReactDOM.render(<div><App/></div>, document.getElementById("root"));
