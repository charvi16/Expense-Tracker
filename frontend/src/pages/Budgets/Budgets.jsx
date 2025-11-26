import useFetch from "../../hooks/useFetch";
import "./Budgets.css";

export default function Budgets(){

  const {data, loading} = useFetch("/budgets");

  if(loading) return <main className="page">Loading...</main>;

  return(
    <main className="page budget-page">

      <h1>Budgets</h1>

      <table className="budget-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Budget</th>
            <th>Spent</th>
            <th>Remaining</th>
          </tr>
        </thead>

        <tbody>
          {data.map((b,i)=>(
            <tr key={i}>
              <td>{b.month}</td>
              <td>₹{b.budget}</td>
              <td>₹{b.spent}</td>
              <td>₹{b.remaining}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </main>
  )
}
