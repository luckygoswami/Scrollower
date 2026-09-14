const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const status = document.getElementById('status');
const followLimit = document.getElementById('followLimit');
const followLimitValue = document.getElementById('followLimitValue');

// Show follow limit value dynamically
followLimit.addEventListener('input', () => {
  followLimitValue.textContent = followLimit.value;
});

// Start scrolling
startButton.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'start',
    followLimit: followLimit.value,
  });

  startButton.toggleAttribute('disabled');

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

  status.textContent = 'Auto-scroll stopped.';
});
