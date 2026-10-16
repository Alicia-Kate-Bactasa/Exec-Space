import React, { useMemo, useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { NoteItem, NoteSortOption } from '../../types';
import {
  Folder,
  FolderPlus,
  Edit3,
  Trash2,
  Plus,
  Search,
  ArrowUpDown,
  Calendar,
  Clock,
  Database,
  ArrowRight,
  Check,
  X,
  FileText,
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const {
    notesList,
    availableFolders,
    cases,
    createNote,
    updateNote,
    deleteNote,
    addFolder,
    selectCase,
    setActiveView,
    setWorkspaceTab,
  } = useCaseStore();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<NoteSortOption>('latest'); // Default: latest at top

  // Create / Edit Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formFolder, setFormFolder] = useState('General');
  const [formCaseId, setFormCaseId] = useState<string>('');

  // New Folder inline creation state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Delete Confirmation State
  const [noteToDelete, setNoteToDelete] = useState<NoteItem | null>(null);

  // Filtered & Sorted Notes
  const filteredNotes = useMemo(() => {
    return notesList
      .filter((note) => {
        // Folder filter
        if (selectedFolder !== 'all' && note.folder !== selectedFolder) {
          return false;
        }

        // Case filter
        if (selectedCaseFilter !== 'all') {
          if (selectedCaseFilter === 'none') {
            if (note.caseId) return false;
          } else if (note.caseId !== selectedCaseFilter) {
            return false;
          }
        }

        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(query);
          const matchContent = note.content.toLowerCase().includes(query);
          const matchCase =
            note.caseCode?.toLowerCase().includes(query) ||
            note.caseTitle?.toLowerCase().includes(query);
          const matchFolder = note.folder.toLowerCase().includes(query);
          return matchTitle || matchContent || matchCase || matchFolder;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [notesList, selectedFolder, selectedCaseFilter, searchQuery, sortBy]);

  // Open Editor for new note
  const handleOpenCreate = () => {
    setEditingNoteId(null);
    setFormTitle('');
    setFormContent('');
    setFormFolder(selectedFolder !== 'all' ? selectedFolder : 'General');
    setFormCaseId('');
    setIsEditorOpen(true);
  };

  // Open Editor for existing note
  const handleOpenEdit = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormFolder(note.folder);
    setFormCaseId(note.caseId || '');
    setIsEditorOpen(true);
  };

  // Save Note handler
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formContent.trim()) return;

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: formTitle.trim() || 'Untitled Note',
        content: formContent,
        folder: formFolder,
        caseId: formCaseId || undefined,
      });
    } else {
      createNote({
        title: formTitle.trim() || 'Untitled Note',
        content: formContent,
        folder: formFolder,
        caseId: formCaseId || undefined,
      });
    }

    setIsEditorOpen(false);
  };

  // Create New Folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setSelectedFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  // Confirm and execute note deletion
  const handleConfirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setNoteToDelete(null);
    }
  };

  // Navigate to Case Workspace
  const handleOpenCase = async (caseId: string) => {
    await selectCase(caseId);
    setWorkspaceTab('notes');
    setActiveView('workspace');
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-investigative-bg text-investigative-text overflow-hidden">
      {/* Top Header Banner */}
      <div className="border-b border-investigative-border/60 bg-investigative-surface/80 px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-investigative-text">
              Notes
            </h1>
            <p className="text-xs md:text-sm text-investigative-text-muted mt-1">
              Organize your case findings, hypotheses, and scratch notes across investigations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors text-sm font-medium cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Folders Sidebar + Right Notes Grid */}
      <div className="flex-1 min-h-0 flex overflow-hidden max-w-7xl w-full mx-auto">
        {/* Folders Sidebar */}
        <aside className="w-64 border-r border-investigative-border/60 p-4 shrink-0 flex flex-col bg-investigative-surface/30 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs uppercase font-medium text-investigative-text-muted tracking-wider">
              Folders
            </span>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="p-1 rounded-md text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors cursor-pointer"
              title="Add Folder"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {/* New Folder Form */}
          {isCreatingFolder && (
            <form onSubmit={handleCreateFolder} className="mb-3 p-2 rounded-xl bg-investigative-surface border border-investigative-border/80">
              <input
                type="text"
                autoFocus
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-investigative-surface-raised/60 border border-investigative-border/60 rounded-lg text-investigative-text focus:outline-none focus:border-investigative-violet"
              />
              <div className="flex items-center justify-end gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-2 py-1 text-xs text-investigative-text-muted hover:text-investigative-text cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-2.5 py-1 text-xs rounded-md bg-investigative-violet text-white hover:bg-investigative-violet-hover disabled:opacity-40 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          {/* Folder Filter List */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setSelectedFolder('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                selectedFolder === 'all'
                  ? 'bg-investigative-violet text-white'
                  : 'text-investigative-text hover:bg-investigative-surface-raised'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">All Notes</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedFolder === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-investigative-surface-raised text-investigative-text-muted'
                }`}
              >
                {notesList.length}
              </span>
            </button>

            {availableFolders.map((folder) => {
              const count = notesList.filter((n) => n.folder === folder).length;
              const isSelected = selectedFolder === folder;
              return (
                <button
                  key={folder}
                  type="button"
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-investigative-violet text-white'
                      : 'text-investigative-text hover:bg-investigative-surface-raised'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Folder className="w-4 h-4 shrink-0" />
                    <span className="truncate">{folder}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-investigative-surface-raised text-investigative-text-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Case Filter Section */}
          <div className="mt-6 pt-4 border-t border-investigative-border/50">
            <span className="text-xs uppercase font-medium text-investigative-text-muted tracking-wider block px-2 mb-2">
              Case Filter
            </span>
            <select
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-investigative-surface border border-investigative-border/70 text-investigative-text focus:outline-none focus:border-investigative-violet cursor-pointer"
            >
              <option value="all">All Cases</option>
              <option value="none">General (No Case)</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-1 min-w-0 flex flex-col overflow-hidden p-4 md:p-6">
          {/* Controls Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-investigative-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, folder, or content..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-investigative-surface border border-investigative-border/60 rounded-full text-investigative-text placeholder:text-investigative-text-muted/60 focus:outline-none focus:border-investigative-violet shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-investigative-text-muted hover:text-investigative-text cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-investigative-text-muted flex items-center gap-1 font-mono">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as NoteSortOption)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-investigative-surface border border-investigative-border/70 text-investigative-text focus:outline-none focus:border-investigative-violet cursor-pointer"
              >
                <option value="latest">Latest at top (Default)</option>
                <option value="oldest">Oldest first</option>
                <option value="title-asc">Title (A to Z)</option>
                <option value="title-desc">Title (Z to A)</option>
              </select>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center rounded-2xl border border-dashed border-investigative-border/70 p-6 text-center">
                <FileText className="w-10 h-10 text-investigative-text-muted/50 mb-3" />
                <h3 className="text-sm font-semibold text-investigative-text mb-1">
                  No notes found
                </h3>
                <p className="text-xs text-investigative-text-muted max-w-sm mb-4">
                  {searchQuery || selectedFolder !== 'all' || selectedCaseFilter !== 'all'
                    ? 'No notes match your current filters. Try resetting the search or filter.'
                    : 'You have not created any notes yet. Click New Note to create your first note.'}
                </p>
                <button
                  onClick={handleOpenCreate}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-investigative-violet text-white text-xs font-medium hover:bg-investigative-violet-hover transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Note</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredNotes.map((note) => {
                  const words = note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
                  const chars = note.content.length;

                  return (
                    <div
                      key={note.id}
                      className="rounded-2xl border border-investigative-border/60 bg-investigative-surface p-4 flex flex-col justify-between hover:border-investigative-violet/60 transition-all shadow-xs group"
                    >
                      <div>
                        {/* Top Badges: Folder & Case */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-investigative-surface-raised border border-investigative-border/60 text-investigative-text-muted flex items-center gap-1 shrink-0">
                            <Folder className="w-3 h-3 text-investigative-violet" />
                            <span>{note.folder}</span>
                          </span>

                          {note.caseCode && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-investigative-violet-subtle border border-investigative-violet/20 text-investigative-violet truncate max-w-36">
                              {note.caseCode}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-sm md:text-base font-semibold text-investigative-text mb-1.5 leading-snug break-words">
                          {note.title}
                        </h2>

                        {/* Note Snippet */}
                        <p className="text-xs text-investigative-text-muted leading-relaxed line-clamp-4 whitespace-pre-wrap font-mono mb-4">
                          {note.content || '(Empty note)'}
                        </p>
                      </div>

                      {/* Metadata Card Footer */}
                      <div className="pt-3 border-t border-investigative-border/40 space-y-2">
                        {/* Metadata: Dates and Counts */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-investigative-text-muted">
                          <div className="flex items-center gap-1" title={`Updated: ${formatDate(note.updatedAt)} ${formatTime(note.updatedAt)}`}>
                            <Clock className="w-3 h-3 text-investigative-violet" />
                            <span>{formatDate(note.updatedAt)}</span>
                          </div>
                          <div>
                            <span>{words} {words === 1 ? 'word' : 'words'}</span>
                            <span className="mx-1">·</span>
                            <span>{chars} chars</span>
                          </div>
                        </div>

                        {/* Associated Case Subtitle if present */}
                        {note.caseTitle && (
                          <div className="text-[11px] text-investigative-text-muted font-light truncate flex items-center gap-1">
                            <Database className="w-3 h-3 text-investigative-violet shrink-0" />
                            <span className="truncate">{note.caseTitle}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenEdit(note)}
                              className="p-1.5 rounded-lg text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors cursor-pointer"
                              title="Edit note"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setNoteToDelete(note)}
                              className="p-1.5 rounded-lg text-investigative-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {note.caseId && (
                            <button
                              onClick={() => handleOpenCase(note.caseId!)}
                              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium text-investigative-violet hover:bg-investigative-violet-subtle border border-investigative-violet/30 transition-colors cursor-pointer"
                            >
                              <span>Open Case</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create / Edit Note Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-investigative-surface border border-investigative-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-investigative-border/60 flex items-center justify-between bg-investigative-surface-raised/40">
              <h2 className="text-base font-semibold text-investigative-text">
                {editingNoteId ? 'Edit Note' : 'New Note'}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-investigative-text-muted hover:text-investigative-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNote} className="p-5 flex-1 flex flex-col space-y-4 overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-investigative-text-muted uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discrepancy Breakdown for Case #01"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-investigative-surface-raised/40 border border-investigative-border/60 rounded-xl text-investigative-text focus:outline-none focus:border-investigative-violet"
                />
              </div>

              {/* Folder & Case selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-investigative-text-muted uppercase tracking-wider mb-1">
                    Folder
                  </label>
                  <select
                    value={formFolder}
                    onChange={(e) => setFormFolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-investigative-surface-raised/40 border border-investigative-border/60 rounded-xl text-investigative-text focus:outline-none focus:border-investigative-violet cursor-pointer"
                  >
                    {availableFolders.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-investigative-text-muted uppercase tracking-wider mb-1">
                    Related Case
                  </label>
                  <select
                    value={formCaseId}
                    onChange={(e) => setFormCaseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-investigative-surface-raised/40 border border-investigative-border/60 rounded-xl text-investigative-text focus:outline-none focus:border-investigative-violet cursor-pointer"
                  >
                    <option value="">None (General Note)</option>
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Note Content */}
              <div className="flex-1 flex flex-col min-h-48">
                <label className="block text-xs font-medium text-investigative-text-muted uppercase tracking-wider mb-1">
                  Content
                </label>
                <textarea
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Record hypotheses, observations, query logic, or findings here..."
                  className="flex-1 w-full p-3.5 text-xs font-mono bg-investigative-surface-raised/40 border border-investigative-border/60 rounded-xl text-investigative-text focus:outline-none focus:border-investigative-violet resize-none leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-investigative-border/50">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-medium bg-investigative-violet text-white hover:bg-investigative-violet-hover transition-colors cursor-pointer shadow-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-investigative-surface border border-investigative-border/80 rounded-2xl shadow-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-investigative-text">
              Delete Note
            </h2>
            <p className="text-xs text-investigative-text-muted leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-investigative-text">"{noteToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                className="px-3.5 py-1.5 rounded-full text-xs text-investigative-text-muted hover:text-investigative-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-full text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
