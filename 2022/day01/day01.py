# part 1

calories = []
current = []

with open('input.txt', 'r') as input:
    for line in input:
        if line == "\n":
            calories.append(sum(current))
            current = []
        else:
            cleaned = line.replace("\n","")
            current.append(int(cleaned))

print(max(calories))

# part 2

print(sum(sorted(calories, reverse=True)[0:3]))