function Editor() {
  const editorELement = document.querySelector("#editor") as HTMLElement;

  return {
    id: Math.random().toString(36).slice(2, 7),
    init() {
      if (!editorELement) return;
      editorELement.innerText = "Hello, World!";
      editorELement.contentEditable = "true";
    },
  };
}

const editor = Editor();
editor.init();
