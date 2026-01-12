class Dictionary:
    def __init__(self, path):
        self.path = path
        self.words = set()
        self.load()

    def load(self):
        try:
            with open(self.path, "r", encoding="utf-8") as f:
                self.words = set(line.strip().lower() for line in f if line.strip())
        except FileNotFoundError:
            self.words = set()

    def save(self):
        with open(self.path, "w", encoding="utf-8") as f:
            for word in sorted(self.words, key=lambda w: (len(w), w)):
                f.write(word + "\n")

    def add_word(self, word):
        self.words.add(word)
        self.save()

    def remove_word(self, word):
        self.words.discard(word)
        self.save()
