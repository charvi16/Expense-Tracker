import useFetch from "../../hooks/useFetch";
import "./Subscriptions.css";

export default function Subscriptions(){

  const {data, loading} = useFetch("/subscriptions");

  if(loading) return <main className="page">Loading...</main>;

  return(
    <main className="page sub-page">

      <h1>Subscriptions</h1>

      <section className="sub-list">
        
        {data.map((s,i)=>(
          <div key={i} className="sub-card">
            <strong>{s.name}</strong>
            <span>₹{s.amount}/{s.interval}</span>
          </div>
        ))}

      </section>

    </main>
  )
}
