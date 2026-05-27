import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { useForm, useFormPart } from "@vaadin/hilla-react-form";
import { RuleService } from "Frontend/generated/endpoints";
import type MediaRule from "Frontend/generated/com/example/models/MediaRule";
import MediaRuleModel from "Frontend/generated/com/example/models/MediaRuleModel";

export async function loader() {
  const result = await RuleService.getRules();
  return result.filter((r) => r != null);
}

export default function RulesView() {
  const rules = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();
  const [selectedRule, setSelectedRule] = useState<MediaRule | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "deleting" | "deleted"
  >("idle");

  const isEditing = selectedRule != null;

  const { field, model, submit, reset, read } = useForm(MediaRuleModel, {
    onSubmit: async (rule) => {
      setSaveStatus("saving");
      try {
        await RuleService.saveRule(rule);
        setSaveStatus("saved");
        reset();
        setSelectedRule(null);
        revalidate();
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
      }
    },
  });

  const nameState = useFormPart(model.name);

  function handleEdit(rule: MediaRule) {
    setSelectedRule(rule);
    read(rule);
    setSaveStatus("idle");
  }

  function handleNew() {
    setSelectedRule(null);
    reset();
    setSaveStatus("idle");
  }

  async function handleDelete() {
    if (!selectedRule?.id) return;
    setSaveStatus("deleting");
    try {
      await RuleService.deleteRule(selectedRule.id);
      setSaveStatus("deleted");
      reset();
      setSelectedRule(null);
      revalidate();
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <a
              href="/"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back
            </a>
            <h1 className="mt-4 text-2xl font-bold !text-slate-100">
              Rule Editor
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Define media sync rules
            </p>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={handleNew}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + New Rule
            </button>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
        >
          <h2 className="text-sm font-semibold !text-slate-200">
            {isEditing ? "Edit Rule" : "New Rule"}
          </h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              Rule Name
            </label>
            <input
              {...field(model.name)}
              placeholder="e.g. Movies → NAS"
              className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-slate-100 placeholder-slate-600 text-sm outline-none transition-colors focus:ring-1 ${
                nameState.invalid
                  ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
                  : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/30"
              }`}
            />
            {nameState.invalid && (
              <p className="text-xs text-red-400">
                {nameState.ownErrors[0]?.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              Target Directory
            </label>
            <input
              {...field(model.targetDirectory)}
              placeholder="e.g. /mnt/nas/movies"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-600 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {saveStatus === "saving"
                ? "Saving…"
                : isEditing
                  ? "Update Rule"
                  : "Save Rule"}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saveStatus === "deleting"}
                className="py-2 px-4 rounded-lg border border-red-800 hover:border-red-600 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              >
                {saveStatus === "deleting" ? "Deleting…" : "Delete"}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="py-2 px-4 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-sm transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {saveStatus === "saved" && (
            <p className="text-sm text-emerald-400 text-center">
              Rule saved successfully.
            </p>
          )}
          {saveStatus === "deleted" && (
            <p className="text-sm text-emerald-400 text-center">
              Rule deleted.
            </p>
          )}
          {saveStatus === "error" && (
            <p className="text-sm text-red-400 text-center">
              Operation failed. Please try again.
            </p>
          )}
        </form>

        {/* Rules table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold !text-slate-200">
              Existing Rules
            </h2>
          </div>

          {rules.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-500 text-center">
              No rules exist.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">
                    Target Directory
                  </th>
                  <th className="px-6 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => {
                  const isActive = selectedRule?.id === rule.id;
                  return (
                    <tr
                      key={rule.id}
                      className={`border-b border-slate-800/50 last:border-0 transition-colors ${
                        isActive ? "bg-slate-800/60" : "hover:bg-slate-800/30"
                      }`}
                    >
                      <td className="px-6 py-3 text-slate-200 font-medium">
                        {rule.name}
                      </td>
                      <td className="px-6 py-3 text-slate-400 font-mono">
                        {rule.targetDirectory || (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            isActive ? handleNew() : handleEdit(rule)
                          }
                          className={`text-xs px-3 py-1 rounded-md border transition-colors ${
                            isActive
                              ? "border-blue-600 text-blue-400 bg-blue-950/40"
                              : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                          }`}
                        >
                          {isActive ? "Editing" : "Edit"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
