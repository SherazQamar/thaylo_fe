/**
 * Kid-friendly dictionary meanings for intensity / word-ladder vocabulary.
 * Definitions describe the word itself — not where it sits on a ladder.
 */

const VOCAB_DEFINITIONS: Record<string, string> = {
  // Temperature / heat
  lukewarm: "Only slightly warm; not hot and not cold.",
  warm: "Having a comfortable amount of heat.",
  hot: "Having a high temperature; very warm.",
  boiling: "So hot that a liquid bubbles and turns to steam.",

  // Fear
  uneasy: "A little worried or uncomfortable.",
  scared: "Feeling fear; afraid.",
  terrified: "Extremely frightened.",
  petrified: "So scared that you feel frozen and unable to move.",

  // Speed / movement
  walking: "Moving on foot at a normal, steady pace.",
  jogging: "Running at a steady, easy pace.",
  running: "Moving quickly on foot.",
  sprinting: "Running as fast as possible for a short distance.",

  // Happiness
  glad: "Feeling pleased or mildly happy.",
  happy: "Feeling joy or pleasure.",
  thrilled: "Very excited and delighted.",
  ecstatic: "Overwhelmingly happy; full of extreme joy.",

  // Size
  large: "Bigger than usual.",
  huge: "Very large in size.",
  enormous: "Extremely large.",
  gargantuan: "Gigantic; far larger than normal.",

  // Dislike
  dislike: "To not enjoy or not like something.",
  "can't stand": "To strongly dislike something; find it hard to put up with.",
  "cant stand": "To strongly dislike something; find it hard to put up with.",
  hate: "To feel strong dislike toward someone or something.",
  loathe: "To feel intense disgust or hatred.",
  detest: "To dislike something very strongly.",

  // Sound / quietness
  quiet: "Making little or no noise.",
  silent: "Making no sound at all.",
  muted: "Softened or quieted; not sharp or loud.",
  hushed: "Very quiet, as if people are speaking softly.",
  faint: "Very quiet or hard to notice.",
  soft: "Gentle and quiet; not loud.",
  loud: "Making a strong, easy-to-hear sound.",
  deafening: "So loud it almost hurts the ears.",
  overpowering: "So strong it overwhelms the senses.",
  strong: "Having a lot of force, power, or intensity.",

  // Light
  shiny: "Reflecting light with a smooth, bright surface.",
  bright: "Giving off a lot of light.",
  brilliant: "Extremely bright or dazzling.",
  dazzling: "So bright it almost blinds you.",

  // Hunger
  peckish: "A little hungry; ready for a small snack.",
  hungry: "Wanting or needing food.",
  ravenous: "Extremely hungry.",

  // Damage
  scratched: "Marked with a thin cut on the surface.",
  cracked: "Split or broken without falling completely apart.",
  shattered: "Broken into many pieces.",

  // Certainty
  possibly: "It could happen, but it is not sure.",
  probably: "More likely than not; a good chance it will happen.",
  definitely: "Without any doubt; for certain.",

  // Weather / rain / wind
  drizzle: "Very light rain in fine drops.",
  shower: "A short period of rain.",
  downpour: "A heavy, sudden fall of rain.",
  breeze: "A gentle wind.",
  "strong wind": "Wind with a lot of force.",
  gale: "A very strong wind.",
  "hurricane-force wind": "Wind as powerful as a hurricane; extremely destructive.",

  // Odor / difficulty / crowding / approval
  effortless: "Done with almost no difficulty.",
  challenging: "Difficult in a way that requires real effort.",
  impossible: "Not able to be done under the given conditions.",
  sparse: "Scattered thinly; only a few in a space.",
  crowded: "Filled with many people or things.",
  packed: "So full there is almost no space left.",
  adequate: "Good enough; sufficient.",
  excellent: "Extremely good.",
  outstanding: "Exceptionally good; stands out from others.",
  helpful: "Useful; providing a benefit.",
  important: "Deserving serious attention or care.",
  essential: "Absolutely necessary; cannot be left out.",

  // Force actions
  tapped: "Touched lightly, often with a finger.",
  knocked: "Hit with a firm, short blow.",
  pounded: "Hit repeatedly with heavy force.",
  slammed: "Shut or hit with sudden, violent force.",

  // Moisture / age / fame / geography / resistance / amount / frequency
  damp: "Slightly wet.",
  wet: "Covered or soaked with liquid.",
  soaked: "Completely wet all the way through.",
  saturated: "Holding as much liquid as possible.",
  recent: "Having happened not long ago.",
  old: "Having existed for a long time.",
  ancient: "Very old; from a distant time in history.",
  prehistoric: "From the time before written history.",
  known: "Recognized by some people.",
  "well-known": "Familiar to many people.",
  famous: "Known by a great many people.",
  legendary: "Famous for a very long time; remembered across generations.",
  local: "Related to one nearby place or community.",
  regional: "Related to a larger area within a country.",
  national: "Related to an entire country.",
  global: "Related to the whole world.",
  hesitant: "Slow or unsure about acting.",
  reluctant: "Unwilling or not eager to do something.",
  resistant: "Pushing back against something; opposing it.",
  defiant: "Openly refusing to obey or give in.",
  trace: "A tiny amount that is barely detectable.",
  drop: "A small, distinct amount of liquid.",
  puddle: "A small pool of liquid on a surface.",
  flood: "A large overflow of water covering land.",
  sometimes: "On some occasions; not always.",
  often: "Many times; frequently.",

  // Precision / motion words from later lessons
  strolled: "Walked in a slow, relaxed way.",
  trudged: "Walked slowly with heavy, tired steps.",
  sprinted: "Ran at top speed for a short distance.",

  // Animal / energy emotions (personalized ladders)
  relaxed: "Calm and at ease; not tense.",
  playful: "Full of fun; ready to play.",
  excited: "Feeling eager, lively, or stirred up.",
  wild: "Uncontrolled or free in a strong, energetic way.",
  calm: "Peaceful and quiet; not upset.",
  fierce: "Very strong, intense, or aggressive.",
  gentle: "Kind, soft, or careful; not rough.",
  restless: "Unable to stay still or settle down.",
  energetic: "Full of energy and ready to move.",
  timid: "Shy or easily frightened.",
  bold: "Brave and confident; willing to take a risk.",
};

const remoteDefinitionCache = new Map<string, string>();
const remoteDefinitionInflight = new Map<string, Promise<string | undefined>>();

export function normalizeVocabKey(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
}

/** Look up a dictionary definition for a ladder / vocab word. */
export function lookupVocabDefinition(word: string): string | undefined {
  const key = normalizeVocabKey(word);
  if (!key) return undefined;
  if (VOCAB_DEFINITIONS[key]) return VOCAB_DEFINITIONS[key];
  // Common contraction variants
  if (key.includes("can't stand") || key.includes("cant stand")) {
    return VOCAB_DEFINITIONS["can't stand"];
  }
  return undefined;
}

/**
 * Resolve a definition: static curriculum map first, then Free Dictionary API.
 * Never invents relative-strength wording.
 */
export async function resolveVocabDefinition(
  word: string,
): Promise<string | undefined> {
  const local = lookupVocabDefinition(word);
  if (local) return local;

  const key = normalizeVocabKey(word);
  if (!key || key.includes(" ")) {
    // Multi-word labels are usually curriculum-specific; skip remote lookup.
    return undefined;
  }

  const cached = remoteDefinitionCache.get(key);
  if (cached) return cached;

  const inflight = remoteDefinitionInflight.get(key);
  if (inflight) return inflight;

  const request = (async () => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`,
      );
      if (!response.ok) return undefined;
      const payload = (await response.json()) as Array<{
        meanings?: Array<{
          definitions?: Array<{ definition?: string }>;
        }>;
      }>;
      const definition = payload
        ?.flatMap((entry) => entry.meanings ?? [])
        .flatMap((meaning) => meaning.definitions ?? [])
        .map((item) => item.definition?.trim())
        .find((item) => Boolean(item));
      if (!definition) return undefined;
      // Keep it short for the board tooltip.
      const short =
        definition.length > 160
          ? `${definition.slice(0, 157).trim()}…`
          : definition;
      remoteDefinitionCache.set(key, short);
      return short;
    } catch {
      return undefined;
    } finally {
      remoteDefinitionInflight.delete(key);
    }
  })();

  remoteDefinitionInflight.set(key, request);
  return request;
}

export function withVocabDefinition<T extends { label: string; definition?: string }>(
  option: T,
): T & { definition?: string } {
  const existing = option.definition?.trim();
  if (existing) return { ...option, definition: existing };
  const lookedUp = lookupVocabDefinition(option.label);
  return lookedUp ? { ...option, definition: lookedUp } : option;
}
