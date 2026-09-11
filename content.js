let scrollTimer;

function startScrolling() {
  const element = document.getElementById('scrollBox');

  if (!element) {
    console.log('Auto Scroll: Element not found:', selector);
    return;
  }

  scrollTimer = setInterval(() => {
    element.scrollTop += 50;
  }, 1000);

  console.log('Auto Scroll started:', element);
}

function stopScrolling() {
  if (scrollTimer !== null) {
    clearTimeout(scrollTimer);
    scrollTimer = null;
  }

  console.log('Auto Scroll stopped');
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
    startScrolling();
  }

  if (message.action === 'stop') {
    stopScrolling();
  }
});
