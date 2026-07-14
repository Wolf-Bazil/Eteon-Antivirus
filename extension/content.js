(() => {
  const forward = (title, body) => {
    chrome.runtime.sendMessage({
      type: 'CAPTURE',
      payload: {
        id: `ext_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        app: 'WhatsApp Web',
        sender: title || 'Unknown',
        body: body || '',
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString(),
        source: 'extension'
      }
    });
  };

  const scan = () => {
    const chatTitle = document.querySelector('header[role="banner"] h1, header h1, [data-testid="conversation-header"]')?.textContent?.trim();
    const messages = Array.from(document.querySelectorAll('[data-testid="msg-container"], .message-in, .message-out')).map((n) => (n.textContent || '').trim()).filter(Boolean);
    if (chatTitle && messages.length) {
      forward(chatTitle, messages[messages.length - 1]);
    }
  };

  window.addEventListener('load', scan);
  document.addEventListener('click', scan, true);
  document.addEventListener('keyup', scan, true);
  setInterval(scan, 3000);
})();
