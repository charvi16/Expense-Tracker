import useFetch from "../../hooks/useFetch";
import "./Calendar.css";

export default function Calendar(){

  const { data, loading } = useFetch("/calendar");

  if(loading) return <main className="page">Loading...</main>;

  return(
    <main className="page cal-page">

      <h1>Calendar</h1>

      <div className="cal-grid">

          {data.days.map((d,i)=>(
            <div key={i} className="day">
              <span>{d.day}</span>
              <p>{d.total ? "₹"+d.total : "-"}</p>
            </div>
          ))}

      </div>

    </main>
  );
}
