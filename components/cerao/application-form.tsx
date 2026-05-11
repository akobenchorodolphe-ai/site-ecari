"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AVIS_SUPERIEUR,
  AVIS_SUPERIEUR_LABELS,
  ETATS_VIE,
  ETAT_VIE_LABELS,
  MAX_PHOTO_SIZE_BYTES,
  MAX_SUPPORTING_FILE_SIZE_BYTES,
  MAX_THESE_SIZE_BYTES,
  TYPES_DIPLOME,
  TYPE_DIPLOME_LABELS,
  isDoctorateType,
} from "@/lib/cerao/constants";

type DegreeFormState = {
  typeDiplome: (typeof TYPES_DIPLOME)[number];
  intitule: string;
  institution: string;
  pays: string;
  anneeObtention: string;
  preuveFile: File | null;
  theseFile: File | null;
};

type PublicationFormState = {
  titre: string;
  revueEditeur: string;
  lieuParution: string;
  annee: string;
  lienUrl: string;
};

type ApplicationFormState = {
  nom: string;
  prenoms: string;
  sexe: "M" | "F";
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  telephone: string;
  whatsapp: string;
  email: string;
  etatVie: (typeof ETATS_VIE)[number];
  affiliationReligieuse: string;
  avisSuperieur: (typeof AVIS_SUPERIEUR)[number];
  disponibiliteCandidat: boolean;
  certificationHonneur: boolean;
  photo: File | null;
  degrees: DegreeFormState[];
  publications: PublicationFormState[];
};

const initialState: ApplicationFormState = {
  nom: "",
  prenoms: "",
  sexe: "M",
  dateNaissance: "",
  lieuNaissance: "",
  nationalite: "",
  telephone: "",
  whatsapp: "",
  email: "",
  etatVie: "PRETRE",
  affiliationReligieuse: "",
  avisSuperieur: "JE_NE_SAIS_PAS",
  disponibiliteCandidat: true,
  certificationHonneur: false,
  photo: null,
  degrees: [
    {
      typeDiplome: "DOCTORAT",
      intitule: "",
      institution: "",
      pays: "",
      anneeObtention: "",
      preuveFile: null,
      theseFile: null,
    },
  ],
  publications: [],
};

function emptyDegree(): DegreeFormState {
  return {
    typeDiplome: "PHD",
    intitule: "",
    institution: "",
    pays: "",
    anneeObtention: "",
    preuveFile: null,
    theseFile: null,
  };
}

function emptyPublication(): PublicationFormState {
  return {
    titre: "",
    revueEditeur: "",
    lieuParution: "",
    annee: "",
    lienUrl: "",
  };
}

function getSafeJson(data: unknown) {
  return JSON.stringify(data);
}

export function ApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ApplicationFormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepTitles = [
    "Identité & état de vie",
    "Cursus & thèses",
    "Disponibilité & avis",
  ];

  function setField<K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setDegreeField<K extends keyof DegreeFormState>(
    index: number,
    key: K,
    value: DegreeFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      degrees: current.degrees.map((degree, degreeIndex) =>
        degreeIndex === index ? { ...degree, [key]: value } : degree,
      ),
    }));
  }

  function setPublicationField<K extends keyof PublicationFormState>(
    index: number,
    key: K,
    value: PublicationFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      publications: current.publications.map((publication, publicationIndex) =>
        publicationIndex === index ? { ...publication, [key]: value } : publication,
      ),
    }));
  }

  function validatePhoto() {
    if (!form.photo) {
      return null;
    }

    if (!["image/jpeg", "image/png"].includes(form.photo.type)) {
      return "La photo doit être au format JPG ou PNG.";
    }

    if (form.photo.size > MAX_PHOTO_SIZE_BYTES) {
      return "La photo dépasse la taille maximale autorisée de 5 Mo.";
    }

    return null;
  }

  function validateStep(stepIndex: number) {
    const errors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!form.nom.trim()) {
        errors.nom = "Le nom est requis.";
      }
      if (!form.prenoms.trim()) {
        errors.prenoms = "Les prénoms sont requis.";
      }
      if (!form.dateNaissance) {
        errors.dateNaissance = "La date de naissance est requise.";
      }
      if (!form.nationalite.trim()) {
        errors.nationalite = "La nationalité est requise.";
      }
      if (!form.telephone.trim()) {
        errors.telephone = "Le téléphone est requis.";
      }
      if (!form.whatsapp.trim()) {
        errors.whatsapp = "Le numéro WhatsApp est requis.";
      }
      if (!form.email.trim()) {
        errors.email = "L'adresse email est requise.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "L'adresse email est invalide.";
      }
      if (
        (form.etatVie === "PRETRE" || form.etatVie === "RELIGIEUX") &&
        !form.affiliationReligieuse.trim()
      ) {
        errors.affiliationReligieuse =
          "Le diocèse ou l'institut religieux est requis.";
      }

      const photoError = validatePhoto();
      if (photoError) {
        errors.photo = photoError;
      }
    }

    if (stepIndex === 1) {
      if (!form.degrees.length) {
        errors.degrees = "Au moins un doctorat est requis.";
      }

      form.degrees.forEach((degree, index) => {
        if (index === 0 && !isDoctorateType(degree.typeDiplome)) {
          errors[`degree-${index}-typeDiplome`] =
            "Le premier diplôme doit être le doctorat principal.";
        }
        if (!degree.intitule.trim()) {
          errors[`degree-${index}-intitule`] = "L'intitulé est requis.";
        }
        if (!degree.institution.trim()) {
          errors[`degree-${index}-institution`] = "L'institution est requise.";
        }
        if (!degree.pays.trim()) {
          errors[`degree-${index}-pays`] = "Le pays est requis.";
        }
        if (!/^\d{4}$/.test(degree.anneeObtention)) {
          errors[`degree-${index}-anneeObtention`] = "Année invalide.";
        }
        if (!degree.preuveFile) {
          errors[`degree-${index}-preuveFile`] = "La preuve du diplôme est requise.";
        } else if (
          !["application/pdf", "image/jpeg", "image/png"].includes(degree.preuveFile.type)
        ) {
          errors[`degree-${index}-preuveFile`] = "Formats acceptés : PDF, JPG ou PNG.";
        } else if (degree.preuveFile.size > MAX_SUPPORTING_FILE_SIZE_BYTES) {
          errors[`degree-${index}-preuveFile`] =
            "La preuve du diplôme dépasse 10 Mo.";
        }

        if (isDoctorateType(degree.typeDiplome)) {
          if (!degree.theseFile) {
            errors[`degree-${index}-theseFile`] =
              "La thèse est obligatoire pour ce diplôme.";
          } else if (degree.theseFile.type !== "application/pdf") {
            errors[`degree-${index}-theseFile`] = "La thèse doit être un PDF.";
          } else if (degree.theseFile.size > MAX_THESE_SIZE_BYTES) {
            errors[`degree-${index}-theseFile`] =
              "La thèse dépasse la taille maximale autorisée de 100 Mo.";
          }
        }
      });

      form.publications.forEach((publication, index) => {
        if (!publication.titre.trim()) {
          errors[`publication-${index}-titre`] = "Le titre est requis.";
        }
        if (!publication.revueEditeur.trim()) {
          errors[`publication-${index}-revueEditeur`] =
            "La revue ou l'éditeur est requis.";
        }
        if (publication.annee && !/^\d{4}$/.test(publication.annee)) {
          errors[`publication-${index}-annee`] = "Année invalide.";
        }
      });
    }

    if (stepIndex === 2 && !form.certificationHonneur) {
      errors.certificationHonneur =
        "Vous devez certifier l'exactitude des informations.";
    }

    return errors;
  }

  function goToStep(nextStep: number) {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    const errors = validateStep(step);
    setFieldErrors(errors);
    setGlobalError(null);

    if (Object.keys(errors).length === 0) {
      goToStep(Math.min(step + 1, 2));
    }
  }

  function handlePrevious() {
    setGlobalError(null);
    goToStep(Math.max(step - 1, 0));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateStep(0);
    Object.assign(errors, validateStep(1), validateStep(2));
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setGlobalError("Veuillez corriger les champs signalés avant l'envoi.");
      return;
    }

    setGlobalError(null);
    const payload = {
      nom: form.nom.trim(),
      prenoms: form.prenoms.trim(),
      sexe: form.sexe,
      dateNaissance: form.dateNaissance,
      lieuNaissance: form.lieuNaissance.trim(),
      nationalite: form.nationalite.trim(),
      telephone: form.telephone.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      etatVie: form.etatVie,
      affiliationReligieuse: form.affiliationReligieuse.trim(),
      avisSuperieur: form.avisSuperieur,
      disponibiliteCandidat: form.disponibiliteCandidat,
      certificationHonneur: form.certificationHonneur,
      degrees: form.degrees.map((degree) => ({
        typeDiplome: degree.typeDiplome,
        intitule: degree.intitule.trim(),
        institution: degree.institution.trim(),
        pays: degree.pays.trim(),
        anneeObtention: degree.anneeObtention.trim(),
      })),
      publications: form.publications
        .filter(
          (publication) =>
            publication.titre.trim() ||
            publication.revueEditeur.trim() ||
            publication.annee.trim(),
        )
        .map((publication) => ({
          titre: publication.titre.trim(),
          revueEditeur: publication.revueEditeur.trim(),
          lieuParution: publication.lieuParution.trim(),
          annee: publication.annee.trim(),
          lienUrl: publication.lienUrl.trim(),
        })),
    };

    const formData = new FormData();
    formData.append("payload", getSafeJson(payload));

    if (form.photo) {
      formData.append("photo", form.photo);
    }

    form.degrees.forEach((degree, index) => {
      if (degree.preuveFile) {
        formData.append(`degree-proof-${index}`, degree.preuveFile);
      }
      if (degree.theseFile) {
        formData.append(`degree-thesis-${index}`, degree.theseFile);
      }
    });

    setIsSubmitting(true);
    startTransition(async () => {
      const response = await fetch("/api/cerao/applications", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        error?: string;
        errors?: string[];
        matricule?: string;
      };

      if (!response.ok) {
        setIsSubmitting(false);
        setGlobalError(result.error ?? result.errors?.[0] ?? "Échec de l'envoi.");
        return;
      }

      router.push(
        `/cerao/inscription/success?matricule=${encodeURIComponent(
          result.matricule ?? "",
        )}&nom=${encodeURIComponent(form.nom.trim())}`,
      );
    });
  }

  return (
    <form className="panel rounded-[2rem] p-5 md:p-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="badge">Formulaire public Rectorat</span>
          <h2 className="mt-4 text-3xl text-[#1b342e] md:text-4xl">
            Enregistrement Vivier CERAO
          </h2>
          <p className="mt-3 max-w-2xl text-[#55675e]">
            Merci de renseigner votre dossier avec exactitude. Les champs et pièces
            demandés permettront au Rectorat de constituer une base fiable des
            talents académiques disponibles.
          </p>
        </div>
        <div className="rounded-3xl bg-[#f5ebd8] px-4 py-3 text-sm font-semibold text-[#735124]">
          Étape {step + 1} / 3 • {stepTitles[step]}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {stepTitles.map((title, index) => {
          const isActive = index === step;
          const isDone = index < step;

          return (
            <div
              className={`rounded-[1.4rem] border px-4 py-4 transition-all ${
                isActive
                  ? "border-[#9b6b2f] bg-[#fff8eb]"
                  : isDone
                    ? "border-[#4f7a67]/20 bg-[#f1f6f2]"
                    : "border-[#354f451a] bg-white/70"
              }`}
              key={title}
            >
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#7a6b53]">
                Étape {index + 1}
              </div>
              <div className="mt-2 text-lg font-semibold text-[#1f352f]">{title}</div>
            </div>
          );
        })}
      </div>

      {globalError ? (
        <div className="mt-6 rounded-2xl border border-[#a33d3030] bg-[#fff1ef] px-4 py-3 text-sm text-[#a33d30]">
          {globalError}
        </div>
      ) : null}

      {step === 0 ? (
        <section className="mt-8 space-y-7">
          <div>
            <h3 className="text-2xl text-[#19312b]">1. Informations personnelles</h3>
            <p className="helper mt-2">
              Les informations d&apos;identité seront visibles uniquement par le
              Rectorat.
            </p>
          </div>

          <div className="section-grid">
            <div>
              <label className="label" htmlFor="nom">
                Nom
              </label>
              <input
                className="field"
                id="nom"
                value={form.nom}
                onChange={(event) => setField("nom", event.target.value)}
                placeholder="Ex: KOUASSI"
              />
              {fieldErrors.nom ? <p className="error mt-2">{fieldErrors.nom}</p> : null}
            </div>
            <div>
              <label className="label" htmlFor="prenoms">
                Prénoms
              </label>
              <input
                className="field"
                id="prenoms"
                value={form.prenoms}
                onChange={(event) => setField("prenoms", event.target.value)}
                placeholder="Ex: Jean Baptiste"
              />
              {fieldErrors.prenoms ? (
                <p className="error mt-2">{fieldErrors.prenoms}</p>
              ) : null}
            </div>
            <div>
              <span className="label">Sexe</span>
              <div className="flex gap-3">
                {[
                  { label: "Masculin", value: "M" },
                  { label: "Féminin", value: "F" },
                ].map((item) => (
                  <label
                    className="flex flex-1 items-center gap-2 rounded-2xl border border-[#354f4524] bg-white/80 px-4 py-3"
                    key={item.value}
                  >
                    <input
                      checked={form.sexe === item.value}
                      name="sexe"
                      onChange={() => setField("sexe", item.value as "M" | "F")}
                      type="radio"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="date-naissance">
                Date de naissance
              </label>
              <input
                className="field"
                id="date-naissance"
                type="date"
                value={form.dateNaissance}
                onChange={(event) => setField("dateNaissance", event.target.value)}
              />
              {fieldErrors.dateNaissance ? (
                <p className="error mt-2">{fieldErrors.dateNaissance}</p>
              ) : null}
            </div>
            <div>
              <label className="label" htmlFor="lieu-naissance">
                Lieu de naissance
              </label>
              <input
                className="field"
                id="lieu-naissance"
                value={form.lieuNaissance}
                onChange={(event) => setField("lieuNaissance", event.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="nationalite">
                Nationalité
              </label>
              <input
                className="field"
                id="nationalite"
                value={form.nationalite}
                onChange={(event) => setField("nationalite", event.target.value)}
                placeholder="Ex: Ivoirienne"
              />
              {fieldErrors.nationalite ? (
                <p className="error mt-2">{fieldErrors.nationalite}</p>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-2xl text-[#19312b]">2. Coordonnées & photo</h3>
            <div className="section-grid mt-5">
              <div>
                <label className="label" htmlFor="email">
                  Email personnel
                </label>
                <input
                  className="field"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setField("email", event.target.value)}
                  placeholder="nom@domaine.org"
                />
                {fieldErrors.email ? (
                  <p className="error mt-2">{fieldErrors.email}</p>
                ) : null}
              </div>
              <div>
                <label className="label" htmlFor="telephone">
                  Téléphone mobile
                </label>
                <input
                  className="field"
                  id="telephone"
                  value={form.telephone}
                  onChange={(event) => setField("telephone", event.target.value)}
                  placeholder="+225 07 00 00 00 00"
                />
                {fieldErrors.telephone ? (
                  <p className="error mt-2">{fieldErrors.telephone}</p>
                ) : null}
              </div>
              <div>
                <label className="label" htmlFor="whatsapp">
                  WhatsApp
                </label>
                <input
                  className="field"
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={(event) => setField("whatsapp", event.target.value)}
                  placeholder="+225 07 00 00 00 00"
                />
                {fieldErrors.whatsapp ? (
                  <p className="error mt-2">{fieldErrors.whatsapp}</p>
                ) : null}
              </div>
              <div>
                <label className="label" htmlFor="photo">
                  Photo d&apos;identité
                </label>
                <input
                  className="field"
                  id="photo"
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={(event) =>
                    setField("photo", event.target.files?.[0] ?? null)
                  }
                />
                <p className="helper mt-2">
                  JPG ou PNG, taille maximale 5 Mo.
                </p>
                {fieldErrors.photo ? <p className="error mt-2">{fieldErrors.photo}</p> : null}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl text-[#19312b]">3. État de vie & rattachement</h3>
            <div className="section-grid mt-5">
              <div>
                <label className="label" htmlFor="etat-vie">
                  État de vie actuel
                </label>
                <select
                  className="field"
                  id="etat-vie"
                  value={form.etatVie}
                  onChange={(event) =>
                    setField("etatVie", event.target.value as (typeof ETATS_VIE)[number])
                  }
                >
                  {ETATS_VIE.map((etatVie) => (
                    <option key={etatVie} value={etatVie}>
                      {ETAT_VIE_LABELS[etatVie]}
                    </option>
                  ))}
                </select>
              </div>
              {(form.etatVie === "PRETRE" || form.etatVie === "RELIGIEUX") && (
                <div>
                  <label className="label" htmlFor="affiliation">
                    {form.etatVie === "PRETRE"
                      ? "Diocèse d'incardination"
                      : "Institut / Congrégation"}
                  </label>
                  <input
                    className="field"
                    id="affiliation"
                    value={form.affiliationReligieuse}
                    onChange={(event) =>
                      setField("affiliationReligieuse", event.target.value)
                    }
                  />
                  {fieldErrors.affiliationReligieuse ? (
                    <p className="error mt-2">{fieldErrors.affiliationReligieuse}</p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="mt-8 space-y-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl text-[#19312b]">Doctorats, thèses et diplômes</h3>
              <p className="helper mt-2">
                Renseignez le doctorat principal en premier. Vous pouvez ensuite
                ajouter d&apos;autres doctorats ou diplômes complémentaires.
              </p>
            </div>
            <button
              className="btn-secondary"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  degrees: [...current.degrees, emptyDegree()],
                }))
              }
              type="button"
            >
              Ajouter un autre diplôme
            </button>
          </div>

          <div className="space-y-5">
            {form.degrees.map((degree, index) => (
              <article
                className="rounded-[1.6rem] border border-[#354f4517] bg-white/75 p-5"
                key={`degree-${index}`}
              >
                <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8d7752]">
                      Diplôme n°{index + 1}
                    </div>
                    <h4 className="mt-2 text-xl text-[#1f352f]">
                      {index === 0 ? "Doctorat principal" : "Diplôme complémentaire"}
                    </h4>
                  </div>
                  {index > 0 ? (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          degrees: current.degrees.filter(
                            (_, degreeIndex) => degreeIndex !== index,
                          ),
                        }))
                      }
                      type="button"
                    >
                      Retirer
                    </button>
                  ) : null}
                </div>

                <div className="section-grid">
                  <div>
                    <label className="label" htmlFor={`degree-type-${index}`}>
                      Type de diplôme
                    </label>
                    <select
                      className="field"
                      id={`degree-type-${index}`}
                      value={degree.typeDiplome}
                      onChange={(event) =>
                        setDegreeField(
                          index,
                          "typeDiplome",
                          event.target.value as DegreeFormState["typeDiplome"],
                        )
                      }
                    >
                      {TYPES_DIPLOME.map((type) => (
                        <option key={type} value={type}>
                          {TYPE_DIPLOME_LABELS[type]}
                        </option>
                      ))}
                    </select>
                    {fieldErrors[`degree-${index}-typeDiplome`] ? (
                      <p className="error mt-2">
                        {fieldErrors[`degree-${index}-typeDiplome`]}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label className="label" htmlFor={`degree-title-${index}`}>
                      Intitulé exact
                    </label>
                    <input
                      className="field"
                      id={`degree-title-${index}`}
                      value={degree.intitule}
                      onChange={(event) =>
                        setDegreeField(index, "intitule", event.target.value)
                      }
                    />
                    {fieldErrors[`degree-${index}-intitule`] ? (
                      <p className="error mt-2">
                        {fieldErrors[`degree-${index}-intitule`]}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label className="label" htmlFor={`degree-institution-${index}`}>
                      Institution
                    </label>
                    <input
                      className="field"
                      id={`degree-institution-${index}`}
                      value={degree.institution}
                      onChange={(event) =>
                        setDegreeField(index, "institution", event.target.value)
                      }
                    />
                    {fieldErrors[`degree-${index}-institution`] ? (
                      <p className="error mt-2">
                        {fieldErrors[`degree-${index}-institution`]}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label className="label" htmlFor={`degree-country-${index}`}>
                      Pays
                    </label>
                    <input
                      className="field"
                      id={`degree-country-${index}`}
                      value={degree.pays}
                      onChange={(event) =>
                        setDegreeField(index, "pays", event.target.value)
                      }
                    />
                    {fieldErrors[`degree-${index}-pays`] ? (
                      <p className="error mt-2">{fieldErrors[`degree-${index}-pays`]}</p>
                    ) : null}
                  </div>
                  <div>
                    <label className="label" htmlFor={`degree-year-${index}`}>
                      Année d&apos;obtention
                    </label>
                    <input
                      className="field"
                      id={`degree-year-${index}`}
                      inputMode="numeric"
                      maxLength={4}
                      value={degree.anneeObtention}
                      onChange={(event) =>
                        setDegreeField(index, "anneeObtention", event.target.value)
                      }
                      placeholder="2024"
                    />
                    {fieldErrors[`degree-${index}-anneeObtention`] ? (
                      <p className="error mt-2">
                        {fieldErrors[`degree-${index}-anneeObtention`]}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label className="label" htmlFor={`degree-proof-${index}`}>
                      Scan du diplôme
                    </label>
                    <input
                      className="field"
                      id={`degree-proof-${index}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={(event) =>
                        setDegreeField(index, "preuveFile", event.target.files?.[0] ?? null)
                      }
                    />
                    <p className="helper mt-2">PDF, JPG ou PNG. Maximum 10 Mo.</p>
                    {fieldErrors[`degree-${index}-preuveFile`] ? (
                      <p className="error mt-2">
                        {fieldErrors[`degree-${index}-preuveFile`]}
                      </p>
                    ) : null}
                  </div>
                </div>

                {isDoctorateType(degree.typeDiplome) ? (
                  <div className="mt-5">
                    <label className="label" htmlFor={`degree-thesis-${index}`}>
                      Copie numérique de la thèse
                    </label>
                    <input
                      className="field"
                      id={`degree-thesis-${index}`}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(event) =>
                        setDegreeField(index, "theseFile", event.target.files?.[0] ?? null)
                      }
                    />
                    <p className="helper mt-2">PDF uniquement, jusqu&apos;à 100 Mo.</p>
                    {fieldErrors[`degree-${index}-theseFile`] ? (
                      <p className="error mt-2">
                        {fieldErrors[`degree-${index}-theseFile`]}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="rounded-[1.6rem] border border-[#354f4517] bg-white/75 p-5">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl text-[#19312b]">Publications majeures</h3>
                <p className="helper mt-2">
                  Cette section est optionnelle, mais fortement utile pour valoriser
                  votre profil auprès du Rectorat.
                </p>
              </div>
              <button
                className="btn-secondary"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    publications: [...current.publications, emptyPublication()],
                  }))
                }
                type="button"
              >
                Ajouter une publication
              </button>
            </div>

            <div className="space-y-5">
              {form.publications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#c7ba99] px-4 py-5 text-sm text-[#6c7368]">
                  Aucune publication ajoutée pour le moment.
                </div>
              ) : null}

              {form.publications.map((publication, index) => (
                <div
                  className="rounded-[1.4rem] border border-[#354f4513] bg-[#fbfaf6] p-4"
                  key={`publication-${index}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg text-[#243932]">Publication n°{index + 1}</h4>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          publications: current.publications.filter(
                            (_, publicationIndex) => publicationIndex !== index,
                          ),
                        }))
                      }
                      type="button"
                    >
                      Retirer
                    </button>
                  </div>
                  <div className="section-grid">
                    <div>
                      <label className="label" htmlFor={`publication-title-${index}`}>
                        Titre
                      </label>
                      <input
                        className="field"
                        id={`publication-title-${index}`}
                        value={publication.titre}
                        onChange={(event) =>
                          setPublicationField(index, "titre", event.target.value)
                        }
                      />
                      {fieldErrors[`publication-${index}-titre`] ? (
                        <p className="error mt-2">
                          {fieldErrors[`publication-${index}-titre`]}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label className="label" htmlFor={`publication-review-${index}`}>
                        Revue / Éditeur
                      </label>
                      <input
                        className="field"
                        id={`publication-review-${index}`}
                        value={publication.revueEditeur}
                        onChange={(event) =>
                          setPublicationField(index, "revueEditeur", event.target.value)
                        }
                      />
                      {fieldErrors[`publication-${index}-revueEditeur`] ? (
                        <p className="error mt-2">
                          {fieldErrors[`publication-${index}-revueEditeur`]}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label className="label" htmlFor={`publication-location-${index}`}>
                        Lieu de parution
                      </label>
                      <input
                        className="field"
                        id={`publication-location-${index}`}
                        value={publication.lieuParution}
                        onChange={(event) =>
                          setPublicationField(index, "lieuParution", event.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor={`publication-year-${index}`}>
                        Année
                      </label>
                      <input
                        className="field"
                        id={`publication-year-${index}`}
                        inputMode="numeric"
                        maxLength={4}
                        value={publication.annee}
                        onChange={(event) =>
                          setPublicationField(index, "annee", event.target.value)
                        }
                        placeholder="2023"
                      />
                      {fieldErrors[`publication-${index}-annee`] ? (
                        <p className="error mt-2">
                          {fieldErrors[`publication-${index}-annee`]}
                        </p>
                      ) : null}
                    </div>
                    <div className="md:col-span-2">
                      <label className="label" htmlFor={`publication-url-${index}`}>
                        Lien DOI / URL
                      </label>
                      <input
                        className="field"
                        id={`publication-url-${index}`}
                        value={publication.lienUrl}
                        onChange={(event) =>
                          setPublicationField(index, "lienUrl", event.target.value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="mt-8 space-y-7">
          <div>
            <h3 className="text-2xl text-[#19312b]">Avis de la hiérarchie</h3>
            <p className="helper mt-2">
              Cette information aide le Rectorat à évaluer rapidement la faisabilité
              d&apos;une mission d&apos;enseignement.
            </p>
          </div>

          <div className="grid gap-3">
            {AVIS_SUPERIEUR.map((value) => (
              <label
                className="flex items-start gap-3 rounded-[1.4rem] border border-[#354f4518] bg-white/80 px-4 py-4"
                key={value}
              >
                <input
                  checked={form.avisSuperieur === value}
                  name="avis-superieur"
                  onChange={() => setField("avisSuperieur", value)}
                  type="radio"
                />
                <span className="leading-7">{AVIS_SUPERIEUR_LABELS[value]}</span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="text-2xl text-[#19312b]">Disponibilité personnelle</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                { label: "Oui, je suis disponible", value: true },
                { label: "Non, pas pour le moment", value: false },
              ].map((item) => (
                <label
                  className="flex items-center gap-3 rounded-[1.4rem] border border-[#354f4518] bg-white/80 px-4 py-4"
                  key={String(item.value)}
                >
                  <input
                    checked={form.disponibiliteCandidat === item.value}
                    name="disponibilite"
                    onChange={() => setField("disponibiliteCandidat", item.value)}
                    type="radio"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#9b6b2f33] bg-[#fff9ef] px-4 py-4">
            <label className="flex items-start gap-3">
              <input
                checked={form.certificationHonneur}
                onChange={(event) =>
                  setField("certificationHonneur", event.target.checked)
                }
                type="checkbox"
              />
              <span className="leading-7">
                Je certifie sur l&apos;honneur l&apos;exactitude des informations
                communiquées et autorise leur traitement par le Rectorat UCAO.
              </span>
            </label>
            {fieldErrors.certificationHonneur ? (
              <p className="error mt-2">{fieldErrors.certificationHonneur}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 border-t border-[#354f4516] pt-6 sm:flex-row sm:justify-between">
        <button
          className="btn-secondary"
          disabled={step === 0 || isSubmitting}
          onClick={handlePrevious}
          type="button"
        >
          Précédent
        </button>
        {step < 2 ? (
          <button className="btn-primary" onClick={handleNext} type="button">
            Suivant
          </button>
        ) : (
          <button className="btn-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Envoi en cours..." : "Enregistrer mon dossier"}
          </button>
        )}
      </div>
    </form>
  );
}
