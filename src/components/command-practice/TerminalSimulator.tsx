"use client";

import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { simulateCommand, validateCommand } from "@/lib/simulator";
import type { CommandPractice } from "@/lib/types";

interface TerminalSimulatorProps {
  exercise: CommandPractice;
  onSuccess: (points: number) => void;
  alreadyCompleted?: boolean;
}

interface HistoryEntry {
  cmd: string;
  output: string;
  success?: boolean;
}

export function TerminalSimulator({ exercise, onSuccess, alreadyCompleted = false }: TerminalSimulatorProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [hintUsed, setHintUsed] = useState(false);

  // Command history navigation
  const [histCursor, setHistCursor] = useState(-1);
  const [savedInput, setSavedInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const cmds = history.map((h) => h.cmd);

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmds.length === 0) return;
      if (histCursor === -1) {
        // First up-press: save current input, jump to most recent command
        setSavedInput(input);
        setHistCursor(0);
        setInput(cmds[cmds.length - 1]);
      } else if (histCursor < cmds.length - 1) {
        const next = histCursor + 1;
        setHistCursor(next);
        setInput(cmds[cmds.length - 1 - next]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histCursor === -1) return;
      if (histCursor === 0) {
        // Back to current input
        setHistCursor(-1);
        setInput(savedInput);
      } else {
        const next = histCursor - 1;
        setHistCursor(next);
        setInput(cmds[cmds.length - 1 - next]);
      }
      return;
    }

    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (!input.trim() || completed) return;

    const cmd = input.trim();
    const output = simulateCommand(cmd);
    const success = validateCommand(cmd, exercise.validation);

    setHistory((prev) => [...prev, { cmd, output, success }]);
    setInput("");
    setHistCursor(-1);
    setSavedInput("");

    if (success && !completed) {
      setCompleted(true);
      onSuccess(exercise.points);
    }
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Terminal window chrome */}
      <div className="flex items-center gap-1.5 bg-zinc-800 px-3 py-2">
        <span className="size-3 rounded-full bg-red-500" />
        <span className="size-3 rounded-full bg-yellow-400" />
        <span className="size-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-zinc-400 font-mono">kubectl terminal (simulated)</span>
        {completed && (
          <Badge className="ml-auto bg-green-600 hover:bg-green-600 text-white text-xs">
            +{exercise.points} pts earned
          </Badge>
        )}
      </div>

      {/* Terminal body */}
      <div
        className="bg-zinc-950 text-green-400 font-mono text-sm p-4 min-h-[220px] max-h-[380px] overflow-y-auto cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.length === 0 && (
          <div className="text-zinc-500 text-xs mb-2">
            # Type a kubectl command below and press Enter (↑↓ for history)
          </div>
        )}

        {history.map((entry, i) => (
          <div key={i} className="mb-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="text-zinc-500">$</span>
              <span>{entry.cmd}</span>
            </div>
            <pre className="mt-1 whitespace-pre-wrap break-words text-xs text-green-300 leading-relaxed">
              {entry.output}
            </pre>
            {entry.success !== undefined && (
              <div className={`mt-1 text-xs ${entry.success ? "text-green-500" : "text-yellow-500"}`}>
                {entry.success
                  ? `✓ Validation passed — ${exercise.points} points awarded!`
                  : "✗ Expected output not found — try again"}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />

        {/* Input line */}
        {!completed && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-zinc-500 shrink-0">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Any manual edit resets history cursor
                if (histCursor !== -1) setHistCursor(-1);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none caret-green-400 text-green-400 font-mono"
              autoComplete="off"
              spellCheck={false}
              autoFocus
              placeholder="type command here..."
            />
          </div>
        )}
        {completed && (
          <div className="text-green-500 text-xs mt-2">
            ✓ Exercise completed! Well done.
          </div>
        )}
      </div>

      {/* Hint bar */}
      {!completed && (
        <div className="bg-zinc-900 border-t border-zinc-700 px-4 py-2 flex items-center gap-3 min-h-[38px]">
          {hintUsed ? (
            <span className="text-xs text-amber-400 font-mono">
              Answer filled in — press <kbd className="bg-zinc-700 px-1 rounded">↵</kbd> to submit
            </span>
          ) : (
            <button
              onClick={() => {
                setInput(exercise.command_hint);
                setHintUsed(true);
                setHistCursor(-1);
                inputRef.current?.focus();
              }}
              className="text-xs text-zinc-500 hover:text-amber-400 transition-colors font-mono underline underline-offset-2"
            >
              show answer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
