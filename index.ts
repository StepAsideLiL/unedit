function main() {
  const editorELement = document.querySelector("#editor") as HTMLElement;

  if (!editorELement) return;

  editorELement.innerText = "Hello, World!";
  editorELement.contentEditable = "true";

  const selection = document.getSelection();

  function handle(e: Event) {
    if (e.type === "selectionchange") {
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      console.log(range.startOffset, range.endOffset, selection.direction);
    }
  }

  document.addEventListener("selectionchange", handle);
  editorELement.addEventListener("input", handle);
  editorELement.addEventListener("keyup", handle);
  editorELement.addEventListener("mouseup", handle);
}

main();
