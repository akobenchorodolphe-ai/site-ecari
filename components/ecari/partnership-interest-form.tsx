"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type SubmissionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { reference: string; status: "success"; submittedAt: string };

type PartnershipDraft = {
  contactName: string;
  email: string;
  message: string;
  organisation: string;
  phone: string;
  supportType: string;
};

const supportTypes = [
  "Financement de projet",
  "Bourse ou fonds dedie",
  "Partenariat institutionnel",
  "Autre contribution",
] as const;

const initialState: PartnershipDraft = {
  contactName: "",
  email: "",
  message: "",
  organisation: "",
  phone: "",
  supportType: "",
};

export function PartnershipInterestForm() {
  const [form, setForm] = useState<PartnershipDraft>(initialState);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof PartnershipDraft>(
    key: K,
    value: PartnershipDraft[K],
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
          type: "partnership",
          organisation: form.organisation,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          supportType: form.supportType,
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
            <span className="label">Organisation</span>
            <input
              className="field"
              name="organisation"
              onChange={(event) => updateField("organisation", event.target.value)}
              placeholder="Nom de l&apos;institution"
              required
              type="text"
              value={form.organisation}
            />
          </label>

          <label>
            <span className="label">Contact principal</span>
            <input
              className="field"
              name="contactName"
              onChange={(event) => updateField("contactName", event.target.value)}
              placeholder="Nom et prenom"
              required
              type="text"
              value={form.contactName}
            />
          </label>

          <label>
            <span className="label">Courriel</span>
            <input
              className="field"
              name="email"
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="nom@organisation.org"
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
        </div>

        <label className="mt-6 block">
          <span className="label">Type d&apos;appui envisage</span>
          <select
            className="field"
            name="supportType"
            onChange={(event) => updateField("supportType", event.target.value)}
            required
            value={form.supportType}
          >
            <option value="">Choisir un type d&apos;appui</option>
            {supportTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-6 block">
          <span className="label">Votre message</span>
          <textarea
            className="field min-h-36 resize-y"
            name="message"
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Precisez le cadre de collaboration, les objectifs et le niveau d&apos;appui envisage."
            required
            rows={6}
            value={form.message}
          />
        </label>

        <div className="mt-6 rounded-[1.4rem] border border-[rgba(53,79,69,0.12)] bg-white/72 px-4 py-4 text-sm leading-7 text-[#4f6158]">
          Cette demande cree un premier point de contact exploitable pour ECARI,
          meme avant la construction d&apos;un espace partenaire plus complet.
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Enregistrement..." : "Enregistrer ma proposition"}
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
          Appuis possibles
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {supportTypes.map((option) => (
            <span className="badge" key={option}>
              {option}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-[rgba(53,79,69,0.12)] bg-white/72 px-4 py-4 text-sm leading-7 text-[#4f6158]">
          {submission.status === "success" ? (
            <>
              <p className="font-semibold text-[#18322c]">
                Votre proposition de partenariat est bien enregistree
              </p>
              <p className="mt-3">
                <strong>Reference :</strong> {submission.reference}
              </p>
              <p>
                <strong>Soumis le :</strong>{" "}
                {new Date(submission.submittedAt).toLocaleString("fr-FR")}
              </p>
              <p className="mt-4">
                L&apos;equipe ECARI dispose maintenant d&apos;une base exploitable pour
                reprendre contact et structurer la suite.
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
              Cette page ne se contente plus d&apos;orienter: elle peut maintenant
              enregistrer une proposition de collaboration concrete.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
