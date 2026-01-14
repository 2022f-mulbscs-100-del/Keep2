import "./loading.css"
const Loader = () => {
    return (
      <div className="loader-page">
        <div className="loader-container">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
  
          <div className="loading-text">
            Loading<span className="dots"></span>
          </div>
        </div>
      </div>
    );
  };
  
  export default Loader;
  