import "./errorNotice.css";

export default function ErrorNotice(props) {
  return (
    <div className="error-notice">
      <span className="span">{props.message}</span>
      <button onClick={props.clearError} className="button">
        X
      </button>
    </div>
  );
}
