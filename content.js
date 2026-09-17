let scriptRunning = false;
const whiteList = ['cristiano'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForElement = (selector, timeout = 30000) =>
  new Promise((resolve, reject) => {
    const existingElement = document.querySelector(selector);
    if (existingElement) {
      resolve(existingElement);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        // clearTimeout(timeoutId);
        resolve(element);
      }
    });

    // const timeoutId = setTimeout(() => {
    //   observer.disconnect();
    //   reject(new Error(`Timed out waiting for ${selector}`));
    // }, timeout);

    observer.observe(document.body, { childList: true, subtree: true });
  });

const waitForElementToDisappear = (selector, timeout = 30000) =>
  new Promise((resolve, reject) => {
    if (!document.querySelector(selector)) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (!document.querySelector(selector)) {
        observer.disconnect();
        // clearTimeout(timeoutId);
        resolve();
      }
    });

    // const timeoutId = setTimeout(() => {
    //   observer.disconnect();
    //   reject(new Error(`Timed out waiting for ${selector} to disappear`));
    // }, timeout);

    observer.observe(document.body, { childList: true, subtree: true });
  });

const refetchByScroll = (parentContainer) => {
  const lastUser = parentContainer.lastChild;
  const firstUser = parentContainer.firstChild;
  lastUser.scrollIntoView(true);
  firstUser.scrollTop = 0;
};

async function startFollow(followLimit = 100, delay = 1000) {
  let followCount = 0;
  const usersContainer = document.querySelector('div.x1qnrgzn').parentElement;

  // Prevent multiple script running loops
  if (scriptRunning) {
    console.log('Script already running');
    return;
  }

  if (usersContainer.childElementCount < 1) {
    console.log('Users not found');
    return;
  }

  scriptRunning = true;

  console.log(`Script started with ${followLimit} follow limit.`);

  refetchByScroll(usersContainer);

  while (scriptRunning && followCount != followLimit) {
    if (usersContainer.childElementCount < 12) {
      console.log('No user found, refetching users.');
      refetchByScroll(usersContainer);

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

    // include required delay before processing the next user
    await sleep(delay);
  }

  console.log(`Script stopped after following ${followCount} accounts.`);
}

function stopScript() {
  scriptRunning = false;
  console.log('Script: Stop requested');
}

async function startUnfollow(unfollowLimit = 100, delay = 1000) {
  let unfollowCount = 0;
  const usersContainer = document.querySelector('div.x1qnrgzn').parentElement;

  // Prevent multiple script running loops
  if (scriptRunning) {
    console.log('Script already running');
    return;
  }

  if (usersContainer.childElementCount < 1) {
    console.log('Users not found');
    return;
  }

  scriptRunning = true;

  console.log(`Script started with ${unfollowLimit} unfollow limit.`);

  refetchByScroll(usersContainer);

  while (scriptRunning && unfollowCount != unfollowLimit) {
    if (usersContainer.childElementCount < 12) {
      console.log('No user found, scrolling to bottom');
      refetchByScroll(usersContainer);

      usersContainer.style.setProperty('padding-bottom', '0px', 'important');

      await sleep(3000);
      continue;
    }

    const user = document.querySelector('div.x1qnrgzn');
    const username = user.querySelector('span._ap3a').textContent;
    const unfollowButton = user.querySelector('button');

    if (!whiteList.includes(username)) {
      console.log('username:', username);
      unfollowButton.click();

      // include required delay before proceeding the next user
      // adding delay before deleting the user from DOM (just for an instant preview)
      await sleep(delay);

      // click on unfollow confirmation button
      const confirmationButton = await waitForElement('button._a9--');
      confirmationButton.click();
      await waitForElementToDisappear('button._a9--');
      unfollowCount++;
    }

    // Remove the user from the page
    user.remove();
    usersContainer.style.setProperty('padding-bottom', '0px', 'important');
  }

  console.log(`Script stopped after unfollowing ${unfollowCount} accounts.`);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'startFollowing') {
    startFollow(message.followLimit, message.followDelay);
  }

  if (message.action === 'stopScript') {
    stopScript();
  }

  if (message.action === 'startUnfollowing') {
    startUnfollow(message.unfollowLimit, message.unfollowDelay);
  }
});
