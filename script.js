function Clock (props) {
    return <h2 className="Clock">Pozostało {props.minutes}</h2>
}


const rootElement = document.getElementById("root");
const element = (< Clock minutes="17:32" />);



ReactDOM.render(element, rootElement);
