import generatePDF from "../utils/pdfGenerator.js";

export const generateReportPDF = async (req, res) => {
  try {
    const fileStream = await generatePDF(req.user._id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");

    fileStream.pipe(res);
  } catch {
    res.status(500).json({ message: "Failed to generate report" });
  }
};
