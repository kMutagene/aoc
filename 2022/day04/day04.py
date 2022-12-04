class Pairing:
    def __init__(self, s1, e1, s2, e2):
        a1 = set(range(s1, e1+1))
        a2 = set(range(s2, e2+1))
        self.Assignments1 = a1
        self.Assignments2 = a2
    def has_subset(self):
        return (self.Assignments1.issubset(self.Assignments2) or self.Assignments2.issubset(self.Assignments1))
    def has_overlap(self):
        return (not self.Assignments1.isdisjoint(self.Assignments2)) or (not self.Assignments2.isdisjoint(self.Assignments1))

pairings = []

with open("input.txt","r") as f:
    for line in f:
        clean = line.replace("\n","")
        splt = clean.split(",")
        a1 = splt[0].split("-")
        a2 = splt[1].split("-")
        s1, e1 = int(a1[0]), int(a1[1])
        s2, e2 = int(a2[0]), int(a2[1])
        pairings.append(Pairing(s1, e1, s2, e2))

subsets = [int(p.has_subset()) for p in pairings]
overlaps = [int(p.has_overlap()) for p in pairings]

print(sum(subsets))
print(sum(overlaps))
