let previousWords = new Set(); // для подсветки новых слов

function updateSliderVal() {
    document.getElementById("slider_val").textContent = document.getElementById("min_length_slider").value;
}

// Автоверхний регистр для поля букв
const lettersInput = document.getElementById("letters");
lettersInput.addEventListener("input", () => {
    const cursor = lettersInput.selectionStart;
    lettersInput.value = lettersInput.value.toUpperCase();
    lettersInput.setSelectionRange(cursor, cursor);
});

// Автоверхний регистр для поля добавления слова
const addWordInput = document.getElementById("add_word_input");
addWordInput.addEventListener("input", () => {
    const cursor = addWordInput.selectionStart;
    addWordInput.value = addWordInput.value.toUpperCase();
    addWordInput.setSelectionRange(cursor, cursor);
});

function solve() {
    let letters = document.getElementById("letters").value;
    let min_length = document.getElementById("min_length_slider").value;

    fetch("/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letters: letters.toLowerCase(), min_length })
    })
    .then(res => res.json())
    .then(words => {
        const div = document.getElementById("words");
        div.innerHTML = "";

        // сортировка: сначала по длине, потом по алфавиту
        words.sort((a, b) => a.length - b.length || a.localeCompare(b));

        words.forEach((w, index) => {
            const item = document.createElement("div");
            item.className = "word-item";
            item.textContent = w.toUpperCase();

            if (!previousWords.has(w)) item.classList.add("new");

            item.style.animationDelay = `${index * 0.03}s`;
            item.onclick = () => copyWord(w);

            div.appendChild(item);
        });

        previousWords = new Set(words);

        // Прокрутка вниз
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        }, 200);

    });
}

function copyWord(word) {
    navigator.clipboard.writeText(word).then(() => alert("Скопировано: " + word));
}

function addWord() {
    let word = document.getElementById("add_word_input").value;
    fetch("/add_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.toLowerCase() })
    })
    .then(res => res.json())
    .then(resp => alert(resp.message));
}

function deleteWord() {
    const input = document.getElementById("add_word_input");
    const word = input.value.trim().toLowerCase();

    if (!word) { alert("Введите слово для удаления"); return; }

    fetch("/delete_word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word })
    })
    .then(r => r.json())
    .then(data => {
        alert(data.message);
        input.value = "";
        input.focus();
    })
    .catch(() => alert("Ошибка соединения"));
}

function clearWords() {
    document.getElementById("words").innerHTML = "";
    document.getElementById("letters").value = "";
    document.getElementById("add_word_input").value = "";
    previousWords.clear();
    document.getElementById("letters").focus();
}

// Горячие клавиши
lettersInput.addEventListener("keydown", e => { if (e.key === "Enter") solve(); });
document.addEventListener("keydown", e => { if (e.key === "Delete") clearWords(); });
