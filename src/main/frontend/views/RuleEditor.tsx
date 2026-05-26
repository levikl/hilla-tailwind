import { useState } from "react";
import { useForm, useFormPart } from "@vaadin/hilla-react-form";
import { RuleService } from "Frontend/generated/endpoints";
import MediaRuleModel from "Frontend/generated/com/example/models/MediaRuleModel";

export default function RuleEditor() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const { field, model, submit, reset } = useForm(MediaRuleModel, {
    onSubmit: async (rule) => {
      setSaveStatus("saving");
      try {
        await RuleService.saveRule(rule);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
      }
    },
  });

  const nameState = useFormPart(model.name);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← Back
          </a>
          <h1 className="mt-4 text-2xl font-bold text-slate-100">Rule Editor</h1>
          <p className="text-slate-400 text-sm mt-1">Define a new media sync rule</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Rule Name</label>
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
              <p className="text-xs text-red-400">{nameState.ownErrors[0]?.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Target Directory</label>
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
              {saveStatus === "saving" ? "Saving…" : "Save Rule"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="py-2 px-4 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-sm transition-colors"
            >
              Reset
            </button>
          </div>

          {saveStatus === "saved" && (
            <p className="text-sm text-emerald-400 text-center">Rule saved successfully.</p>
          )}
          {saveStatus === "error" && (
            <p className="text-sm text-red-400 text-center">Failed to save. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
