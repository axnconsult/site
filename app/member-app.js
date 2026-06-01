const MEMBER_PROGRESS_KEY = "axonMemberProgress";

const memberProgress = loadMemberProgress();

bootMembersDashboard();

function bootMembersDashboard() {
  if (!document.querySelector("#members-app")) {
    return;
  }

  paintMembersProgress();
}

function paintMembersProgress() {
  const completed = Number(memberProgress.completedModules || 0);
  const progress = Math.max(20, Math.min(100, completed * 20 || 20));

  setText("#metric-completed", String(completed));
  setText("#metric-progress", `${progress}%`);
  setText("#metric-current", completed > 0 ? `Modulo ${Math.min(completed + 1, 5)}` : "Modulo 1");
}

function loadMemberProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(MEMBER_PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}