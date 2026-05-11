import { getAdminSession } from "@/lib/auth/session";
import { buildCandidatesWorkbook } from "@/lib/rectorat/export";
import { getCandidateRowsForExport } from "@/lib/rectorat/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const rows = await getCandidateRowsForExport();
  const buffer = buildCandidatesWorkbook(rows);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="candidats-cerao.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
