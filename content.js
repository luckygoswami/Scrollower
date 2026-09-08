let animationId = null;
let scrolling = false;

function startScrolling(selector, speed) {
  const element = document.querySelector(selector);

  if (!element) {
    console.log('Auto Scroll: Element not found:', selector);
    return;
  }

  if (scrolling) {
    stopScrolling();
  }

  scrolling = true;

  let lastTime = performance.now();

  function scroll(timestamp) {
    if (!scrolling) {
      return;
    }

    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    element.scrollTop += speed * deltaTime;

    animationId = requestAnimationFrame(scroll);
  }

  animationId = requestAnimationFrame(scroll);

  console.log('Auto Scroll started:', element);
}

function stopScrolling() {
  scrolling = false;

  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  console.log('Auto Scroll stopped');
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
    startScrolling(message.selector, message.speed);
  }

  if (message.action === 'stop') {
    stopScrolling();
  }
});
