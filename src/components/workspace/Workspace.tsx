import React, { useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { CaseDetails } from './CaseDetails';
import { SqlEditor } from './SqlEditor';
import { QueryOutput } from './QueryOutput';
import { QueryHistory } from './QueryHistory';
import { SaveEvidenceModal } from '../evidence/SaveEvidenceModal';

export const Workspace: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveEvidenceModal, setShowSaveEvidenceModal] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Case Details at Top */}
      <CaseDetails />

      {/* Resizable Split Panels for SQL Query & Results */}
      <div className="flex-1 min-h-0 relative">
        <PanelGroup direction="vertical" className="h-full w-full">
          {/* Top Panel: SQL Editor */}
          <Panel defaultSize={45} minSize={20} className="flex flex-col overflow-hidden">
            <SqlEditor
              onToggleHistory={() => setShowHistory(!showHistory)}
              showHistory={showHistory}
            />
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="h-1.5 bg-investigative-border hover:bg-investigative-red transition-colors cursor-row-resize flex items-center justify-center shrink-0">
            <div className="w-8 h-0.5 bg-investigative-border-muted rounded" />
          </PanelResizeHandle>

          {/* Bottom Panel: Query Output (Results / Chart / Notes) */}
          <Panel defaultSize={55} minSize={25} className="flex flex-col overflow-hidden">
            <QueryOutput onOpenSaveEvidence={() => setShowSaveEvidenceModal(true)} />
          </Panel>
        </PanelGroup>

        {/* History Flyout Drawer */}
        <QueryHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>

      {/* Save Evidence Modal Dialog */}
      <SaveEvidenceModal
        isOpen={showSaveEvidenceModal}
        onClose={() => setShowSaveEvidenceModal(false)}
      />
    </div>
  );
};
