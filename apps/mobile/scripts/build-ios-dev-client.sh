#!/usr/bin/env bash

set -euo pipefail

# Ensure we cleanup any temporary directories we create
cleanup() {
  if [[ -n "${TEMP_DIR:-}" && -d "$TEMP_DIR" ]]; then
    rm -rf "$TEMP_DIR"
  fi
}
trap cleanup EXIT

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 Building iOS simulator dev client (Expo dev-client)..."

BUILD_JSON=$(eas build --profile development-simulator --platform ios --local --json)

ARTIFACT_PATH=$(node - <<'EOF'
const data = JSON.parse(process.argv[1]);
if (!Array.isArray(data) || !data.length) {
  console.error('Unable to parse EAS build JSON output.');
  process.exit(1);
}
const artifactUri = data[0]?.artifacts?.buildUrl || data[0]?.artifacts?.artifactUrl;
if (!artifactUri) {
  console.error('Artifact path missing from EAS build output.');
  process.exit(1);
}
console.log(artifactUri);
EOF
"$BUILD_JSON")

if [[ -z "$ARTIFACT_PATH" ]]; then
  echo "❌ Failed to determine artifact path from EAS output." >&2
  exit 1
fi

if [[ ! -f "$ARTIFACT_PATH" ]]; then
  echo "❌ Artifact file not found at $ARTIFACT_PATH" >&2
  exit 1
fi

echo "📦 Artifact created at $ARTIFACT_PATH"

TEMP_DIR="$(mktemp -d)"
tar -xzf "$ARTIFACT_PATH" -C "$TEMP_DIR"

APP_PATH="$(find "$TEMP_DIR" -maxdepth 2 -name '*.app' -print -quit)"
if [[ -z "$APP_PATH" ]]; then
  echo "❌ Unable to locate .app bundle inside extracted artifact." >&2
  exit 1
fi

echo "📲 Installing $APP_PATH to booted simulator..."
xcrun simctl install booted "$APP_PATH"

BUNDLE_ID=$(defaults read "$APP_PATH/Info" CFBundleIdentifier 2>/dev/null || true)
if [[ -z "$BUNDLE_ID" ]]; then
  echo "⚠️  Could not determine bundle identifier; skipping auto-launch."
else
  echo "▶️  Launching $BUNDLE_ID on simulator..."
  set +e
  xcrun simctl launch booted "$BUNDLE_ID"
  LAUNCH_STATUS=$?
  set -e
  if [[ $LAUNCH_STATUS -ne 0 ]]; then
    echo "⚠️  Launch command exited with status $LAUNCH_STATUS. The dev client may require manual launch."
  fi
fi

echo "✅ iOS simulator dev client installed. Next, run 'pnpm dev:ios' to attach the Metro server."
