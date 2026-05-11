import { getAdminSession } from "@/lib/auth/session";
import { getCandidatePhotoPath } from "@/lib/cerao/repository";
import { storage } from "@/lib/cerao/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      candidateId: string;
    }>;
  },
) {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { candidateId } = await context.params;
  const photoPath = await getCandidatePhotoPath(BigInt(candidateId));

  if (!photoPath) {
    return Response.json({ error: "Photo introuvable." }, { status: 404 });
  }

  const file = await storage.read(photoPath);
  if (!file) {
    return Response.json({ error: "Fichier introuvable." }, { status: 404 });
  }

  return new Response(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `inline; filename="${file.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
