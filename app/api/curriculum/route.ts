const SHEET_CSV = "https://docs.google.com/spreadsheets/d/1R371oll2MN5gykAteGHawcsTjpt4kJSmtRoyH4qaIhI/export?format=csv&gid=627794224";

export async function GET() {
  try {
    const response = await fetch(SHEET_CSV, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error("Sheet unavailable");
    const csv = await response.text();
    return Response.json({ connected: true, source: "Version rút gọn", updatedAt: new Date().toISOString(), curriculum: csv });
  } catch {
    return Response.json({ connected: false, source: "Dữ liệu mẫu nội bộ" });
  }
}
