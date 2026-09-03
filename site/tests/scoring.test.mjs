import assert from "node:assert/strict";
import test from "node:test";
import {
  dimensionIds,
  rankBirds,
  scoreAnswers,
} from "../app/lib/quiz.ts";

const question = {
  id: "Q",
  statement: "Test",
  agreeLabel: "同意",
  disagreeLabel: "不同意",
  scene: "test",
  focus: "test",
  vector: Object.fromEntries(dimensionIds.map((id) => [id, 1])),
};

test("seven-point answers normalize each dimension to 0–100", () => {
  assert.deepEqual(
    scoreAnswers([question], [3]),
    Object.fromEntries(dimensionIds.map((id) => [id, 100])),
  );
  assert.deepEqual(
    scoreAnswers([question], [0]),
    Object.fromEntries(dimensionIds.map((id) => [id, 50])),
  );
  assert.deepEqual(
    scoreAnswers([question], [-3]),
    Object.fromEntries(dimensionIds.map((id) => [id, 0])),
  );
});

test("ranking is deterministic and uses priority only for exact ties", () => {
  const target = Object.fromEntries(dimensionIds.map((id) => [id, 50]));
  const birds = [
    { id: "B", priority: 2, target },
    { id: "A", priority: 1, target },
  ];

  const first = rankBirds(birds, target);
  const second = rankBirds(birds, target);
  assert.deepEqual(first, second);
  assert.equal(first[0].bird.id, "A");
  assert.equal(first[0].match, 100);
});
