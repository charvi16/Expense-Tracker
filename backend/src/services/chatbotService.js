export default async function chatbotService(userId, message) {
  if (/budget/i.test(message)) {
    return "Try to allocate 50% to needs, 30% to wants, 20% to savings.";
  }
  return "I'm your finance assistant. Ask me about budgets, savings or expenses!";
}
