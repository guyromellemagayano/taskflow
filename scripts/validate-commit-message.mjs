#!/usr/bin/env node

import fs from "node:fs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

const filePath = process.argv[2];

if (!filePath) {
  fail("commit message validation failed: file path is missing");
}

const raw = fs.readFileSync(filePath, "utf8");
const lines = raw.replace(/\r\n/g, "\n").split("\n");
const filtered = [];

for (const line of lines) {
  if (line.startsWith("#")) {
    break;
  }

  filtered.push(line);
}

while (filtered.length && filtered.at(-1)?.trim() === "") {
  filtered.pop();
}

if (!filtered.length) {
  fail("commit message validation failed: empty commit message");
}

const subject = filtered[0];
const isMergeOrRevert =
  subject.startsWith("Merge ") || subject.startsWith("Revert ");

if (isMergeOrRevert) {
  process.exit(0);
}

if (!/^[a-z]+\([^()]+\):\s.+/u.test(subject)) {
  fail(
    "commit message validation failed: subject must be in the format type(scope): summary"
  );
}

if (subject.trim().endsWith(".")) {
  fail("commit message validation failed: subject must not end with a period");
}

if (filtered.length < 3) {
  fail(
    "commit message validation failed: commit body must include a blank line and bullet items"
  );
}

if ((filtered[1] ?? "").trim() !== "") {
  fail(
    "commit message validation failed: second line must be blank between subject and body"
  );
}

for (let index = 2; index < filtered.length; index += 1) {
  const line = filtered[index];

  if (line.trim() === "") {
    fail(
      "commit message validation failed: no empty lines are allowed inside commit body bullets"
    );
  }

  if (!/^-[ ].+$/u.test(line)) {
    fail(
      `commit message validation failed: body line ${index + 1} must start with '- '`
    );
  }

  if (line.length > 250) {
    fail(
      `commit message validation failed: body line ${index + 1} exceeds 250 characters`
    );
  }
}
