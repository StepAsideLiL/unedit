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

    // If caret is inside a text node, move to its parent element
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;

    if (!node) return null;

    // Traverse upward until we reach a direct child of the editable root
    while (node && node.parentElement !== editorElement) {
      node = node.parentElement;
    }

    if (node && node.parentElement === editorElement)
      activeElement = node as HTMLElement;
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

        console.log(editorElement);
      }
    },
  };
}

const editor = Editor({
  // initialContent: "Hello, World!",
});
editor.initiate();
// editor.distroy();

// function createRichTextEditor(options) {
//   const { mount, placeholder = "", onChange } = options;
//   if (!mount) throw new Error("mount element is required");

//   // ===== Toolbar Buttons Config =====
//   const buttons = [
//     { cmd: "bold", label: "B" },
//     { cmd: "italic", label: "I" },
//     { cmd: "underline", label: "U" },
//     { cmd: "insertUnorderedList", label: "• List" },
//     { cmd: "insertOrderedList", label: "1. List" },
//     { cmd: "formatBlock", value: "H1", label: "H1" },
//     { cmd: "formatBlock", value: "H2", label: "H2" },
//     { cmd: "formatBlock", value: "P", label: "P" },
//     { cmd: "createLink", label: "Link" },
//     { cmd: "undo", label: "Undo" },
//     { cmd: "redo", label: "Redo" },
//   ];

//   // ===== Root Container =====
//   const container = document.createElement("div");
//   container.style.border = "1px solid #ccc";
//   container.style.fontFamily = "sans-serif";

//   // ===== Toolbar =====
//   const toolbar = document.createElement("div");
//   toolbar.style.display = "flex";
//   toolbar.style.flexWrap = "wrap";
//   toolbar.style.gap = "4px";
//   toolbar.style.padding = "6px";
//   toolbar.style.borderBottom = "1px solid #ddd";
//   toolbar.style.background = "#f9f9f9";

//   buttons.forEach((btn) => {
//     const button = document.createElement("button");
//     button.type = "button";
//     button.textContent = btn.label;
//     button.style.padding = "4px 8px";
//     button.style.cursor = "pointer";

//     button.addEventListener("click", () => {
//       if (btn.cmd === "createLink") {
//         const url = prompt("Enter URL");
//         if (url) document.execCommand("createLink", false, url);
//         return;
//       }

//       if (btn.cmd === "formatBlock") {
//         document.execCommand("formatBlock", false, btn.value);
//         return;
//       }

//       document.execCommand(btn.cmd, false, null);
//       editor.focus();
//     });

//     toolbar.appendChild(button);
//   });

//   // ===== Editable Area =====
//   const editor = document.createElement("div");
//   editor.contentEditable = "true";
//   editor.style.minHeight = "200px";
//   editor.style.padding = "10px";
//   editor.style.outline = "none";

//   editor.dataset.placeholder = placeholder;

//   // Placeholder behavior
//   function updatePlaceholder() {
//     if (editor.innerHTML.trim() === "") {
//       editor.classList.add("empty");
//     } else {
//       editor.classList.remove("empty");
//     }
//   }

//   const style = document.createElement("style");
//   style.textContent = `
//     [contenteditable][data-placeholder].empty:before {
//       content: attr(data-placeholder);
//       color: #888;
//       pointer-events: none;
//     }
//   `;
//   document.head.appendChild(style);

//   updatePlaceholder();

//   editor.addEventListener("input", () => {
//     updatePlaceholder();
//     if (onChange) onChange(editor.innerHTML);
//   });

//   editor.addEventListener("focus", updatePlaceholder);
//   editor.addEventListener("blur", updatePlaceholder);

//   // ===== Assemble =====
//   container.appendChild(toolbar);
//   container.appendChild(editor);
//   mount.appendChild(container);

//   // ===== Public API =====
//   return {
//     getHTML: () => editor.innerHTML,
//     setHTML: (html) => {
//       editor.innerHTML = html;
//       updatePlaceholder();
//     },
//     focus: () => editor.focus(),
//     destroy: () => {
//       mount.removeChild(container);
//     },
//   };
// }
