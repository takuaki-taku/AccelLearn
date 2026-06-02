#!/bin/bash
# git commit 前に staged な TS/TSX ファイル内の console.log を警告する。
# exit 0 でブロックしない（警告のみ）。

INPUT=$(cat)

COMMAND=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except Exception:
    pass
" 2>/dev/null)

if ! echo "$COMMAND" | grep -qE "^git commit"; then
    exit 0
fi

STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || true)
if [ -z "$STAGED_FILES" ]; then
    exit 0
fi

HAS_WARNINGS=false

while IFS= read -r file; do
    [ -z "$file" ] && continue
    if [[ "$file" =~ \.(ts|tsx)$ ]]; then
        MATCHES=$(git show ":$file" 2>/dev/null | grep -nE "console\.(log|debug|warn)\(" || true)
        if [ -n "$MATCHES" ]; then
            echo "⚠️  $file: console.log / console.debug / console.warn が含まれています" >&2
            echo "$MATCHES" | head -5 | sed 's/^/   /' >&2
            HAS_WARNINGS=true
        fi
    fi
done <<< "$STAGED_FILES"

if [ "$HAS_WARNINGS" = true ]; then
    echo "" >&2
    echo "デバッグコードが検出されました。意図的な場合はそのままコミットを承認してください。" >&2
fi

exit 0
