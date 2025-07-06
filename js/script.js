const codeBox = document.querySelector(".code");
const languageSelector = document.querySelector(".languages");
const resultDisplay = document.querySelector(".output");
const compileBtn = document.querySelector("#compile-btn");
const lineNumber = document.querySelector(".line-number");

let codeId;
let timeoutId;

compileBtn.onclick = () => {
  const code = codeBox.value.trim();
  const langId = languageSelector.value;

  if (!code) {
    resultDisplay.style.color = 'red';
    resultDisplay.textContent = "Please write some code before compiling.";
    return;
  }

  resultDisplay.style.color = '#444';
  resultDisplay.textContent = "Compiling...";

  fetch("https://course.codequotient.com/api/executeCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code: code,
      langId: langId
    })
  })
  .then(response => response.json())
  .then(data => {
    codeId = data.codeId;
    if (codeId) {
      console.log("Code ID:", codeId);
      timeoutId = setTimeout(() => getResult(codeId), 2000);
    } else {
      resultDisplay.style.color = 'red';
      resultDisplay.textContent = "Failed to get Code ID. Try again.";
    }
  })
  .catch(error => {
    console.error("Error:", error);
    resultDisplay.style.color = 'red';
    resultDisplay.textContent = "An error occurred. Check console for details.";
  });
};

function getResult(codeID) {
  console.log("Fetching result for Code ID:", codeID);

  fetch(`https://course.codequotient.com/api/codeResult/${codeID}`)
    .then(response => response.json())
    .then(data => {
      try {
        const actualResult = JSON.parse(data.data);
        console.log("Result:", actualResult);

        if (actualResult.output && actualResult.output.trim() !== "") {
          resultDisplay.style.color = 'green';
          resultDisplay.textContent = actualResult.output.trim();
        } else if (actualResult.errors && actualResult.errors.trim() !== "") {
          resultDisplay.style.color = 'red';
          resultDisplay.textContent = actualResult.errors.trim();
        } else {
          resultDisplay.style.color = 'orange';
          resultDisplay.textContent = "No output or errors returned.";
        }
      } catch (err) {
        console.error("Parsing error:", err);
        resultDisplay.style.color = 'red';
        resultDisplay.textContent = "Failed to parse the result.";
      }
    })
    .catch(error => {
      console.error("Result fetch error:", error);
      resultDisplay.style.color = 'red';
      resultDisplay.textContent = "Error fetching result.";
    });
}
