"use client";

import { useEffect, useState } from "react";
import OptionHintButton from "@/components/child/class/OptionHintButton";
import {
  lookupVocabDefinition,
  resolveVocabDefinition,
} from "@/lib/vocab-definitions";

type LadderWordDefinitionProps = {
  label: string;
  definition?: string;
  compact?: boolean;
};

/**
 * Always-visible definition control for intensity ladder words.
 * Uses curriculum/static defs first, then a public dictionary lookup.
 */
export default function LadderWordDefinition({
  label,
  definition,
  compact = false,
}: LadderWordDefinitionProps) {
  const seeded =
    definition?.trim() || lookupVocabDefinition(label) || "";
  const [text, setText] = useState(seeded);
  const [loading, setLoading] = useState(!seeded);

  useEffect(() => {
    const next = definition?.trim() || lookupVocabDefinition(label) || "";
    if (next) {
      setText(next);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void resolveVocabDefinition(label).then((resolved) => {
      if (cancelled) return;
      setText(resolved ?? "");
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [definition, label]);

  const hint =
    text.trim() ||
    (loading
      ? "Looking up the definition…"
      : `Think about what “${label}” means by itself.`);

  return (
    <OptionHintButton
      hint={hint}
      variant="definition"
      compact={compact}
      placement="above"
    />
  );
}
