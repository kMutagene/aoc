def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def init_stacks(count):
    stacks = {}
    for i in range(1,count+1):
        stacks[i] = []
    return stacks

class MoveInstruction:
    def __init__(self, move_line: str):
        split = move_line.split(" ")
        self.Amount = int(split[1])
        self.From = int(split[3])
        self.To = int(split[5])
    def __str__(self) -> str:
        return f"\nMove {self.Amount} From {self.From} To {self.To}"
    def __repr__(self) -> str:
        return self.__str__()

stacks = None
stacks2 = None
instructions = []
is_stack = True
is_initialized = False

with open("input.txt","r") as f:
    for line in f:
        if not "[" in line: is_stack = False
        clean = line.replace("\n","")
        if is_stack:
            print(f'stacks: {clean}')
            items = list(chunks(clean,4))
            if not is_initialized:
                stacks = init_stacks(len(items))
                stacks2 = init_stacks(len(items))
                is_initialized = True
            for ind, item in enumerate(items):
                cleaned_item = item.replace("[","").replace("]","").replace(" ","")
                if cleaned_item != "":
                    stacks[ind+1].insert(0,cleaned_item)
                    stacks2[ind+1].insert(0,cleaned_item)
        elif clean != "" and "move" in line:
            instructions.append(MoveInstruction(clean))

for instruction in instructions:
    for moves in range(0,instruction.Amount):
        item = stacks[instruction.From].pop()
        stacks[instruction.To].append(item)

print(f'part 1 : {"".join([stack.pop() for key,stack in stacks.items()])}')

# part2: instead of popping, take chunks from the stacks
for instruction in instructions:
    from_stack = stacks2[instruction.From]
    start_index = len(from_stack) - instruction.Amount
    chunk = from_stack[start_index:]
    del stacks2[instruction.From][start_index:]
    stacks2[instruction.To].extend(chunk)

print(f'part 2 : {"".join([stack.pop() for key,stack in stacks2.items()])}')
