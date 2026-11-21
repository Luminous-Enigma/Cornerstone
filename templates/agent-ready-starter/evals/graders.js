// Graders written in code: they decide pass or fail from what the agent actually did.
// A run record is { toolCalls: [{ tool, arguments, result }], answer: "final text" }.

const norm = (v) => (typeof v === "string" && /^#?[0-9a-f]{3,6}$/i.test(v) ? hex6(v) : v);
function hex6(v) {
  const h = v.replace("#", "");
  return "#" + (h.length === 3 ? [...h].map((c) => c + c).join("") : h).toUpperCase();
}

/** Returns a list of reasons the run failed; an empty list means it passed. */
export function grade(task, run) {
  const reasons = [];
  // Rule: check the input is real before judging it.
  if (!run || !Array.isArray(run.toolCalls) || typeof run.answer !== "string" || run.answer.trim() === "") {
    return ["the run record is empty or incomplete, so it can't be judged"];
  }
  for (const want of task.grade.mustCall ?? []) {
    const hit = run.toolCalls.some(
      (c) => c.tool === want.tool && Object.entries(want.arguments).every(([k, v]) => norm(c.arguments?.[k]) === norm(v)),
    );
    if (!hit) reasons.push(`never called ${want.tool} with ${JSON.stringify(want.arguments)}`);
  }
  const text = run.answer.toLowerCase();
  if (task.grade.answerMustMatch && !new RegExp(task.grade.answerMustMatch, "i").test(text)) {
    reasons.push(`answer doesn't say what it must (${task.grade.answerMustMatch})`);
  }
  if (task.grade.answerMustNotMatch && new RegExp(task.grade.answerMustNotMatch, "i").test(text)) {
    reasons.push(`answer says what it must not (${task.grade.answerMustNotMatch})`);
  }
  for (const m of task.grade.answerMustMention ?? []) {
    if (!text.includes(m.toLowerCase())) reasons.push(`answer doesn't mention ${m}`);
  }
  return reasons;
}
