let previousWords = new Set();

const lettersInput = document.getElementById("letters");
const wordsDiv = document.getElementById("words");
const hide3Checkbox = document.getElementById("hide_3_letters");

// 🔹 только русские буквы + uppercase
lettersInput.addEventListener("input", () => {
    const pos = lettersInput.selectionStart;
    lettersInput.value = lettersInput.value
        .replace(/[^а-яё]/gi, "")
        .toUpperCase();
    lettersInput.setSelectionRange(pos, pos);
});

// Enter = поиск
lettersInput.addEventListener("keydown", e => {
    if (e.key === "Enter") solve();
});

function solve() {
    const letters = lettersInput.value.toLowerCase();
    if (!letters) return;

    const hide3 = hide3Checkbox.checked;

    fetch("/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            letters,
            min_length: hide3 ? 4 : 3
        })
    })
    .then(res => res.json())
    .then(words => {
    const div = document.getElementById("words");
    div.innerHTML = "";

    words.sort((a, b) => a.length - b.length || a.localeCompare(b));

    let hasNewWords = false;

    words.forEach((w, i) => {
        const item = document.createElement("div");
        item.className = "word-item";
        item.textContent = w.toUpperCase();

        if (!previousWords.has(w)) {
            item.classList.add("new");
            hasNewWords = true;
        }

        item.style.animationDelay = `${i * 0.03}s`;
        item.onclick = () => copyWord(w);

        div.appendChild(item);
    });

    // 🔹 если появились новые слова — умная прокрутка
    if (hasNewWords) {
        const anchor = document.createElement("div");
        anchor.style.height = "1px";
        anchor.style.width = "1px";
        anchor.style.pointerEvents = "none";

        div.appendChild(anchor);

        setTimeout(() => {
            anchor.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
            anchor.remove();
        }, 50);
    }

    previousWords = new Set(words);
});


        previousWords = new Set(words);

        // 🔩 ЖЕЛЕЗОБЕТОННАЯ АВТОПРОКРУТКА
        setTimeout(() => {
            wordsDiv.scrollTop = wordsDiv.scrollHeight;
            const lastWord = wordsDiv.lastElementChild;
if (lastWord) {
    lastWord.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });
}

        }, 50);
    });
}

function copyWord(word) {
    navigator.clipboard.writeText(word);
}

function clearWords() {
    wordsDiv.innerHTML = "";
    lettersInput.value = "";
    previousWords.clear();
    lettersInput.focus();
}

// Delete = новая комбинация
document.addEventListener("keydown", e => {
    if (e.key === "Delete") {
        clearWords();
    }
});

// 🔁 автофильтрация при переключении чекбокса
hide3Checkbox.addEventListener("change", () => {
    if (lettersInput.value.trim()) {
        solve();
    }
});
