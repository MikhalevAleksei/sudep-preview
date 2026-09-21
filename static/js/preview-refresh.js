// Check the deployment version on entry and when restoring a cached page.
(() => {
  const script = document.currentScript;
  const current = script.dataset.previewVersion;
  const base = script.dataset.previewBase;
  let checking = false;
  async function checkVersion() {
    if (checking) return;
    checking = true;
    try {
      const response = await fetch(`${base}/build-version.json?t=${Date.now()}`, {
        cache: 'no-store', credentials: 'omit',
      });
      if (!response.ok) return;
      const {version} = await response.json();
      if (!/^[a-f0-9]{16}$/.test(version) || version === current) return;
      const next = new URL(location.href);
      // One navigation per version even while a CDN deployment is propagating.
      if (next.searchParams.get('_v') === version) return;
      next.searchParams.set('_v', version);
      location.replace(next.href);
    } catch (_) {
      // An offline or failed check must leave the existing page usable.
    } finally {
      checking = false;
    }
  }
  checkVersion();
  window.addEventListener('pageshow', event => {
    if (event.persisted) checkVersion();
  });
})();
