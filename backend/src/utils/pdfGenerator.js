import PDFDocument from "pdfkit";
import Expense from "../models/Expense.js";

const generatePDF = async (userId) => {
  const doc = new PDFDocument();
  const expenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(50);

  doc.fontSize(20).text("FinTrackAI - Monthly Report", { align: "center" });
  doc.moveDown();

  expenses.forEach((e) => {
    doc
      .fontSize(10)
      .text(
        `${e.date.toISOString().slice(0, 10)} - ${e.category} - ₹${e.amount} - ${
          e.description || ""
        }`
      );
  });

  doc.end();
  return doc;
};

export default generatePDF;
