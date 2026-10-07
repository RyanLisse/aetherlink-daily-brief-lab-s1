import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { BriefSchema, type Brief } from "../src/brief.js";

const sample = JSON.parse(
  readFileSync(new URL("../sample/brief.sample.json", import.meta.url), "utf8"),
) as unknown;

const valid = (): Brief => BriefSchema.parse(sample);

test("the sample brief satisfies the contract", () => {
  const brief = valid();
  assert.equal(brief.push.title, "Turn the deploy runbook into a go/no-go call");
  assert.equal(brief.todos.length, 2);
  assert.deepEqual(brief.day, []);
});

test("a brief without a push item is rejected", () => {
  const { push: _push, ...rest } = valid();
  assert.equal(BriefSchema.safeParse(rest).success, false);
});

test("a title longer than nine words is rejected", () => {
  const brief = valid();
  brief.push.title = "One two three four five six seven eight nine ten";
  assert.equal(BriefSchema.safeParse(brief).success, false);
});

test("a body may not carry a bullet list", () => {
  const brief = valid();
  brief.push.body = "First point.\n- second point\n- third point";
  assert.equal(BriefSchema.safeParse(brief).success, false);
});

test("more than three to-dos is rejected", () => {
  const brief = valid();
  const todo = brief.todos[0]!;
  brief.todos = [todo, todo, todo, todo];
  assert.equal(BriefSchema.safeParse(brief).success, false);
});

test("empty sections are allowed, notes default to none", () => {
  const brief = valid();
  const { notes: _notes, ...withoutNotes } = { ...brief, todos: [], updates: [], day: [] };
  const parsed = BriefSchema.parse(withoutNotes);
  assert.deepEqual(parsed.notes, []);
  assert.deepEqual(parsed.todos, []);
});

test("language is en or nl, nothing else", () => {
  const brief = valid();
  assert.equal(BriefSchema.safeParse({ ...brief, language: "nl" }).success, true);
  assert.equal(BriefSchema.safeParse({ ...brief, language: "de" }).success, false);
});

test("a painting must be public domain", () => {
  const brief = valid();
  assert.equal(
    BriefSchema.safeParse({ ...brief, painting: { ...brief.painting, publicDomain: false } }).success,
    false,
  );
});
