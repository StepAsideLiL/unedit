type TEditorOptions = {
  container?: string;
  className?: string;
  initialContent?: string;
  id?: string;
  placeholderText?: string;
};

/**
 * Editor.
 */
function Editor(options?: TEditorOptions) {
  const {
    container = "#editor-container",
    id = "editor",
    className,
    initialContent = "<p><br></p>",
    placeholderText = "Write something...",
  }: TEditorOptions = options ? options : {};

  const editorContainer = document.querySelector(container) as HTMLElement;
  let editorElement: HTMLElement | null = null;
  let activeElement: HTMLElement | null = null;

  if (!editorContainer) {
    throw new Error(
      `No container with \`${container}\` query selector exists.`,
    );
  }

  function handleEditorElementInput() {
    editorElement?.classList.toggle(
      "is-empty",
      editorElement.textContent?.trim().length === 0,
    );
  }

  function handleEditorElementBlur() {
    activeElement = null;
  }

  function handleEditorElementKeyup() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;

    if (!node) return null;

    // If caret is inside a text node, move to its parent element
    if (node.nodeType === Node.TEXT_NODE) {
      activeElement = node.parentElement as HTMLElement;
    } else {
      activeElement = node as HTMLElement;
    }
  }

  return {
    initiate() {
      editorElement = document.createElement("div");

      editorElement.contentEditable = "true";
      editorElement.id = id;
      editorElement.style.padding = "10px";
      if (className) editorElement.className = className;
      if (initialContent) editorElement.innerHTML = initialContent;
      if (placeholderText) {
        editorElement.dataset.placeholder = placeholderText;
        handleEditorElementInput();
      }
      editorContainer.appendChild(editorElement);

      editorElement.addEventListener("keyup", function () {
        // console.log(editorElement);
      });
      editorElement.addEventListener("input", handleEditorElementInput);
      editorElement.addEventListener("keyup", handleEditorElementKeyup);
      editorElement.addEventListener("blur", handleEditorElementBlur);
    },
    distroy() {
      if (editorElement) {
        editorElement.removeEventListener("input", handleEditorElementInput);
        editorElement.removeEventListener("keyup", handleEditorElementKeyup);
        editorElement.removeEventListener("blur", handleEditorElementBlur);

        editorElement.remove();
      }
    },
    insertBlock(node: Node) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Remove any selected content (if text is highlighted)
      range.deleteContents();

      // Insert the new node
      range.insertNode(node);

      // Move caret AFTER the inserted node
      range.setStartAfter(node);
      range.setEndAfter(node);

      selection.removeAllRanges();
      selection.addRange(range);
    },
  };
}

const editor = Editor({
  initialContent: `<h1>Hello</h1>
  <p>Lorem, ipsum dolor sit amet consectetur <strong><em>adipisicing</em></strong> elit. Praesentium, quam?</p>`,
});
editor.initiate();
// editor.distroy();

const span = document.createElement("span");
span.textContent = "NEW";
span.style.background = "yellow";

editor.insertBlock(span);
