import { getAdminSession } from "@/lib/auth/session";
import { getDegreeDocumentPaths } from "@/lib/cerao/repository";
import { storage } from "@/lib/cerao/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      candidateId: string;
      degreeId: string;
    }>;
  },
) {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { candidateId, degreeId } = await context.params;
  const degree = await getDegreeDocumentPaths(BigInt(candidateId), BigInt(degreeId));

  if (!degree?.fichierThesePath) {
    return Response.json({ error: "Thèse introuvable." }, { status: 404 });
  }

  const file = await storage.read(degree.fichierThesePath);
  if (!file) {
    return Response.json({ error: "Fichier introuvable." }, { status: 404 });
  }

  return new Response(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
