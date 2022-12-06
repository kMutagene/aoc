input_lines = []

with open("input.txt","r") as f:
    for line in f:
        print(line)
        clean = line.replace("\n","")
        input_lines.append(clean)

signal = ''.join(input_lines)

def window(arr, k):
    for i in range(len(arr)-k+1):
        yield (i+k,arr[i:i+k])

is_start = False

for index,group in window(signal, 4):
    if len(set(group)) == 4:
        if not is_start: 
            print(index)
            is_start = True

# part 2
is_start = False

for index,group in window(signal, 14):
    if len(set(group)) == 14:
        if not is_start: 
            print(index)
            is_start = True