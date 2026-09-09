const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const status = document.getElementById('status');

// Start scrolling
startButton.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'start',
  });

  startButton.toggleAttribute('disabled');
  stopButton.toggleAttribute('disabled');

  status.textContent = 'Auto-scroll started.';
});

// Stop scrolling
stopButton.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'stop',
  });

  startButton.toggleAttribute('disabled');
  stopButton.toggleAttribute('disabled');

  status.textContent = 'Auto-scroll stopped.';
});
