from collections import Counter

class Solver:
    def __init__(self, dictionary):
        self.dictionary = dictionary

    def find_words(self, letters, min_length=3):
        letters = letters.lower()
        letters_counter = Counter(letters)

        results = []

        for word in self.dictionary.words:
            if len(word) < min_length:
                continue
            word_counter = Counter(word)
            if all(letters_counter[c] >= count for c, count in word_counter.items()):
                results.append(word)

        return sorted(results, key=lambda w: (len(w), w))
