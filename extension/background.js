console.log('[ScamReportCapture] background ready');

const forwardToPipeline = async (payload) => {
  try {
    await fetch('http://localhost:5173/api/notifications/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('[ScamReportCapture] forward failed', err);
  }
};

self.addEventListener('message', (event) => {
  if (event.data?.type === 'CAPTURE') {
    forwardToPipeline(event.data.payload);
  }
});

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'http://localhost:5173/notifications' });
});
