let scriptRunning = false;


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const refetchUsers = (parentContainer) => {
  const lastUser = parentContainer.lastChild;
  const firstUser = parentContainer.firstChild;
  lastUser.scrollIntoView(true);
  firstUser.scrollTop = 0;
};

async function startFollow(followLimit) {
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

  while (scriptRunning && followCount <= followLimit) {
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

    // Wait 500ms before processing the next user
    await sleep(500);
  }

  console.log(`Script stopped after following ${followCount} accounts.`);
}

function stopScript() {
  scriptRunning = false;
  console.log('Script: Stop requested');
}

function stopScrolling() {
  scrolling = false;
  console.log('Auto Scroll: Stop requested');
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'startFollowing') {
    startFollow(message.followLimit);
  }

  if (message.action === 'stopScript') {
    stopScript();
  }
});
