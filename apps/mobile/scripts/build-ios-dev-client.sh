#!/usr/bin/env bash

set -euo pipefail

# Ensure we cleanup any temporary directories we create
cleanup() {
  if [[ -n "${TEMP_DIR:-}" && -d "$TEMP_DIR" ]]; then
    rm -rf "$TEMP_DIR"
  fi
  if [[ -n "${BUILD_LOG:-}" && -f "$BUILD_LOG" ]]; then
    rm -f "$BUILD_LOG"
  fi
}
trap cleanup EXIT

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 Building iOS simulator dev client (Expo dev-client)..."

EAS_PROFILE="${EAS_PROFILE:-preview}"

TEMP_DIR="$(mktemp -d)"
BUILD_LOG="$(mktemp)"

echo "📦 Running EAS build (profile: $EAS_PROFILE)"
export EXPO_NO_PROMPT=1
if ! eas build --profile "$EAS_PROFILE" --platform ios --local --non-interactive | tee "$BUILD_LOG"; then
  echo "❌ EAS build failed. See log at $BUILD_LOG" >&2
  exit 1
fi

ARTIFACT_PATH=$(grep -Eo '/[^[:space:]]+\.(ipa|tar\.gz)' "$BUILD_LOG" | tail -n1 || true)

if [[ -z "$ARTIFACT_PATH" ]]; then
  echo "❌ Unable to find artifact path in build log." >&2
  exit 1
fi

if [[ ! -f "$ARTIFACT_PATH" ]]; then
  echo "❌ Artifact file not found at $ARTIFACT_PATH" >&2
  exit 1
fi

if [[ "$ARTIFACT_PATH" == *.tar.gz ]]; then
  tar -xzf "$ARTIFACT_PATH" -C "$TEMP_DIR"
  APP_PATH="$(find "$TEMP_DIR" -maxdepth 2 -name '*.app' -print -quit)"
else
  echo "⚠️  Artifact is not a .tar.gz (path: $ARTIFACT_PATH). Skipping automatic install." >&2
  exit 1
fi
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
