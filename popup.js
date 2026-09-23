const followBtn = document.getElementById('start-follow');
const followLimit = document.getElementById('follow-limit');
const followLimitValue = document.getElementById('follow-limit-value');
const followDelay = document.getElementById('follow-delay');
const followDelayValue = document.getElementById('follow-delay-value');
const unfollowBtn = document.getElementById('start-unfollow');
const unfollowLimit = document.getElementById('unfollow-limit');
const unfollowLimitValue = document.getElementById('unfollow-limit-value');
const unfollowDelay = document.getElementById('unfollow-delay');
const unfollowDelayValue = document.getElementById('unfollow-delay-value');
const stopButton = document.getElementById('stop');
const status = document.getElementById('status');
const followAction = document.querySelector('[data-action="follow"]');
const unfollowAction = document.querySelector('[data-action="unfollow"]');
const followPanel = document.getElementById('follow-panel');
const unfollowPanel = document.getElementById('unfollow-panel');
const followProgress = document.getElementById('follow-progress');
const unfollowProgress = document.getElementById('unfollow-progress');

// Show follow limit & delay values dynamically
followLimit.addEventListener('input', () => {
  followLimitValue.textContent = followLimit.value;
  followProgress.textContent = `0 / ${followLimit.value}`;
});

followDelay.addEventListener('input', () => {
  followDelayValue.textContent = followDelay.value + 's';
});

// Show unfollow limit & delay values dynamically
unfollowLimit.addEventListener('input', () => {
  unfollowLimitValue.textContent = unfollowLimit.value;
  unfollowProgress.textContent = `0 / ${unfollowLimit.value}`;
});

unfollowDelay.addEventListener('input', () => {
  unfollowDelayValue.textContent = unfollowDelay.value + 's';
});

// toggle follow-unfollow tabs
followAction.addEventListener('click', () => {
  followAction.classList.add('active');
  unfollowAction.classList.remove('active');

  followPanel.classList.remove('hidden');
  unfollowPanel.classList.add('hidden');
});

unfollowAction.addEventListener('click', () => {
  unfollowAction.classList.add('active');
  followAction.classList.remove('active');

  unfollowPanel.classList.remove('hidden');
  followPanel.classList.add('hidden');
});

// Start follow script
followBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'follow',
    followLimit: followLimit.value,
    followDelay: followDelay.value * 1000,
  });

  followBtn.toggleAttribute('disabled');

  status.textContent = 'Follow script started.';
});

// Stop script
stopButton.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'stop',
  });

  status.textContent = 'Script stopped.';
});

// Start unfollow script
unfollowBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'unfollow',
    unfollowLimit: unfollowLimit.value,
    unfollowDelay: unfollowDelay.value * 1000,
  });

  unfollowBtn.toggleAttribute('disabled');

  status.textContent = 'Unfollow script started.';
});

function updateProgress(action, completed, limit) {
  const progressText = document.getElementById(`${action}-progress`);
  const progressBar = document.getElementById(`${action}-progress-bar`);

  if (!progressText || !progressBar) return;

  progressText.textContent = `${completed} / ${limit}`;

  const percentage = (completed / limit) * 100;
  progressBar.style.width = `${percentage}%`;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== 'progress') return;

  const { action, completed, limit } = message;
  updateProgress(action, completed, limit);
});
