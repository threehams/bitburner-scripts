const doc = eval("document");

export const enterCommand = async (command: string) => {
  const input = doc.querySelector(
    "#terminal-input-text-box"
  ) as HTMLInputElement;
  input.value = command;
  doc.dispatchEvent(
    new KeyboardEvent("keydown", {
      code: "Enter",
      keyCode: 13,
      key: "Enter",
    })
  );
};
