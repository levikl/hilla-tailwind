import { useEffect, useState } from "react";
// Hilla automatically generates this import path when you save the Kotlin service
import { SystemMonitorService } from "Frontend/generated/endpoints";

export default function IndexView() {
  const [status, setStatus] = useState<string>("Booting system...");

  useEffect(() => {
    // 100% type-safe call directly to your Kotlin backend
    SystemMonitorService.getStatus()
      .then(setStatus)
      .catch((err) => {
        console.error(err);
        setStatus("System Offline");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
        {/* Header Section */}
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
          Media Sync
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Powered by Kotlin, Hilla, and Tailwind v4
        </p>

        {/* Server Status Indicator */}
        <div className="flex items-center space-x-4 p-4 bg-slate-950 rounded-lg border border-slate-800/50">
          <div className="relative flex h-3 w-3">
            {status !== "System Offline" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${status === "System Offline" ? "bg-red-500" : "bg-emerald-500"}`}
            ></span>
          </div>
          <span className="font-mono text-sm text-slate-300">{status}</span>
        </div>

        {/* Navigation Example */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <a
            href="/RuleEditor"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            → Go to Rule Editor
          </a>
        </div>
      </div>
    </div>
  );
}
