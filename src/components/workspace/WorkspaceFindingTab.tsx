import React, { useState, useEffect } from 'react';
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

interface WorkspaceFindingTabProps {
  onGoToEvidence: () => void;
}

export const WorkspaceFindingTab: React.FC<WorkspaceFindingTabProps> = ({
  onGoToEvidence,
}) => {
  const { activeCase, evidenceList, submitFinding, findings } = useCaseStore();
  const currentFinding = findings[activeCase.id];
  const caseEvidence = evidenceList.filter((e) => e.caseId === activeCase.id);

  const [culprit, setCulprit] = useState(currentFinding?.culprit || '');
  const [discrepancy, setDiscrepancy] = useState(currentFinding?.discrepancy || '');
  const [explanation, setExplanation] = useState(currentFinding?.explanation || '');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    currentFinding?.selectedEvidenceIds || []
  );

  // Sync state when active case changes
  useEffect(() => {
    const finding = findings[activeCase.id];
    setCulprit(finding?.culprit || '');
    setDiscrepancy(finding?.discrepancy || '');
    setExplanation(finding?.explanation || '');
    setSelectedEvidenceIds(finding?.selectedEvidenceIds || []);
  }, [activeCase.id, findings]);

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
    <div className="h-full flex flex-col p-4 overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-investigative-border/50">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-investigative-violet" />
          <span className="text-sm font-semibold text-investigative-text">
            Submit Finding
          </span>
          <span className="text-xs text-investigative-text-muted font-mono">
            for {activeCase.code}
          </span>
        </div>
        {verdict && (
          <span
            className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              verdict.status === 'VERIFIED'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : verdict.status === 'PARTIAL'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {verdict.status === 'VERIFIED' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : verdict.status === 'PARTIAL' ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            <span>{verdict.status} ({verdict.score}/100)</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Finding Submission Form */}
        <div className="lg:col-span-7 bg-investigative-surface border border-investigative-border/60 rounded-xl p-4">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-investigative-text font-medium mb-1">
                Root Cause:
              </label>
              <input
                type="text"
                required
                value={culprit}
                onChange={(e) => setCulprit(e.target.value)}
                placeholder="e.g. Unsettled cancelled orders (₱1.5M) + unrecorded refunds (₱900K)"
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-lg px-3 py-2 text-xs text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet"
              />
            </div>

            <div>
              <label className="block text-investigative-text font-medium mb-1">
                Discrepancy / Variance Amount:
              </label>
              <input
                type="text"
                required
                value={discrepancy}
                onChange={(e) => setDiscrepancy(e.target.value)}
                placeholder="e.g. ₱2,400,000"
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-lg px-3 py-2 text-xs text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet"
              />
            </div>

            <div>
              <label className="block text-investigative-text font-medium mb-1">
                Summary & Explanation:
              </label>
              <textarea
                rows={3}
                required
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain how your SQL queries prove this finding..."
                className="w-full bg-investigative-surface-raised/40 border border-investigative-border/70 rounded-lg px-3 py-2 text-xs text-investigative-text placeholder:text-investigative-text-muted/50 focus:outline-none focus:border-investigative-violet leading-relaxed resize-none"
              />
            </div>

            {/* Supporting Evidence Checklist */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-investigative-text font-medium">
                  Attached Evidence ({selectedEvidenceIds.length}):
                </label>
                <button
                  type="button"
                  onClick={onGoToEvidence}
                  className="text-[11px] text-investigative-violet hover:underline cursor-pointer"
                >
                  Manage Evidence ({caseEvidence.length})
                </button>
              </div>

              {caseEvidence.length === 0 ? (
                <div className="p-2.5 bg-investigative-surface-raised/30 border border-investigative-border/50 rounded-lg text-investigative-text-muted text-[11px] flex items-center justify-between">
                  <span>No evidence pinned yet.</span>
                  <button
                    type="button"
                    onClick={onGoToEvidence}
                    className="text-investigative-violet hover:underline font-medium"
                  >
                    Pin Evidence →
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {caseEvidence.map((item) => {
                    const isChecked = selectedEvidenceIds.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors text-xs ${
                          isChecked
                            ? 'bg-investigative-surface-raised border-investigative-violet/60 text-investigative-text'
                            : 'bg-investigative-surface border-investigative-border/60 text-investigative-text-muted hover:border-investigative-border'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleEvidence(item.id)}
                          className="accent-violet-700 rounded"
                        />
                        <span className="truncate flex-1">{item.title}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-full text-xs font-medium bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verdict ? 'Update & Re-verify Finding' : 'Submit Finding for Verification'}</span>
            </button>
          </form>
        </div>

        {/* Real-time Verdict Output */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {verdict ? (
            <div
              className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 ${
                verdict.status === 'VERIFIED'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : verdict.status === 'PARTIAL'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {verdict.status === 'VERIFIED' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : verdict.status === 'PARTIAL' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                    <h4 className="font-bold text-sm text-investigative-text">
                      {verdict.status === 'VERIFIED'
                        ? 'Case Solved!'
                        : verdict.status === 'PARTIAL'
                        ? 'Partial Finding'
                        : 'Finding Incorrect'}
                    </h4>
                  </div>
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-investigative-surface text-investigative-text border border-investigative-border/50">
                    {verdict.score}/100
                  </span>
                </div>

                <p className="text-xs text-investigative-text/90 leading-relaxed mb-3">
                  {verdict.feedback}
                </p>

                {verdict.breakdown?.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-investigative-border/40 text-xs">
                    <span className="font-semibold text-investigative-text block text-[11px] uppercase tracking-wider">
                      Criteria Checklist:
                    </span>
                    <ul className="space-y-1">
                      {verdict.breakdown.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-investigative-text-muted text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-investigative-violet shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {verdict.status === 'VERIFIED' && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified ground truth matches this case!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full rounded-xl border border-dashed border-investigative-border/60 bg-investigative-surface/30 p-4 flex flex-col items-center justify-center text-center">
              <HelpCircle className="w-8 h-8 text-investigative-text-muted/40 mb-2" />
              <p className="text-xs font-medium text-investigative-text mb-1">
                Awaiting Submission
              </p>
              <p className="text-[11px] text-investigative-text-muted max-w-xs leading-relaxed font-light">
                Fill in the root cause and numbers on the left, then click Submit to verify your conclusion against the database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
