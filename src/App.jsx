import "./App.css";

function App() {
  return (
    <>
      <button type="button" className="nes-btn is-primary">
        Primary
      </button>
      <button type="button" className="nes-btn is-success">
        Success
      </button>
      <button type="button" className="nes-btn is-warning">
        한글 폰트 잘 됨?? 00012345678910
      </button>
      <button type="button" className="nes-btn is-error">
        Error
      </button>
      <button type="button" className="nes-btn is-disabled">
        Disabled
      </button>

      <label className="nes-btn">
        <span>Select your file</span>
        <input type="file" />
      </label>
      <section className="icon-list">
        <i className="nes-icon twitter is-large"></i>
        <i className="nes-icon facebook is-large"></i>
        <i className="nes-icon instagram is-large"></i>
        <i className="nes-icon github is-large"></i>
        <i className="nes-icon google is-large"></i>
        <i className="nes-icon gmail is-large"></i>
        <i className="nes-icon medium is-large"></i>
        <i className="nes-icon linkedin is-large"></i>
        <i className="nes-icon twitch is-large"></i>
        <i className="nes-icon youtube is-large"></i>
        <i className="nes-icon reddit is-large"></i>
        <i className="nes-icon whatsapp is-large"></i>
      </section>
    </>
  );
}

export default App;
