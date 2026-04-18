export const triggerHaptic = () => {
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
    return;
  }

  // iOS Workaround for Haptic Feedback (iOS 17.4+ supports 'switch' attribute which provides haptic on toggle)
  let hapticLabel = document.getElementById("ios-haptic-label");
  
  if (!hapticLabel) {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.id = "ios-haptic-input";

    hapticLabel = document.createElement("label");
    hapticLabel.setAttribute("for", "ios-haptic-input");
    hapticLabel.id = "ios-haptic-label";

    container.appendChild(input);
    container.appendChild(hapticLabel);
    document.body.appendChild(container);
  }

  hapticLabel.click();
};
