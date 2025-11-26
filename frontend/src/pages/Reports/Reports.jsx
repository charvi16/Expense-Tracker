import API from "../../api/axios";
import "./Reports.css";

export default function Reports(){

  async function download() {
    await API.get("/reports/pdf", { responseType:"blob" });
    alert("PDF generated");
  }

  return(
    <main className="page reports-page">

      <h1>Reports</h1>

      <p className="sub">Download monthly PDF reports</p>

      <button 
        className="btn btn-primary"
        onClick={download}
        style={{marginTop:"4vh"}}
      >
        Generate PDF
      </button>

    </main>
  );
}
