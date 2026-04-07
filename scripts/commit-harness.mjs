#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

function parseArgs(argv) {
  const args = { casePath: 'harness/cases/commit-unit.json', gptPath: 'gpt.md' };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--range') args.range = argv[i + 1];
    if (token === '--max-count') args.maxCount = Number(argv[i + 1]);
    if (token === '--case') args.casePath = argv[i + 1];
    if (token === '--gpt') args.gptPath = argv[i + 1];
    if (token === '--json') args.json = true;
  }
  return args;
}

function readGitLog({ range, maxCount }) {
  const countOption = Number.isFinite(maxCount) && maxCount > 0 ? `--max-count=${maxCount}` : '';
  const rangeOrCount = range ? `${range}` : countOption;
  const command = `git log ${rangeOrCount} --numstat --format="__COMMIT__%n%H%n%s"`;
  return execSync(command, { encoding: 'utf8' });
}

function parseCommits(raw) {
  return raw
    .split('__COMMIT__\n')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n');
      const hash = lines[0];
      const subject = lines[1] ?? '';
      const entries = [];
      let insertions = 0;
      let deletions = 0;

      for (const line of lines.slice(2)) {
        const [insRaw, delRaw, file] = line.split('\t');
        if (!file) continue;
        const ins = Number.isNaN(Number(insRaw)) ? 0 : Number(insRaw);
        const del = Number.isNaN(Number(delRaw)) ? 0 : Number(delRaw);
        insertions += ins;
        deletions += del;
        entries.push({ file, insertions: ins, deletions: del });
      }

      return {
        hash,
        shortHash: hash.slice(0, 7),
        subject,
        files: entries.map((entry) => entry.file),
        entries,
        filesChanged: entries.length,
        insertions,
        deletions,
      };
    });
}

function analyzeCommit(commit, rules) {
  const reasons = [];
  const suggestions = [];
  const messageRegex = new RegExp(rules.messagePattern);
  const ignoredPaths = rules.ignoredPaths ?? [];
  const isIgnored = (file) =>
    ignoredPaths.some((path) => file === path || file.startsWith(`${path}/`));

  const scoredEntries = commit.entries.filter((entry) => !isIgnored(entry.file));
  const scoredFiles = scoredEntries.map((entry) => entry.file);
  const filesChanged = scoredEntries.length;
  const insertions = scoredEntries.reduce((sum, entry) => sum + entry.insertions, 0);
  const deletions = scoredEntries.reduce((sum, entry) => sum + entry.deletions, 0);
  const nonUiFiles = scoredFiles.filter(
    (file) => !rules.uiPathKeywords.some((keyword) => file.startsWith(keyword)),
  );

  if (!messageRegex.test(commit.subject)) {
    reasons.push('커밋 메시지가 `fix(ui) : 한국어 상세 설명` 형식을 만족하지 않습니다.');
    suggestions.push('메시지 형식을 통일하고 작업 목적을 10자 이상으로 구체화하세요.');
  }

  if (filesChanged > rules.maxFilesChanged) {
    reasons.push(`변경 파일 수가 ${rules.maxFilesChanged}개를 초과합니다 (${filesChanged}개).`);
    suggestions.push('화면별/컴포넌트별로 커밋을 분리하세요.');
  }

  if (insertions > rules.maxInsertions) {
    reasons.push(`추가 라인이 ${rules.maxInsertions}줄을 초과합니다 (${insertions}줄).`);
    suggestions.push('공통 스타일/개별 화면 리팩터링을 분리 커밋하세요.');
  }

  if (deletions > rules.maxDeletions) {
    reasons.push(`삭제 라인이 ${rules.maxDeletions}줄을 초과합니다 (${deletions}줄).`);
    suggestions.push('대규모 삭제는 단계적으로 나눠서 반영하세요.');
  }

  if (nonUiFiles.length > rules.maxNonUiFiles) {
    reasons.push(
      `UI 외 파일 비중이 높습니다 (${nonUiFiles.length}개): ${nonUiFiles.slice(0, 5).join(', ')}`,
    );
    suggestions.push('`fix(ui)` 커밋에는 UI 관련 파일 중심으로 포함하세요.');
  }

  return {
    ...commit,
    filesChanged,
    insertions,
    deletions,
    nonUiFiles,
    pass: reasons.length === 0,
    reasons,
    suggestions,
  };
}

function summarize(results) {
  const total = results.length;
  const passed = results.filter((item) => item.pass).length;
  const failed = total - passed;
  const rate = total === 0 ? 0 : Math.round((passed / total) * 100);

  const worst = [...results]
    .sort((a, b) => b.reasons.length - a.reasons.length)
    .slice(0, 2)
    .filter((item) => item.reasons.length > 0)
    .map((item) => `${item.shortHash} (${item.reasons.length}개 이슈)`);

  return { total, passed, failed, rate, worst };
}

function toMarkdown({ caseConfig, gptPrompt, scopeLabel, results, summary }) {
  const lines = [];
  lines.push('# Commit Harness Report');
  lines.push('');
  lines.push(`- Case: ${caseConfig.name}`);
  lines.push(`- Scope: ${scopeLabel}`);
  lines.push(`- Generated At: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Prompt Snapshot');
  lines.push('');
  lines.push('```md');
  lines.push(gptPrompt.trim());
  lines.push('```');
  lines.push('');
  lines.push('## Commit Results');
  lines.push('');

  if (results.length === 0) {
    lines.push('분석할 커밋이 없습니다.');
    lines.push('');
  }

  for (const item of results) {
    lines.push(`### ${item.pass ? 'PASS' : 'FAIL'} - ${item.shortHash} ${item.subject}`);
    lines.push('');
    lines.push(`- files: ${item.filesChanged}`);
    lines.push(`- +${item.insertions} / -${item.deletions}`);

    if (item.reasons.length > 0) {
      lines.push(`- 실패 사유: ${item.reasons.join(' | ')}`);
    }

    if (item.suggestions.length > 0) {
      lines.push(`- 분리 제안: ${item.suggestions.join(' | ')}`);
    }

    lines.push('');
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`- PASS 비율: ${summary.rate}% (${summary.passed}/${summary.total})`);
  lines.push(`- FAIL 개수: ${summary.failed}`);
  lines.push(`- 가장 큰 문제 커밋: ${summary.worst.length > 0 ? summary.worst.join(', ') : '없음'}`);
  lines.push('- 다음 액션 3개:');
  lines.push('  1. 메시지 형식 자동 검사(git hook) 추가');
  lines.push('  2. 화면 단위로 커밋 크기 제한(파일 수/라인 수) 적용');
  lines.push('  3. UI 변경과 비-UI 변경을 별도 커밋으로 분리');

  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv);
  const caseRaw = await fs.readFile(args.casePath, 'utf8');
  const caseConfig = JSON.parse(caseRaw);
  const gptPrompt = await fs.readFile(args.gptPath, 'utf8');
  const range = args.range ?? caseConfig.range;
  const maxCount = args.maxCount ?? caseConfig.maxCount ?? 10;

  const rawLog = readGitLog({ range, maxCount });
  const commits = parseCommits(rawLog);
  const results = commits.map((commit) => analyzeCommit(commit, caseConfig.rules));
  const summary = summarize(results);
  const scopeLabel = range ?? `최근 ${maxCount}개 커밋`;

  const output = { case: caseConfig.name, scope: scopeLabel, summary, results };

  if (args.json) {
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  } else {
    for (const item of results) {
      const status = item.pass ? 'PASS' : 'FAIL';
      process.stdout.write(`[${status}] ${item.shortHash} ${item.subject}\n`);
      if (!item.pass) {
        process.stdout.write(`  - ${item.reasons.join(' | ')}\n`);
      }
    }
    process.stdout.write(`\nPASS 비율: ${summary.rate}% (${summary.passed}/${summary.total})\n`);
  }

  const report = toMarkdown({ caseConfig, gptPrompt, scopeLabel, results, summary });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = path.join('harness/results', `${timestamp}-${caseConfig.name}.md`);
  await fs.writeFile(outPath, report, 'utf8');
  process.stdout.write(`Report: ${outPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
