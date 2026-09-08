const selectorInput = document.getElementById('selector');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const status = document.getElementById('status');

// Show speed value
speedInput.addEventListener('input', () => {
  speedValue.textContent = speedInput.value;
});

// Start scrolling
startButton.addEventListener('click', async () => {
  const selector = selectorInput.value.trim();
  const speed = Number(speedInput.value);

  if (!selector) {
    status.textContent = 'Enter a CSS selector.';
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'start',
    selector: selector,
    speed: speed,
  });

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

  status.textContent = 'Auto-scroll stopped.';
});
