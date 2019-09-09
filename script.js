function barStyles(trackRemaining, percent) {
    const style = {
        width: `${trackRemaining ? percent+"%" : `calc(100% - ${percent}%)`}`,
        backgroundColor : "red",
        float : `${trackRemaining ? "left" : "right"}`
    };
    return style
}

function TimeBoxEditor(props) {
    const {
        title,
        totalTimeInMinutes,
        isEditable,
        onTitleChange,
        onTotalTimeInMinutesChange,
        onConfirm
    } = props;
    return (
        <div className={`TimeboxEditor ${isEditable ? "" : "inactive"}`}>
            <label>
                Co robisz ?
                <input 
                    disabled={!isEditable}
                    value={title}
                    onChange={onTitleChange}
                    type="text"
                />
            </label><br/>
            <label>
                Ile minut ?
                <input 
                    disabled={!isEditable}
                    value={totalTimeInMinutes}
                    onChange={onTotalTimeInMinutesChange}
                    type="number"
                />
            </label><br/>
            <button 
                disabled={!isEditable}
                onClick={onConfirm}
                >Zatwierdź zmiany
            </button>
        </div>
    )
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

class CurrentTimeBox extends React.Component {
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
        const {title, totalTimeInMinutes, isEditable, onEdit} = this.props;
        
        const totalTimeInSecond = totalTimeInMinutes * 60;
        const timeLeftInSeconds = totalTimeInSecond - elapsedTimeInSeconds;
        const minutesLeft = Math.floor(timeLeftInSeconds/60);
        const secondLeft = Math.floor(timeLeftInSeconds%60);
        const progressInPercent = (elapsedTimeInSeconds / this.state.totalTimeInSecond) * 100.0;
        

        return (
            <div className={`CurrentTimebox ${isEditable ? "inactive" : ""}`}>
                <h1>{title}</h1>

                <Clock minutes={minutesLeft} seconds={secondLeft} className={isPaused ? "inactive" : ""}/>
                
                <ProgressBar percent={progressInPercent} className={isPaused ? "inactive" : ""} trackRemaining={true}/>

                <button onClick={onEdit} disabled={isEditable}>Edytuj</button>
                <button onClick={this.handleStart} disabled={isRunning}>Start</button>
                <button onClick={this.handleStop} disabled={!isRunning}>Stop</button>
                <button onClick={this.togglePause} disabled={!isRunning}>{isPaused ? "Wznów" : "Pauza"}</button>
                <br/><br/>
                Liczba przerw: {pauseCount}
            </div>
        );
    }
}

class EditableTimeBox extends React.Component {
    state = {
        title: "Uczę sie wyciągać stan w górę...",
        totalTimeInMinutes: 20,
        isEditable: true
    }

    handleTitleChange = (event) => {
        this.setState({title: event.target.value});
    }

    handleTotalTimeInMinutesChange = (event) => {
        this.setState({totalTimeInMinutes: event.target.value});
    }

    handleConfirm = () => {
        this.setState({isEditable: false});
    }

    handleEdit = () => {
        this.setState({isEditable: true});
    }    

    render() {
        const {title, totalTimeInMinutes, isEditable} = this.state;
        return (
            <>
                <TimeBoxEditor
                    title={title}
                    totalTimeInMinutes={totalTimeInMinutes}
                    isEditable={isEditable}

                    onTitleChange={this.handleTitleChange}
                    onTotalTimeInMinutesChange={this.handleTotalTimeInMinutesChange}
             onSubmit={onCreate}        onConfirm={this.handleConfirm}
                />
                <CurrentTimeBox 
                    title={title}
                    totalTimeInMinutes={totalTimeInMinutes}
                    isEditable={isEditable}

                    onEdit={this.handleEdit}
                />
            </>
        )
    }
}

class TimeBoxCreator extends React.Component {
    constructor(props)    {
        super(props);
        this.titleInput = React.createRef();
        this.totalTimeInMinutesInput = React.createRef();
    }


    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onCreate({
            id: uuid.v4(),
            title: this.titleInput.current.value,
            totalTimeInMinutes: this.totalTimeInMinutesInput.current.value
        });
        this.titleInput.current.value = "";
        this.totalTimeInMinutesInput.current.value = "";
    }

    render(){
        return (
            <form onSubmit={this.handleSubmit} className="TimeboxCreator">
                <label>
                    Co robisz ?
                    <input 
                        ref={this.titleInput}
                        type="text"
                    />
                </label><br/>
                <label>
                    Ile minut ?
                    <input
                        ref={this.totalTimeInMinutesInput}
                        type="number"
                    />
                </label><br/>
                <button>
                    Dodaj timebox
                </button>
            </form>
        )
    }
}

class TimeboxList extends React.Component {
    state = {
        timeboxes: [
            {id: "a", title: "Uczę się list 2", totalTimeInMinutes: 25},
            {id: "b", title: "Uczę się list 1", totalTimeInMinutes: 25},
            {id: "c", title: "Uczę się list 3", totalTimeInMinutes: 25}
        ]
    }
    
    addTimebox = (timebox) => {
        this.setState(prevState => {
            const timeboxes = [timebox, ...prevState.timeboxes];
            return {timeboxes};
        }

        )
    }

    removeTimebox = (indexToRemove) => {
        this.setState(prevState => {
            const timeboxes = prevState.timeboxes.filter((timebox, index) => index !== indexToRemove);
            return {timeboxes};
        }

        )
    }
    
    handleCreate = (createTimebox) => {
        this.addTimebox(createTimebox);
    }

    updateTimebox = (indexToUpdate, updateTimebox) => {
        this.setState(prevState => {
            const timeboxes = prevState.timeboxes.map((timebox, index) => 
            index === indexToUpdate ? updateTimebox : timebox)
            return {timeboxes};
        }
        )
    }
    
    render() {
        return (
            <>
            <TimeBoxCreator onCreate={this.handleCreate}/>
                {this.state.timeboxes.map((timebox, index) => (
                    <Timebox 
                        key={timebox.id} 
                        title={timebox.title} 
                        totalTimeInMinutes={timebox.totalTimeInMinutes} 
                        onDelete={() => this.removeTimebox(index)}
                        onEdit={() => this.updateTimebox(index, {...timebox, title: 'Updated timebox'})}
                    />
                ))}
            </>
        )
    }
}
function Timebox({title, totalTimeInMinutes, onDelete, onEdit}) {
    return (
        <div className="Timebox">
            <h3>{title} - {totalTimeInMinutes} min.</h3>
            <button onClick={onDelete}>Usuń</button>
            <button onClick={onEdit}>Zmień</button>
            <input />
        </div>
    )
}

function App() {
    return (
        <div className="App">
            <TimeboxList />
        </div>
    );
}

ReactDOM.render(<div><App/></div>, document.getElementById("root"));
