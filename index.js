import makeJsEditor from "./editor.js";

const pathInput = document.getElementById("pathInput");
const methodInput = document.getElementById("methodInput");
const bodyInput = document.getElementById("bodyInput");
const sendRequestButton = document.getElementById("sendRequestButton");
const responseStatus = document.getElementById("responseStatus");
const responseContentType = document.getElementById("responseContentType");
const responseBody = document.getElementById("responseBody");

pathInput.value = localStorage.getItem("requestPath") || "/";
methodInput.value = localStorage.getItem("requestMethod") || "GET";
bodyInput.value = localStorage.getItem("requestBody") || "";

pathInput.addEventListener("input", () =>
  localStorage.setItem("requestPath", pathInput.value)
);
methodInput.addEventListener("input", () =>
  localStorage.setItem("requestMethod", methodInput.value)
);
makeJsEditor(bodyInput, {
  onInput: () => localStorage.setItem("requestBody", bodyInput.value),
});

sendRequestButton.addEventListener("click", () => {
  let bodyString;

  try {
    bodyString = JSON.stringify(JSON.parse(bodyInput.value));
  } catch (_) {}
  
  responseStatus.innerHTML = "";
  responseContentType.innerHTML = "";
  responseBody.value = "";

  fetch(pathInput.value, {
    method: methodInput.value,
    headers: { "Content-Type": "application/json" },
    body: methodInput.value === "GET" ? undefined : bodyString,
  })
    .then(async (res) => {
      const contentType = res.headers.get("content-type").split("; ")[0];
      const data =
        contentType === "application/json"
          ? JSON.stringify(await res.json(), undefined, 4)
          : await res.text();

      responseStatus.innerHTML = res.status;
      responseContentType.innerHTML = contentType;
      responseBody.value = data;
    })
    .catch((error) => {
      responseContainer.innerHTML += "Error:" + error;
    });
});
