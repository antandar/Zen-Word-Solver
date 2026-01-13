let previousWords = new Set();

// Поле ввода букв — только русские, верхний регистр
const lettersInput = document.getElementById("letters");
lettersInput.addEventListener("input", () => {
    const cursor = lettersInput.selectionStart;
    lettersInput.value = lettersInput.value
        .toUpperCase()
        .replace(/[^А-ЯЁ]/g, "");
    lettersInput.setSelectionRange(cursor, cursor);
});

function updateSliderVal() {
    document.getElementById("slider_val").textContent =
        document.getElementById("min_length_slider").value;
}

function solve() {
    const letters = lettersInput.value;
    const min_length = document.getElementById("min_length_slider").value;

    if (!letters) return;

    fetch("/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letters, min_length })
    })
    .then(res => res.json())
    .then(words => {
        const div = document.getElementById("words");
        div.innerHTML = "";

        words.sort((a, b) => a.length - b.length || a.localeCompare(b));

        words.forEach((w, index) => {
            const item = document.createElement("div");
            item.className = "word-item";
            item.textContent = w.toUpperCase();

            if (!previousWords.has(w)) {
                item.classList.add("new");
            }

            item.onclick = () => copyWord(w);
            div.appendChild(item);
        });

        previousWords = new Set(words);

        // прокрутка вниз (для column-count)
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        }, 200);
    });
}

function copyWord(word) {
    navigator.clipboard.writeText(word);
}

function clearWords() {
    document.getElementById("words").innerHTML = "";
    lettersInput.value = "";
    previousWords.clear();
    lettersInput.focus();
}

// Горячие клавиши
lettersInput.addEventListener("keydown", e => {
    if (e.key === "Enter") solve();
});

document.addEventListener("keydown", e => {
    if (e.key === "Delete") clearWords();
});
