let scrolling = false;
let followCount = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const refetchUsers = (parentContainer) => {
  const lastUser = parentContainer.lastChild;
  const firstUser = parentContainer.firstChild;
  lastUser.scrollIntoView(true);
  firstUser.scrollTop = 0;
};

async function startScrolling(followLimit) {
  const usersContainer = document.querySelector('div.x1qnrgzn').parentElement;

  console.log('follow limit', followLimit, followCount);
  // Prevent multiple scrolling loops
  if (scrolling) {
    console.log('Auto Scroll: Already running');
    return;
  }

  if (usersContainer.childElementCount < 1) {
    console.log('Auto Scroll: Scrollable Users not found');
    return;
  }

  scrolling = true;

  console.log('Auto Scroll started:', usersContainer);

  refetchUsers(usersContainer);

  while (scrolling && followCount <= followLimit) {
    if (usersContainer.childElementCount < 12) {
      console.log('Auto Scroll: No user found, scrolling to bottom');
      refetchUsers(usersContainer);

      usersContainer.style.setProperty('padding-bottom', '0px', 'important');

      await sleep(3000);
      continue;
    }

    const user = document.querySelector('div.x1qnrgzn');
    const followButton = user.querySelector('button');

    if (followButton?.firstChild?.firstChild?.textContent === 'Follow') {
      followButton.click();
    }

    // Remove the user from the page
    user.remove();
    followCount++;
    usersContainer.style.setProperty('padding-bottom', '0px', 'important');

    // Wait 500ms before processing the next user
    await sleep(500);
  }

  console.log('Auto Scroll stopped');
}

function stopScrolling() {
  scrolling = false;
  console.log('Auto Scroll: Stop requested');
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
    startScrolling(message.followLimit);
  }

  if (message.action === 'stop') {
    stopScrolling();
  }
});
