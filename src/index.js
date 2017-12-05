let score = 0;
let recentClicks = 0;

const goals = {
  0: "light-switch",
  5: "random",
  15: "lever-switch",
  30: "random",
  45: "simon-says",
  60: "dynamic-lever",
  75: "random",
  100: "score-graph",
  125: "trivia-box",
  150: "random",
  180: "pressure-button",
  210: "random",
  240: "jack-in-the-box",
  280: "tic-tac-toe",
  320: "random",
  370: "random",
  420: "random",
  480: "random",
  540: "random",
  600: "random",
  670: "random",
  690: "random",
  740: "random",
  810: "random",
  900: "random",
  42069: "score-graph",
};

const unlocks = {
  15: "lever-switch",
  60: "dynamic-lever",
  125: "trivia-box",
  180: "pressure-button",
  210: "jack-in-the-box",
  280: "tic-tac-toe",
}

const modules = [
  "big-red-button",
  "turn-crank",
]
  

let counter = document.querySelector("fancy-counter");

let moduleContainer = document.querySelector("#modules");

let alarmSound = document.querySelector("#fail");
let dingSound = document.querySelector("#ding");

alarmSound.volume = 0.1;
dingSound.volume = 0.4;

let dimOverlay = document.querySelector("#dimOverlay");

let hasSpawnedInitial = false;

let randomImage = document.querySelector("#randomImage");
let lastBackground = null;
function addModule(tagName) {
  setTimeout(() => {
    dimOverlay.style.height = document.querySelector("#everything").getBoundingClientRect().height + "px";
  }, 30);
  window._paq.push(['trackEvent', 'Game', 'addModule', tagName]);
  if(moduleContainer.children.length > 4) {
    if(hasSpawnedInitial) {
      let nextBg = `url('https://source.unsplash.com/random/${window.innerWidth + Math.round(Math.random() * 5)}x${window.innerHeight}')`;
      let bg = nextBg;
      if(lastBackground) {
        bg = nextBg + ", " + lastBackground;
      }
      lastBackground = nextBg;
      randomImage.style.backgroundImage = bg;
    }
  }
  dingSound.currentTime = 0;
  dingSound.play();
  let tag = document.createElement(tagName);
  moduleContainer.appendChild(tag);
  if(tagName === "light-switch") {
    tag.addEventListener("lightsOn", () => {
      document.body.classList.remove("dim");
      document.body.classList.remove("flicker");
      if(!hasSpawnedInitial) {
        hasSpawnedInitial = true;
        addModule("big-red-button");
      }
    });
    tag.addEventListener("lightsOff", () => {
      document.body.classList.add("dim");
      document.body.classList.remove("flicker");
    });
    tag.addEventListener("flicker", () => {
      document.body.classList.add("flicker");
    });
  }
  tag.addEventListener("succeed", () => {
    window._paq.push(['trackEvent', tagName, 'succeed']);
    if(tagName === "big-red-button") {
      increaseScore(1);
    }
    else if(tagName === "lever-switch") {
      increaseScore(2);
      tag.classList.remove("swing");
    }
    else if(tagName === "simon-says") {
      let stepCount = tag.chain.length;
      increaseScore(stepCount * stepCount);
      document.documentElement.style.filter = "";
    }
    else if(tagName === "turn-crank") {
      increaseScore(2);
    }
    else if(tagName === "dynamic-lever") {
      increaseScore(3);
    }
    else if(tagName === "trivia-box") {
      increaseScore(5);
      document.documentElement.style.transform = "";
    }
    else if(tagName === "tic-tac-toe") {
      increaseScore(5);
    }
    else if(tagName === "pressure-button") {
      increaseScore(3);
    }
    else if(tagName === "jack-in-the-box") {
      increaseScore(5);
    }
  })
  tag.addEventListener("fail", () => {
    window._paq.push(['trackEvent', tagName, 'fail']);
    if(tagName === "big-red-button") {
      increaseScore(-1);
    }
    else if(tagName === "lever-switch") {
      increaseScore(-2);
      tag.classList.add("swing");
    }
    else if(tagName === "dynamic-lever") {
      increaseScore(-1);
      let style = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}))`
      document.querySelector("#everything").style.background = style;
    }
    else if(tagName === "lever-switch") {
      increaseScore(-2);
    }
    else if(tagName === "simon-says") {
      increaseScore(-2);
      document.documentElement.style.filter = "hue-rotate(90deg)";
    }
    else if(tagName === "turn-crank") {
      increaseScore(-10);
    }
    else if(tagName === "pressure-button") {
      increaseScore(-3);
    }
    else if(tagName === "tic-tac-toe") {
      increaseScore(-5);
    }
    else if(tagName === "jack-in-the-box") {
      increaseScore(-5);
    }
    else if(tagName === "trivia-box") {
      increaseScore(-5);
      document.documentElement.style.transform = "skewY(-10deg)";
    }
    
    alarmSound.currentTime = 0;
    alarmSound.play();
    tag.classList.add("shake");
    setTimeout(() => {
      tag.classList.remove("shake");
      document.body.classList.add("shake");
      setTimeout(() => {
        document.body.classList.remove("shake");
      }, 100);
    }, 100);
  })
}

function checkForGoal() {
  for(let target in unlocks) {
    if(score >= target) {
      let unlockName = unlocks[target];
      modules.push(unlockName);
      delete(unlocks[target]);
    }
  }
  for(let target in goals) {
    if(score >= target) {
      let tagName;
      if(goals[target] != "random")
      {
        tagName = goals[target];
      }
      else
      {
        tagName = modules[Math.floor(Math.random()*modules.length)]
      }
      addModule(tagName);
      delete(goals[target]);
    }
  }
}

function setScore(newScore) {
  if(newScore < 0) {
    newScore = 0;
  }
  score = newScore;
  counter.value = score;
  checkForGoal();
}

function increaseScore(amount) {
  setScore(score + amount);
}

function recordScore() {
  window.scoreArray.push(score);
  if(window.scoreArray.length > 240)
  {
    window.scoreArray.shift();
  }
  if(score > window.highscore) {
    window.highscore = score;
    window._paq.push(['trackEvent', 'Game', 'highscore', score]);
  }
}

function recordClicks() {
  window.clickArray.push(recentClicks);
  recentClicks = 0;
  if(window.clickArray.length > 120)
  {
    window.clickArray.shift();
  }
}

window.apm = function() {
  let apm = window.clickArray.reduce((a,b) => a + b) / 2;
  return Math.round(apm);
};

window.scoreArray = [];
window.highscore = 0;
window.clickArray = [];
setInterval(recordScore, 1000);
setInterval(recordClicks, 1000);

document.body.addEventListener("click", () => {
  recentClicks++;
})

checkForGoal();

let goal_width = 28;

function onResize() {
  if(window.innerWidth < 800) {
    document.querySelector("#everything").style.fontSize = `${window.innerWidth / goal_width}px`;
  }
}

window.addEventListener("resize", onResize);

onResize();