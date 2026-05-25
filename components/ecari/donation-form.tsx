"use client";

import { useState } from "react";

type DonationDraft = {
  amount: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  operator: "WAVE" | "Orange" | "MTN" | "MOOV" | "";
};

const operators = ["WAVE", "Orange", "MTN", "MOOV"] as const;

const initialState: DonationDraft = {
  amount: "",
  nom: "",
  prenom: "",
  email: "",
  phone: "",
  operator: "",
};

export function DonationForm() {
  const [form, setForm] = useState<DonationDraft>(initialState);
  const [isPrepared, setIsPrepared] = useState(false);

  function updateField<K extends keyof DonationDraft>(key: K, value: DonationDraft[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <form
        className="panel rounded-[2.2rem] px-6 py-6 md:px-7"
        onSubmit={(event) => {
          event.preventDefault();
          setIsPrepared(true);
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label>
            <span className="label">Votre don</span>
            <input
              className="field"
              inputMode="numeric"
              min="1"
              name="amount"
              onChange={(event) => updateField("amount", event.target.value)}
              placeholder="Montant a donner"
              required
              type="number"
              value={form.amount}
            />
          </label>

          <div className="rounded-[1.4rem] border border-[rgba(53,79,69,0.12)] bg-white/70 px-4 py-4 text-sm leading-6 text-[#4f6158]">
            Le paiement mobile n&apos;est pas encore active en ligne. Cette page
            prepare les informations necessaires avant l&apos;integration WAVE,
            Orange, MTN et MOOV.
          </div>

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
            <span className="label">Numero de telephone mobile</span>
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

        <div className="mt-6">
          <span className="label">Operateur mobile souhaite</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {operators.map((operator) => {
              const isActive = form.operator === operator;

              return (
                <label
                  className="ecari-operator-option"
                  data-active={isActive}
                  key={operator}
                >
                  <input
                    checked={isActive}
                    className="sr-only"
                    name="operator"
                    onChange={() => updateField("operator", operator)}
                    required
                    type="radio"
                    value={operator}
                  />
                  <span className="text-lg font-semibold text-[#18322c]">
                    {operator}
                  </span>
                  <span className="text-sm leading-6 text-[#5a6b63]">
                    Paiement mobile a relier lors de la prochaine iteration.
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" type="submit">
            Preparer mon don
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setForm(initialState);
              setIsPrepared(false);
            }}
            type="button"
          >
            Reinitialiser
          </button>
        </div>
      </form>

      <aside className="panel rounded-[2.2rem] px-6 py-6 md:px-7">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7b4e1f]">
          Operateurs
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {operators.map((operator) => (
            <span className="badge" key={operator}>
              {operator}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-[rgba(53,79,69,0.12)] bg-white/72 px-4 py-4 text-sm leading-7 text-[#4f6158]">
          {isPrepared ? (
            <>
              <p className="font-semibold text-[#18322c]">
                Recapitulatif de votre intention de don
              </p>
              <div className="mt-3 space-y-2">
                <p>
                  <strong>Montant :</strong> {form.amount}
                </p>
                <p>
                  <strong>Nom :</strong> {form.nom}
                </p>
                <p>
                  <strong>Prenom :</strong> {form.prenom}
                </p>
                <p>
                  <strong>Courriel :</strong> {form.email}
                </p>
                <p>
                  <strong>Telephone :</strong> {form.phone}
                </p>
                <p>
                  <strong>Operateur :</strong> {form.operator}
                </p>
              </div>
              <p className="mt-4">
                Aucune transaction n&apos;est encore lancee a ce stade. Cette
                etape prepare la future integration du paiement mobile.
              </p>
            </>
          ) : (
            <p>
              Renseignez le formulaire pour verifier vos informations avant
              l&apos;activation du paiement mobile sur le site.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
