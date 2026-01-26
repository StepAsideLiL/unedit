function eventHandler(event: Event) {
  console.log(event.type);
}

interface EditableChildOptions {
  tag?: keyof HTMLElementTagNameMap;
  initialText?: string;
  className?: string;
  placeholder?: string;
}

function createEditableChild(
  parent: HTMLElement,
  options: EditableChildOptions = {},
): HTMLElement {
  const { tag = "div", initialText = "", className, placeholder } = options;

  const child = document.createElement(tag);
  child.contentEditable = "true";
  child.spellcheck = true;

  if (className) child.className = className;
  if (initialText) child.textContent = initialText;

  if (placeholder) {
    child.dataset.placeholder = placeholder;

    const updatePlaceholderVisibility = () => {
      child.classList.toggle(
        "is-empty",
        child.textContent?.trim().length === 0,
      );
    };

    child.addEventListener("input", updatePlaceholderVisibility);
    updatePlaceholderVisibility();
  }

  parent.appendChild(child);
  return child;
}

function updatePlaceholderVisibility(editorElement: HTMLElement) {
  editorElement?.classList.toggle(
    "is-empty",
    editorElement.textContent?.trim().length === 0,
  );
}

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
  } = options
    ? options
    : {
        container: "#editor-container",
      };

  const editorContainer = document.querySelector(container) as HTMLElement;
  let editorElement: HTMLElement | null = null;

  if (!editorContainer) {
    throw new Error(
      `No container with \`${container}\` query selector exists.`,
    );
  }

  return {
    initiate() {
      editorElement = document.createElement("div");

      editorElement.contentEditable = "true";
      editorElement.id = id;
      if (className) editorElement.className = className;
      if (initialContent) editorElement.innerHTML = initialContent;
      if (placeholderText) {
        editorElement.dataset.placeholder = placeholderText;
        updatePlaceholderVisibility(editorElement);
      }
      editorContainer.appendChild(editorElement);

      // editorElement.addEventListener("focus", function () {
      //   if (editorElement) {
      //     editorElement.innerHTML = "<p><br></p>";
      //   }
      // });
      editorElement.addEventListener("input", function () {
        if (editorElement) {
          updatePlaceholderVisibility(editorElement);
        }
      });
      editorElement.addEventListener("blur", eventHandler);
    },
    distroy() {
      // editorElement.removeEventListener("focus", eventHandler);
      // editorElement.removeEventListener("blur", eventHandler);
    },
  };
}

const editor = Editor({
  initialContent: "Hello, World!",
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
