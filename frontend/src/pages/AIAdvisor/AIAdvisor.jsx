import useFetch from "../../hooks/useFetch";
import "./AIAdvisor.css";

export default function AIAdvisor() {

  const { data, loading } = useFetch("/advisor");

  if (loading) return <main className="page">Loading...</main>;

  return (
    <main className="page advisor-page">

      <h1>AI Financial Advisor</h1>

      <section className="ai-list">

        {data.tips.map((tip, i)=>(
          <div key={i} className="ai-box">
            {tip}
          </div>
        ))}

      </section>

    </main>
  );
}
