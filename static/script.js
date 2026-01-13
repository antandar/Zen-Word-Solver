let previousWords = new Set();

const lettersInput = document.getElementById("letters");

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

    const hide3 = document.getElementById("hide_3_letters").checked;

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

        words.forEach((w, i) => {
            const item = document.createElement("div");
            item.className = "word-item";
            item.textContent = w.toUpperCase();

            if (!previousWords.has(w)) {
                item.classList.add("new");
            }

            item.style.animationDelay = `${i * 0.03}s`;
            item.onclick = () => copyWord(w);

            div.appendChild(item);
        });

        previousWords = new Set(words);

        // ⬇️ прокрутка вниз
        setTimeout(() => {
            div.scrollTo({
                top: div.scrollHeight,
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
