priority_lookup = {
    'a': 1,
    'b': 2,
    'c': 3,
    'd': 4,
    'e': 5,
    'f': 6,
    'g': 7,
    'h': 8,
    'i': 9,
    'j': 10,
    'k': 11,
    'l': 12,
    'm': 13,
    'n': 14,
    'o': 15,
    'p': 16,
    'q': 17,
    'r': 18,
    's': 19,
    't': 20,
    'u': 21,
    'v': 22,
    'w': 23,
    'x': 24,
    'y': 25,
    'z': 26,
    'A': 27,
    'B': 28,
    'C': 29,
    'D': 30,
    'E': 31,
    'F': 32,
    'G': 33,
    'H': 34,
    'I': 35,
    'J': 36,
    'K': 37,
    'L': 38,
    'M': 39,
    'N': 40,
    'O': 41,
    'P': 42,
    'Q': 43,
    'R': 44,
    'S': 45,
    'T': 46,
    'U': 47,
    'V': 48,
    'W': 49,
    'X': 50,
    'Y': 51,
    'Z': 52,
}

class Rucksack:
    def __init__(self, c1: str, c2: str):
        self.Compartment1 = c1
        self.Compartment2 = c2

    def get_item_set(self):
        s1 = set(self.Compartment1)
        s2 = set(self.Compartment2)
        return s1.union(s2)

    def get_redundant_items(self):
        s1 = set(self.Compartment1)
        s2 = set(self.Compartment2)
        return s1.intersection(s2)

    def get_priority_score(self):
        diff = self.get_redundant_items()
        priorities = [priority_lookup[i] for i in diff]
        return sum(priorities)

    

rucksacks = []

with open("input.txt","r") as f:
    for line in f:
        clean = line.replace("\n","")
        c1 = clean[0:(int(len(clean)/2))]
        c2 = clean[int(len(clean)/2):int(len(clean))]
        rucksacks.append(Rucksack(c1,c2))

print(sum([r.get_priority_score() for r in rucksacks]))

# part2

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

groups = chunks(rucksacks,3)

group_sets = [
    [a.get_item_set() for a in g] for g in groups
]

import functools

badges = [functools.reduce(lambda r1,r2: r1.intersection(r2), group) for group in group_sets]

print(sum([priority_lookup[list(b)[0]] for b in badges]))