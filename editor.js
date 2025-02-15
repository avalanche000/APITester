function makeJsEditor(element, options) {
    const indentSize = options?.indentSize || 4;

    function makeIndent(n) {
        return " ".repeat(indentSize * n);
    }

    function getIndent(index) {
        let indent = 0;
        let idx = 0;

        while (idx < index) {
            let char = element.value[idx];

            if (char === "(" || char === "[" || char === "{") indent++;
            if (char === ")" || char === "]" || char === "}") indent--;

            idx++;
        }

        return Math.max(indent, 0);
    }

    if (options?.onInput) element.addEventListener("input", () => options.onInput(element.value));

    element.addEventListener("keydown", (event) => {
        const start = element.selectionStart;
        const end = element.selectionEnd;

        const indent = getIndent(start);

        const before = element.value[start - 1];
        const char = event.key;
        const after = element.value[start];

        let defaultPrevented = false;

        function prevent() {
            event.preventDefault();
            defaultPrevented = true;
        }

        switch (char) {
            case "(":
                prevent();
                element.value = element.value.slice(0, start) + "()" + element.value.slice(end, element.value.length);
                element.selectionStart = start + 1;
                element.selectionEnd = start + 1;
                break;
            case "[":
                prevent();
                element.value = element.value.slice(0, start) + "[]" + element.value.slice(end, element.value.length);
                element.selectionStart = start + 1;
                element.selectionEnd = start + 1;
                break;
            case "{":
                prevent();
                element.value = element.value.slice(0, start) + "{}" + element.value.slice(end, element.value.length);
                element.selectionStart = start + 1;
                element.selectionEnd = start + 1;
                break;
            case "\"":
                prevent();
                if (after === "\"") {
                    element.value = element.value.slice(0, start) + element.value.slice(end, element.value.length);
                    element.selectionStart = start + 1;
                    element.selectionEnd = start + 1;
                } else {
                    element.value = element.value.slice(0, start) + "\"\"" + element.value.slice(end, element.value.length);
                    element.selectionStart = start + 1;
                    element.selectionEnd = start + 1;
                }
                break;
            case ")":
                if (after === ")") {
                    prevent();
                    element.selectionStart = start + 1;
                    element.selectionEnd = end + 1;
                }
                break;
            case "]":
                if (after === "]") {
                    prevent();
                    element.selectionStart = start + 1;
                    element.selectionEnd = end + 1;
                }
                break;
            case "}":
                if (after === "}") {
                    prevent();
                    element.selectionStart = start + 1;
                    element.selectionEnd = end + 1;
                }
                break;
            case "Enter":
                prevent();
                switch (before) {
                    case "(":
                        element.value = element.value.slice(0, start) + "\n" + makeIndent(indent) + (after === ")" ? "\n" + makeIndent(indent - 1) : "") + element.value.slice(start, element.value.length);
                        element.selectionStart = start + (indent * indentSize) + 1;
                        element.selectionEnd = start + (indent * indentSize) + 1;
                        break;
                    case "[":
                        element.value = element.value.slice(0, start) + "\n" + makeIndent(indent) + (after === "]" ? "\n" + makeIndent(indent - 1) : "") + element.value.slice(start, element.value.length);
                        element.selectionStart = start + (indent * indentSize) + 1;
                        element.selectionEnd = start + (indent * indentSize) + 1;
                        break;
                    case "{":
                        element.value = element.value.slice(0, start) + "\n" + makeIndent(indent) + (after === "}" ? "\n" + makeIndent(indent - 1) : "") + element.value.slice(start, element.value.length);
                        element.selectionStart = start + (indent * indentSize) + 1;
                        element.selectionEnd = start + (indent * indentSize) + 1;
                        break;
                    default:
                        element.value = element.value.slice(0, start) + "\n" + makeIndent(indent) + element.value.slice(start, element.value.length);
                        element.selectionStart = start + (indent * indentSize) + 1;
                        element.selectionEnd = start + (indent * indentSize) + 1;
                        break;
                }
                break;
            case "Tab":
                prevent();
                element.value = element.value.slice(0, start) + makeIndent(1) + element.value.slice(start, element.value.length);
                element.selectionStart = start + indentSize;
                element.selectionEnd = end + indentSize;
                break;
            default:
                break;
        }

        if (defaultPrevented && options?.onInput) options.onInput(element.value);
    });

}

export default makeJsEditor;
