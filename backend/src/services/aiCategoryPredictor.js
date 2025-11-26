export default async function aiCategoryPredictor(text) {
  // simple mock rule
  if (/swiggy|zomato|food/i.test(text)) return "Food";
  if (/uber|ola|metro/i.test(text)) return "Transport";
  return "Other";
}
