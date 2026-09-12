import { normalizeInstructorFeedbackTone } from './instructor-feedback-tone';

describe('normalizeInstructorFeedbackTone', () => {
  it('softens explosive praise openers', () => {
    expect(
      normalizeInstructorFeedbackTone(
        "Boom! Perfect! Uneasy is a weird stomach feeling, but petrified means so scared you can't move.",
      ),
    ).toBe(
      "Perfect. Uneasy is a weird stomach feeling, but petrified means so scared you can't move.",
    );
  });

  it('rewrites YOU DID IT openers to even praise', () => {
    expect(
      normalizeInstructorFeedbackTone(
        "YOU DID IT! You built the complete Word Ladder perfectly.",
      ),
    ).toBe('Nice work. You built the complete Word Ladder perfectly.');
  });
});
