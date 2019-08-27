function Clock ({minutes = 20, seconds = 48}) {
    return <h2 className="Clock">Pozostało {minutes}:{seconds}</h2>
}

function ProgressBar ({percent = 50}) {
    return (
    <div className="ProgressBar">
        <div style={{width: `${percent}%`}}></div>
    </div>
    );
}


ReactDOM.render(<div>< Clock /><ProgressBar /></div>, document.getElementById("root"));