window.UnderstoryAPI = {
  async request(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'same-origin',
      headers
    });
    const payload = response.status === 204 ? null : await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(payload?.error || 'The request could not be completed.');
      error.status = response.status;
      throw error;
    }

    return payload;
  }
};
