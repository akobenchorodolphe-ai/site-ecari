import { ZodError } from "zod";

import {
  DuplicateEmailError,
  parseApplicationFormData,
  submitCandidateApplication,
} from "@/lib/cerao/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const submission = await parseApplicationFormData(formData);
    const candidate = await submitCandidateApplication(submission);

    return Response.json(
      {
        id: candidate.id.toString(),
        matricule: candidate.matricule,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

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
