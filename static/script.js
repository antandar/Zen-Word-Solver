let previousWords = new Set(); // для подсветки новых слов

// Поле "Буквы"
const lettersInput = document.getElementById("letters");
lettersInput.addEventListener("input", () => {
    const cursor = lettersInput.selectionStart;
    // оставляем только русские буквы
    lettersInput.value = lettersInput.value.toUpperCase().replace(/[^А-ЯЁ]/g, '');
    lettersInput.setSelectionRange(cursor, cursor);
});

// Поле "Добавить слово"
const addWordInput = document.getElementById("add_word_input");
addWordInput.addEventListener("input", () => {
    const cursor = addWordInput.selectionStart;
    // оставляем только русские буквы
    addWordInput.value = addWordInput.value.toUpperCase().replace(/[^А-ЯЁ]/g, '');
    addWordInput.setSelectionRange(cursor, cursor);
});

function updateSliderVal() {
    document.getElementById("slider_val").textContent = document.getElementById("min_length_slider").value;
}

function solve() {
    let letters = document.getElementById("letters").value;
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

        // сортировка: сначала по длине, потом по алфавиту
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

        // прокрутка вниз всей страницы (для column-count)
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        }, 200);
    });
}

function copyWord(word) {
    navigator.clipboard.writeText(word).then(() => {
        alert("Скопировано: " + word);
    });
}

function addWord() {
    let word = document.getElementById("add_word_input").value;
    if (!/^[А-ЯЁ]+$/.test(word)) {
        alert("Разрешены только русские буквы!");
        return;
    }
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

    if (!word) {
        alert("Введите слово для удаления");
        return;
    }

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
lettersInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") solve();
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Delete") clearWords();
});
