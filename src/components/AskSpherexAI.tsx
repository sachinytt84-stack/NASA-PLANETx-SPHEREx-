import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Lightbulb, CheckCircle2 } from 'lucide-react';
import { getPreInstalledAnswer } from '../data/spherexKnowledgeBase';

interface AskSpherexAIProps {
  initialTopic?: string;
}

export const AskSpherexAI: React.FC<AskSpherexAIProps> = ({ initialTopic }) => {
  const [question, setQuestion] = useState<string>(initialTopic || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any | null>(() => {
    if (initialTopic) {
      return getPreInstalledAnswer(initialTopic);
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);

  const presetQuestions = [
    "Why does SPHEREx look like three giant umbrellas stacked together?",
    "How is Time in Orbit manually calculated from the March 11, 2025 launch?",
    "Where did Earth's water come from, and how is SPHEREx finding it?",
    "What is the difference between SPHEREx and the James Webb Space Telescope?",
    "Why does SPHEREx need 102 colors when human eyes only see 3?",
    "How does the telescope stay at -350°F without running out of coolant?",
    "How do we detect alien planets when stars dim and brighten?"
  ];

  const handleAsk = async (qText?: string) => {
    const textToAsk = qText || question;
    if (!textToAsk.trim()) return;

    setIsLoading(true);
    setError(null);

    // Immediate offline-ready pre-installed response fallback
    const offlineFallback = getPreInstalledAnswer(textToAsk);

    try {
      const res = await fetch('/api/spherex/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: textToAsk,
          mode: 'explain_for_layperson',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.answer) {
          setResponse(data);
          return;
        }
      }
      // If server has no key or returned fallback, use our rich pre-installed response
      setResponse(offlineFallback);
    } catch (err: any) {
      console.warn('Network unavailable, serving pre-installed answer:', err);
      // Seamlessly serve pre-installed offline answer with zero failure!
      setResponse(offlineFallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="ask-spherex-ai-section">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            100% PRE-INSTALLED KNOWLEDGE BASE • OFFLINE-READY • ZERO API KEYS REQUIRED
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Ask SPHEREx in Plain English
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Have a question about NASA's SPHEREx mission, its rocket launch, cosmic water discoveries, or confusing terms in NASA press releases? Ask below for a clear, jargon-free explanation with relatable analogies.
          </p>
        </div>
      </div>

      {/* Preset Questions Chips */}
      <div className="space-y-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
          Frequently Wondered Questions (Click to Ask):
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(q);
                handleAsk(q);
              }}
              className="text-xs text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300 border border-slate-200 px-3.5 py-2 rounded-xl transition-all text-left cursor-pointer flex items-center gap-2 shadow-2xs"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm focus-within:border-slate-950 focus-within:ring-1 focus-within:ring-slate-950 transition-all">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            placeholder="Type any question or paste a confusing NASA sentence..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Explain in Simple Terms</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Result Card */}
      {response && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 text-indigo-900 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Plain-English Translation:
          </div>

          <div className="space-y-4">
            <div className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {response.answer}
            </div>

            {response.simpleAnalogy && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 space-y-1 shadow-2xs">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Everyday Analogy:
                </span>
                <p className="text-sm italic font-medium text-amber-950">
                  "{response.simpleAnalogy}"
                </p>
              </div>
            )}

            {response.whyItMattersToHumans && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                  Why It Matters to Humans on Earth:
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {response.whyItMattersToHumans}
                </p>
              </div>
            )}

            {response.quickFacts && response.quickFacts.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  Key Takeaway Facts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {response.quickFacts.map((fact: string, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                      • {fact}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
