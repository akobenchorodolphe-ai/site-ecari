import { ZodError } from "zod";

import { parseEcariLead, saveEcariLead } from "@/lib/ecari/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const lead = parseEcariLead(payload);
    const savedLead = await saveEcariLead(lead);

    return Response.json(
      {
        id: savedLead.id,
        submittedAt: savedLead.submittedAt,
        type: savedLead.type,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { errors: error.issues.map((issue) => issue.message) },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json({ error: "Le contenu JSON transmis est invalide." }, { status: 400 });
    }

    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "Une erreur inattendue est survenue." }, { status: 500 });
  }
}
