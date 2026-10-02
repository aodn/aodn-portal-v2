"""Exercise the aggregate check without running browsers or Docker."""

import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'report_ui_test.py'


def result(name: str, status: str = 'passed', error: str = '') -> dict:
    return {'nodeid': name, 'status': status, 'error': error}


class ReportUiTestTest(unittest.TestCase):
    def run_report(self, reports: list, status: str) -> tuple:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for shard, tests in enumerate(reports, start=1):
                if tests is None:
                    continue
                path = root / f'shard-reports/shard-results-{shard}'
                path.mkdir(parents=True)
                report = (
                    tests
                    if isinstance(tests, str)
                    else json.dumps({'results': tests})
                )
                (path / 'final_report.json').write_text(
                    report, encoding='utf-8'
                )
            summary = root / 'summary.md'
            process = subprocess.run(
                ['python3', str(SCRIPT)],
                cwd=root,
                env={
                    **os.environ,
                    'SHARD_RESULT': status,
                    'GITHUB_STEP_SUMMARY': str(summary),
                },
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertEqual(process.stderr, '')
            return process.returncode, process.stdout, summary.read_text()

    def test_both_pass(self) -> None:
        code, logs, summary = self.run_report(
            [
                [result('test_one')],
                [result('test_two'), result('skip', 'skipped')],
            ],
            'success',
        )
        self.assertEqual(code, 0)
        self.assertNotIn('::error::', logs)
        self.assertIn('1 passed, 1 skipped', summary)

    def test_one_or_both_fail(self) -> None:
        for first_status in ('passed', 'failed'):
            with self.subTest(first_status=first_status):
                code, logs, summary = self.run_report(
                    [
                        [result('test_one', first_status, 'first assertion')],
                        [
                            result(
                                'test_two[mobile]',
                                'failed',
                                'AssertionError\nCall log: locator timeout',
                            )
                        ],
                    ],
                    'failure',
                )
                self.assertEqual(code, 1)
                for output in (logs, summary):
                    self.assertIn('Shard 2: test_two[mobile]', output)
                    self.assertIn('Call log: locator timeout', output)
                    if first_status == 'failed':
                        self.assertIn('Shard 1: test_one', output)
                        self.assertIn('first assertion', output)

    def test_setup_or_teardown_error(self) -> None:
        code, logs, _ = self.run_report(
            [
                [result('test_fixture', 'error', 'fixture failed')],
                [result('test_two')],
            ],
            'failure',
        )
        self.assertEqual(code, 1)
        self.assertIn('fixture failed', logs)

    def test_missing_malformed_or_empty_report_keeps_other_failures(
        self,
    ) -> None:
        for report in (None, '{broken', [], [{}]):
            with self.subTest(report=report):
                code, logs, summary = self.run_report(
                    [
                        report,
                        [result('test_two', 'failed', 'second assertion')],
                    ],
                    'failure',
                )
                self.assertEqual(code, 1)
                self.assertIn('Shard 1: missing or unreadable', logs)
                self.assertIn('second assertion', summary)

    def test_shard_status_cannot_be_overridden_by_passing_reports(self) -> None:
        for status in ('failure', 'cancelled', 'skipped'):
            with self.subTest(status=status):
                code, _, _ = self.run_report(
                    [[result('test_one')], [result('test_two')]],
                    status,
                )
                self.assertEqual(code, 1)

    def test_failures_or_missing_reports_cannot_pass(self) -> None:
        for report in (None, [result('test_one', 'failed', 'assertion')]):
            with self.subTest(report=report):
                code, _, _ = self.run_report(
                    [report, [result('test_two')]],
                    'success',
                )
                self.assertEqual(code, 1)

    def test_output_is_escaped(self) -> None:
        code, logs, summary = self.run_report(
            [
                [
                    result(
                        'test_<name>',
                        'failed',
                        '100%\r\n::warning::injected\n<script>',
                    )
                ],
                [result('test_two')],
            ],
            'failure',
        )
        self.assertEqual(code, 1)
        self.assertIn('100%25%0D%0A::warning::injected', logs)
        self.assertIn('::stop-commands::', logs)
        self.assertIn('&lt;script&gt;', summary)
        self.assertIn('test_&lt;name&gt;', summary)


if __name__ == '__main__':
    unittest.main()
