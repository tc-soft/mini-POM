function barStyles(trackRemaining, percent) {
    const style = {
        width: `${trackRemaining ? percent+"%" : `calc(100% - ${percent}%)`}`,
        backgroundColor : "red",
        float : `${trackRemaining ? "left" : "right"}`
    };
    return style
}

function TimeBoxEditor() {
    return (
        <div className="TimeboxEditor inactive">
            <label>Co robisz ?<input disabled value="Uczę się skrótów klawiszowych" type="text"/></label><br/>
            <label>Ile minut ?<input disabled value="25" type="number"/></label><br/>
            <button disabled>Zacznij</button>
        </div>
    );
}

function Clock({className="", minutes, seconds}) {
    return (
        <h2 className={"Clock " + className}>Pozostało {minutes}:{seconds}</h2>
    );
}

function ProgressBar ({ className = "", percent, trackRemaining }) {
    const style = barStyles(trackRemaining, percent);
    return (
        <div className={"ProgressBar " + className}>
            <div style={style}></div>
        </div>
    );
}

class TimeBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            isPaused: false,
            pauseCount: 0,
            totalTimeInSecond: 10,
            elapsedTimeInSeconds: 0
        }
    }
    
    handleStart = (e) => {
        this.setState({
            isRunning: true,
        })
        this.startTimer();
    }

    handleStop = (e) => {
        this.setState({
            isRunning: false,
            isPaused: false,
            pausesCount:0,
            elapsedTimeInSeconds: 0
        })
        this.stopTimer();
    }
    
    togglePause = (e) => {
        this.setState(
            function(prevState) {
                const isPaused = !prevState.isPaused;
                if(isPaused) {
                    this.stopTimer();
                }
                else {
                    this.startTimer();
                }
                
                return {
                    isPaused,
                    pauseCount: isPaused ? prevState.pauseCount + 1 : prevState.pauseCount
                }
            })
    }

    startTimer = (e) => {
        this.intervalId = window.setInterval(
            () => {
                this.setState(
                    (prevState) => ({
                        elapsedTimeInSeconds: prevState.elapsedTimeInSeconds + 0.1,
                    }),
                );
              
                if((parseInt(this.state.elapsedTimeInSeconds) ) === parseInt(this.state.totalTimeInSecond)) {
                     this.stopTimer();
                }
            },
            100
        )
    }

    stopTimer = (e) => {
            window.clearInterval(this.intervalId)
    }

    render() {
        const {isPaused, isRunning, pauseCount, elapsedTimeInSeconds} = this.state;
        //const totalTimeInSecond = 10;
        const timeLeftInSeconds = this.state.totalTimeInSecond - elapsedTimeInSeconds;
        const minutesLeft = Math.floor(timeLeftInSeconds/60);
        const secondLeft = Math.floor(timeLeftInSeconds%60);
        const progressInPercent = (elapsedTimeInSeconds / this.state.totalTimeInSecond) * 100.0;
        

        return (
            <div className="Timebox">
                <h1>Ucze się skrótów klawiszowych</h1>

                <Clock minutes={minutesLeft} seconds={secondLeft} className={isPaused ? "inactive" : ""}/>
                
                <ProgressBar percent={progressInPercent} className={isPaused ? "inactive" : ""} trackRemaining={true}/>

                <button onClick={this.handleStart} disabled={isRunning}>Start</button>
                <button onClick={this.handleStop} disabled={!isRunning}>Stop</button>
                <button onClick={this.togglePause} disabled={!isRunning}>{isPaused ? "Wznów" : "Pauza"}</button>
                <br/><br/>
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
