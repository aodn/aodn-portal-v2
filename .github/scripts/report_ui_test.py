"""Surface pytest-html-plus shard results in the required ui_test check."""

import html
import json
import os
import uuid
from pathlib import Path


def error_annotation(message: str) -> None:
    # Test output is data, including any GitHub workflow command characters.
    escaped = message.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    print(f"::error::{escaped}")


def main() -> int:
    shard_result = os.environ["SHARD_RESULT"]
    summary = ["## Playwright results", f"Shard result: {shard_result}"]
    unsuccessful = shard_result != "success"

    for shard in (1, 2):
        label = f"Shard {shard}"
        report = Path(f"shard-reports/shard-results-{shard}/final_report.json")
        try:
            results = json.loads(report.read_text(encoding="utf-8"))["results"]
            if not isinstance(results, list) or not results:
                raise ValueError("report has no test results")
            counts: dict[str, int] = {}
            failures = []
            for test in results:
                status = test["status"]
                counts[status] = counts.get(status, 0) + 1
                if status in ("failed", "error"):
                    details = test.get("error") or (
                        "No error details recorded; see shard logs."
                    )
                    failures.append((test["nodeid"], details))
        except (OSError, ValueError, KeyError, TypeError) as error:
            message = (
                f"{label}: missing or unreadable test report ({error}). "
                "See shard logs for build, startup, collection or runner errors."
            )
            error_annotation(message)
            summary.append(f"### {label}\n\n{html.escape(message)}")
            unsuccessful = True
            continue

        counts_text = ", ".join(f"{count} {status}" for status, count in counts.items())
        print(f"{label}: {counts_text}")
        summary.append(f"### {label}\n\n{counts_text}")
        for name, details in failures:
            unsuccessful = True
            message = f"{label}: {name}\n{details}"
            error_annotation(message)
            # Keep multiline details readable in logs, without executing commands
            # embedded in assertion messages or test parameters.
            token = uuid.uuid4().hex
            print(f"::stop-commands::{token}")
            print(message)
            print(f"::{token}::")
            summary.append(f"<pre>{html.escape(message)}</pre>")

    if shard_result != "success":
        error_annotation(
            f"Shard result: {shard_result}. See the test failures above "
            "and shard logs for infrastructure errors."
        )

    summary.append(
        "Full HTML reports, videos and traces remain in the "
        "`test-report-1` and `test-report-2` artifacts."
    )
    summary_path = Path(os.environ["GITHUB_STEP_SUMMARY"])
    with summary_path.open("a", encoding="utf-8") as output:
        output.write("\n\n".join(summary) + "\n")
    return int(unsuccessful)


if __name__ == "__main__":
    raise SystemExit(main())
