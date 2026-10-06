import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const FindingReport: React.FC = () => {
  const { activeCase, evidenceList, submitFinding, findings, setActiveView } = useCaseStore();
  const currentFinding = findings[activeCase.id];

  const caseEvidence = evidenceList.filter((e) => e.caseId === activeCase.id);

  const [culprit, setCulprit] = useState(currentFinding?.culprit || '');
  const [discrepancy, setDiscrepancy] = useState(currentFinding?.discrepancy || '');
  const [explanation, setExplanation] = useState(currentFinding?.explanation || '');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    currentFinding?.selectedEvidenceIds || []
  );

  const toggleEvidence = (id: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFinding({
      culprit,
      discrepancy,
      explanation,
      selectedEvidenceIds,
    });
  };

  const verdict = currentFinding?.verdict;

  return (
    <div className="h-full flex flex-col p-6 bg-investigative-bg overflow-y-auto">
      {/* Header */}
      <div className="pb-4 border-b border-investigative-border/50 mb-6">
        <div className="flex items-center space-x-2.5 mb-1">
          <FileText className="w-5 h-5 text-investigative-violet" />
          <h1 className="text-lg font-bold text-investigative-text">
            Final Investigation Finding
          </h1>
          <span className="text-xs font-mono bg-investigative-surface-raised/70 border border-investigative-border/60 px-2.5 py-0.5 rounded-md text-investigative-text-muted">
            {activeCase.code}
          </span>
        </div>
        <p className="text-xs text-investigative-text-muted">
          Synthesize your database exploration into a formal detective finding supported by pinned evidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Finding Form */}
        <div className="lg:col-span-7 bg-investigative-surface border border-investigative-border/60 rounded-xl p-5.5">
          <form onSubmit={handleSubmit} className="space-y-4.5 text-xs">
            <div>
              <label className="block text-investigative-text font-semibold mb-1.5">
                Root Cause / Identified Culprit:
              </label>
              <input
                type="text"
                required
                value={culprit}
                onChange={(e) => setCulprit(e.target.value)}
                placeholder="e.g. Unsettled cancelled orders (₱1.5M) + unrecorded refunds (₱900K)"
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-md px-3.5 py-2 text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet font-mono"
              />
            </div>

            <div>
              <label className="block text-investigative-text font-semibold mb-1.5">
                Total Financial Discrepancy / Mathematical Impact:
              </label>
              <input
                type="text"
                required
                value={discrepancy}
                onChange={(e) => setDiscrepancy(e.target.value)}
                placeholder="e.g. ₱2,400,000"
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-md px-3.5 py-2 text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet font-mono"
              />
            </div>

            <div>
              <label className="block text-investigative-text font-semibold mb-1.5">
                Detailed Investigation Summary:
              </label>
              <textarea
                rows={5}
                required
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain step-by-step how your SQL queries and data lineage prove this conclusion..."
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-md px-3.5 py-2 text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet font-mono leading-relaxed resize-none"
              />
            </div>

            {/* Evidence Checklist */}
            <div>
              <label className="block text-investigative-text font-semibold mb-2">
                Supporting Evidence from Board ({selectedEvidenceIds.length} selected):
              </label>
              {caseEvidence.length === 0 ? (
                <div className="p-3 bg-investigative-surface-raised/30 border border-investigative-border/50 rounded-lg text-investigative-text-muted text-[11px] flex items-center justify-between">
                  <span>No evidence pinned for this case yet.</span>
                  <button
                    type="button"
                    onClick={() => setActiveView('workspace')}
                    className="text-investigative-violet hover:underline font-semibold"
                  >
                    Go to Workspace →
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                  {caseEvidence.map((item) => {
                    const isChecked = selectedEvidenceIds.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-start space-x-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-investigative-surface-raised border-investigative-violet text-investigative-text shadow-2xs'
                            : 'bg-investigative-surface border-investigative-border/60 text-investigative-text-muted hover:border-investigative-border'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleEvidence(item.id)}
                          className="mt-0.5 accent-violet-700 rounded"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-investigative-text truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-investigative-text-muted truncate font-mono">
                            {item.query.substring(0, 60)}...
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors font-medium shadow-xs text-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Finding for Verification</span>
              </button>
            </div>
          </form>
        </div>

        {/* Verdict Evaluation Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-investigative-surface border border-investigative-border/60 rounded-xl p-5.5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-investigative-text-muted mb-3.5 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-investigative-violet" />
              <span>Verdict Evaluation</span>
            </h2>

            {!verdict ? (
              <div className="p-8 text-center border border-dashed border-investigative-border/60 rounded-lg bg-investigative-surface-raised/20">
                <HelpCircle className="w-8 h-8 text-investigative-border-muted/50 mx-auto mb-2" />
                <h3 className="text-xs font-semibold text-investigative-text mb-1">
                  Awaiting Finding Submission
                </h3>
                <p className="text-[11px] text-investigative-text-muted leading-relaxed">
                  Complete your investigation details and submit to test your findings against the ground truth case audit.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className={`p-4 rounded-lg border flex items-center justify-between ${
                  verdict.status === 'VERIFIED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : verdict.status === 'PARTIAL'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    {verdict.status === 'VERIFIED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : verdict.status === 'PARTIAL' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-violet-400" />
                    )}
                    <div>
                      <div className="text-xs font-mono font-bold tracking-wider">
                        {verdict.status === 'VERIFIED'
                          ? 'CASE SOLVED — VERIFIED'
                          : verdict.status === 'PARTIAL'
                          ? 'PARTIAL DISCOVERY'
                          : 'INCORRECT HYPOTHESIS'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        Score: {verdict.score} / 100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <p className="text-xs text-investigative-text leading-relaxed">
                  {verdict.feedback}
                </p>

                {/* Breakdown List */}
                <div className="space-y-2 pt-2 border-t border-investigative-border/40">
                  <span className="text-[11px] font-mono font-semibold text-investigative-text-muted uppercase">
                    Audit Breakdown:
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {verdict.breakdown.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-investigative-violet font-mono shrink-0">→</span>
                        <span className="text-investigative-text leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Official Ground Truth Summary (Only shown if solved) */}
          {verdict?.status === 'VERIFIED' && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4.5 text-xs space-y-2 animate-fadeIn">
              <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Case Debrief & Solution Note:</span>
              </div>
              <p className="text-investigative-text leading-relaxed">
                {activeCase.solution.rootCause}
              </p>
              <div className="text-[11px] text-investigative-text-muted font-mono pt-1">
                Mathematical Verification: {activeCase.solution.expectedDiscrepancyText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
