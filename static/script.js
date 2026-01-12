let previousWords = new Set(); // для подсветки новых слов

const lettersInput = document.getElementById("letters");
const addWordInput = document.getElementById("add_word_input");

// Ввод букв — всегда ВЕРХНИЙ регистр (визуально)
lettersInput.addEventListener("input", () => {
    const pos = lettersInput.selectionStart;
    lettersInput.value = lettersInput.value.toUpperCase();
    lettersInput.setSelectionRange(pos, pos);
});

// Ввод слова — тоже верхний регистр
addWordInput.addEventListener("input", () => {
    const pos = addWordInput.selectionStart;
    addWordInput.value = addWordInput.value.toUpperCase();
    addWordInput.setSelectionRange(pos, pos);
});

function updateSliderVal() {
    document.getElementById("slider_val").textContent =
        document.getElementById("min_length_slider").value;
}

function solve() {
    let letters = lettersInput.value;
    let min_length = document.getElementById("min_length_slider").value;

    fetch("/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letters, min_length })
    })
    .then(res => res.json())
    .then(words => {
        let div = document.getElementById("words");
        div.innerHTML = "";

        words.sort((a, b) => a.length - b.length || a.localeCompare(b));

        words.forEach((w, index) => {
            let item = document.createElement("div");
            item.className = "word-item";
            item.textContent = w.toUpperCase();

            if (!previousWords.has(w)) {
                item.classList.add("new");
            }

            item.style.animationDelay = `${index * 0.03}s`;
            item.onclick = () => copyWord(w);

            div.appendChild(item);
        });

        previousWords = new Set(words);

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

function addWord() {
    let word = addWordInput.value;

    fetch("/add_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word })
    })
    .then(res => res.json())
    .then(resp => alert(resp.message));
}

function deleteWord() {
    let word = addWordInput.value.trim().toLowerCase();
    if (!word) return;

    fetch("/delete_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word })
    })
    .then(res => res.json())
    .then(resp => alert(resp.message));
}

function clearWords() {
    document.getElementById("words").innerHTML = "";
    lettersInput.value = "";
    addWordInput.value = "";
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
