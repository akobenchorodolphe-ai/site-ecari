"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type SubmissionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { reference: string; status: "success"; submittedAt: string };

type StudentRequestDraft = {
  email: string;
  filiereSouhaitee: string;
  message: string;
  niveauSouhaite: string;
  nom: string;
  phone: string;
  prenom: string;
};

const levelOptions = [
  "Licence 1",
  "Licence 2",
  "Licence 3",
  "Master 1",
  "Master 2",
  "Doctorat",
] as const;

const initialState: StudentRequestDraft = {
  email: "",
  filiereSouhaitee: "",
  message: "",
  niveauSouhaite: "",
  nom: "",
  phone: "",
  prenom: "",
};

export function StudentPreRegistrationForm() {
  const [form, setForm] = useState<StudentRequestDraft>(initialState);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof StudentRequestDraft>(
    key: K,
    value: StudentRequestDraft[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmission({ status: "idle" });

    try {
      const response = await fetch("/api/ecari/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "student-pre-registration",
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          phone: form.phone,
          niveauSouhaite: form.niveauSouhaite,
          filiereSouhaitee: form.filiereSouhaitee,
          message: form.message,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const message =
          payload.error ??
          (Array.isArray(payload.errors) ? payload.errors[0] : undefined) ??
          "La demande n'a pas pu etre enregistree.";

        throw new Error(message);
      }

      setSubmission({
        status: "success",
        reference: payload.id,
        submittedAt: payload.submittedAt,
      });
    } catch (error) {
      setSubmission({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue est survenue pendant l'enregistrement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <form className="panel rounded-[2.2rem] px-6 py-6 md:px-7" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="label">Nom</span>
            <input
              className="field"
              name="nom"
              onChange={(event) => updateField("nom", event.target.value)}
              placeholder="Votre nom"
              required
              type="text"
              value={form.nom}
            />
          </label>

          <label>
            <span className="label">Prenom</span>
            <input
              className="field"
              name="prenom"
              onChange={(event) => updateField("prenom", event.target.value)}
              placeholder="Votre prenom"
              required
              type="text"
              value={form.prenom}
            />
          </label>

          <label>
            <span className="label">Courriel</span>
            <input
              className="field"
              name="email"
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="nom@exemple.com"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            <span className="label">Telephone</span>
            <input
              className="field"
              name="phone"
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+225 07 00 00 00 00"
              required
              type="tel"
              value={form.phone}
            />
          </label>

          <label>
            <span className="label">Niveau souhaite</span>
            <select
              className="field"
              name="niveauSouhaite"
              onChange={(event) => updateField("niveauSouhaite", event.target.value)}
              required
              value={form.niveauSouhaite}
            >
              <option value="">Choisir un niveau</option>
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="label">Filiere souhaitee</span>
            <input
              className="field"
              name="filiereSouhaitee"
              onChange={(event) => updateField("filiereSouhaitee", event.target.value)}
              placeholder="Ex. Droit, Communication, Informatique"
              required
              type="text"
              value={form.filiereSouhaitee}
            />
          </label>
        </div>

        <label className="mt-6 block">
          <span className="label">Message complementaire</span>
          <textarea
            className="field min-h-32 resize-y"
            name="message"
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Precisez votre contexte ou votre besoin si necessaire."
            rows={5}
            value={form.message}
          />
        </label>

        <div className="mt-6 rounded-[1.4rem] border border-[rgba(53,79,69,0.12)] bg-white/72 px-4 py-4 text-sm leading-7 text-[#4f6158]">
          Cette demande permet a l&apos;equipe ECARI de centraliser les intentions
          avant la mise en ligne du module complet de preinscription.
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Enregistrement..." : "Enregistrer ma demande"}
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setForm(initialState);
              setSubmission({ status: "idle" });
            }}
            type="button"
          >
            Reinitialiser
          </button>
        </div>
      </form>

      <aside className="panel rounded-[2.2rem] px-6 py-6 md:px-7">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
          Parcours
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {levelOptions.map((option) => (
            <span className="badge" key={option}>
              {option}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-[rgba(53,79,69,0.12)] bg-white/72 px-4 py-4 text-sm leading-7 text-[#4f6158]">
          {submission.status === "success" ? (
            <>
              <p className="font-semibold text-[#18322c]">
                Votre demande de preinscription est bien enregistree
              </p>
              <p className="mt-3">
                <strong>Reference :</strong> {submission.reference}
              </p>
              <p>
                <strong>Soumis le :</strong>{" "}
                {new Date(submission.submittedAt).toLocaleString("fr-FR")}
              </p>
              <p className="mt-4">
                Votre demande pourra etre reprise par l&apos;equipe ECARI pendant la
                finalisation du futur module etudiant.
              </p>
            </>
          ) : submission.status === "error" ? (
            <>
              <p className="font-semibold text-[#9e2d20]">
                La demande n&apos;a pas pu etre enregistree
              </p>
              <p className="mt-3">{submission.message}</p>
            </>
          ) : (
            <p>
              Utilisez ce formulaire pour laisser une demande exploitable, meme
              avant la construction du parcours complet de preinscription.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
