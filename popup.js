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

// Show follow limit & delay values dynamically
followLimit.addEventListener('input', () => {
  followLimitValue.textContent = followLimit.value;
});

followDelay.addEventListener('input', () => {
  followDelayValue.textContent = followDelay.value + 's';
});

// Show unfollow limit & delay values dynamically
unfollowLimit.addEventListener('input', () => {
  unfollowLimitValue.textContent = unfollowLimit.value;
});

unfollowDelay.addEventListener('input', () => {
  unfollowDelayValue.textContent = unfollowDelay.value + 's';
});

// Start follow script
followBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    action: 'startFollowing',
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
    action: 'stopScript',
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
    action: 'startUnfollowing',
    unfollowLimit: unfollowLimit.value,
    unfollowDelay: unfollowDelay.value * 1000,
  });

  unfollowBtn.toggleAttribute('disabled');

  status.textContent = 'Unfollow script started.';
});
