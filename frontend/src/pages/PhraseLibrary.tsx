import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { apiService } from '../services/apiService';
import { ScamPhrase, ScamCategory } from '../types/fraud.types';
import { SCAM_CATEGORIES, DEFAULT_PHRASES_CATALOG } from '../utils/constants';
import { 
  BookOpen, 
  Search, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  Trash2, 
  Sparkles,
  Layers,
  Sliders,
  Filter
} from 'lucide-react';

export const PhraseLibrary: React.FC = () => {
  const [phrases, setPhrases] = useState<ScamPhrase[]>(DEFAULT_PHRASES_CATALOG);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Add rule modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState<ScamCategory>('OTP_THEFT');
  const [newWeight, setNewWeight] = useState<number>(40);
  const [newDesc, setNewDesc] = useState('');
  const [newPattern, setNewPattern] = useState('');
  const [newVictim, setNewVictim] = useState('');

  useEffect(() => {
    const loadPhrases = async () => {
      const stored = localStorage.getItem('audio_guardian_phrases_custom');
      if (stored) {
        try {
          setPhrases(JSON.parse(stored));
          return;
        } catch {}
      }
      const data = await apiService.getPhraseLibrary();
      setPhrases(data);
    };
    loadPhrases();
  }, []);

  const filteredPhrases = useMemo(() => {
    return phrases.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesSearch =
        p.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.examplePattern && p.examplePattern.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [phrases, selectedCategory, searchTerm]);

  const handleAddPhrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhrase.trim()) return;

    const newEntry: ScamPhrase = {
      id: `rule_custom_${Date.now()}`,
      phrase: newPhrase.trim(),
      category: newCategory,
      severityWeight: Number(newWeight),
      description: newDesc.trim() || 'Custom detection rule added by user',
      examplePattern: newPattern.trim() || `"${newPhrase.trim()}"`,
      targetVictimProfile: newVictim.trim() || 'General callers',
      isActive: true,
    };

    const updated = [newEntry, ...phrases];
    setPhrases(updated);
    localStorage.setItem('audio_guardian_phrases_custom', JSON.stringify(updated));

    setNewPhrase('');
    setNewDesc('');
    setNewPattern('');
    setNewVictim('');
    setIsAddOpen(false);
  };

  const handleDeletePhrase = (id: string) => {
    const updated = phrases.filter(p => p.id !== id);
    setPhrases(updated);
    localStorage.setItem('audio_guardian_phrases_custom', JSON.stringify(updated));
  };

  const getSeverityBadge = (weight: number) => {
    if (weight >= 40) return <Badge variant="fraud" size="sm">Critical Weight (+{weight})</Badge>;
    if (weight >= 25) return <Badge variant="suspicious" size="sm">Medium Weight (+{weight})</Badge>;
    return <Badge variant="safe" size="sm">Low Weight (+{weight})</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-cyan" />
            Linguistic Scam Phrase Library & Heuristics
          </h2>
          <p className="text-xs text-cyber-muted">
            Searchable repository of known telecom fraud keywords, coercive speech triggers, and heuristic scoring weights.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Scam Detection Rule
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-96">
            <Input
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              placeholder="Search phrases, keywords, or examples..."
              leftIcon={<Search className="w-4 h-4 text-cyber-muted" />}
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs font-semibold text-cyber-muted mr-1">Category:</span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-brand-primary text-white shadow-glow-primary'
                  : 'bg-slate-800 text-cyber-muted hover:text-cyber-text'
              }`}
            >
              All Categories
            </button>
            {Object.entries(SCAM_CATEGORIES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  selectedCategory === key
                    ? 'bg-brand-primary text-white shadow-glow-primary'
                    : 'bg-slate-800 text-cyber-muted hover:text-cyber-text'
                }`}
              >
                {value.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPhrases.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-cyber-muted space-y-2">
            <BookOpen className="w-8 h-8 text-cyber-subtle opacity-40 mx-auto" />
            <p className="text-sm font-medium">No scam phrases found matching criteria.</p>
          </div>
        ) : (
          filteredPhrases.map((phrase) => {
            const cat = SCAM_CATEGORIES[phrase.category as ScamCategory] || SCAM_CATEGORIES.SAFE;
            return (
              <Card
                key={phrase.id}
                className="p-5 border border-cyber-border space-y-3 flex flex-col justify-between hover:border-slate-600 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-mono font-bold text-cyber-muted uppercase">
                        {cat.label}
                      </span>
                    </div>
                    {getSeverityBadge(phrase.severityWeight)}
                  </div>

                  <h4 className="text-base font-bold text-white font-mono leading-snug">
                    "{phrase.phrase}"
                  </h4>

                  <p className="text-xs text-cyber-muted leading-relaxed">
                    {phrase.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-cyber-border/60">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyber-border/40 text-xs font-mono text-slate-300">
                    <span className="text-cyber-subtle block text-[10px] uppercase font-semibold mb-0.5">
                      Pattern Fingerprint:
                    </span>
                    {phrase.examplePattern}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-cyber-subtle">
                    <span>Target: {phrase.targetVictimProfile}</span>
                    <button
                      onClick={() => handleDeletePhrase(phrase.id)}
                      className="p-1 text-cyber-muted hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Custom Scam Pattern Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Scam Linguistic Trigger"
      >
        <form onSubmit={handleAddPhrase} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Key Trigger Phrase</label>
            <Input
              required
              value={newPhrase}
              onChange={(e: any) => setNewPhrase(e.target.value)}
              placeholder="e.g. transfer money to verify innocence"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Threat Category</label>
            <select
              value={newCategory}
              onChange={(e: any) => setNewCategory(e.target.value as ScamCategory)}
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-brand-primary"
            >
              {Object.entries(SCAM_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-cyber-muted uppercase">Severity Weight (+{newWeight} pts)</label>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={newWeight}
              onChange={(e: any) => setNewWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Rule Description</label>
            <Input
              value={newDesc}
              onChange={(e: any) => setNewDesc(e.target.value)}
              placeholder="e.g. Coercing victim to move funds to fake escrow accounts"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase">Example Sentence</label>
            <Input
              value={newPattern}
              onChange={(e: any) => setNewPattern(e.target.value)}
              placeholder="e.g. You must transfer money to the RBI escrow immediately"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Detection Pattern
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
