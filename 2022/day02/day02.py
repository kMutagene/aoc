strategy_guide = []

with open("input.txt","r") as f:
    for line in f:
        split = line.replace("\n","").split(" ")
        strategy_guide.append((str(split[0]), str(split[1])))

print(strategy_guide)

def get_worth(selection:str) -> int:
    match selection:
        case 'X': return 1
        case 'Y': return 2
        case 'Z': return 3

# A / X : Rock
# B / Y : Paper
# C / Z : Scissors

def resolve_round(enemy: str, you: str) -> int:
    match enemy:
        case 'A':
            match you:
                case 'X': return 3 # draw : Rock v Rock
                case 'Y': return 6 # win  : Rock v Paper
                case 'Z': return 0 # loss : Rock v Scissors
        case 'B':
            match you:
                case 'X': return 0 # loss : Paper v Rock
                case 'Y': return 3 # draw : Paper v Paper
                case 'Z': return 6 # win  : Paper v Scissors
        case 'C':
            match you:
                case 'X': return 6 # win  : Scissors v Rock
                case 'Y': return 0 # loss : Scissors v Paper
                case 'Z': return 3 # draw : Scissors v Scissors

def calc_score(enemy: str, you: str) -> int:
    return resolve_round(enemy, you) + get_worth(you)

print(sum([calc_score(enemy, you) for enemy,you in strategy_guide]))

# part 2

def get_winning_selection(enemy:str) -> str:
    match enemy:
        case 'A': return 'Y'
        case 'B': return 'Z'
        case 'C': return 'X'

def get_loosing_selection(enemy:str) -> str:
    match enemy:
        case 'A': return 'Z'
        case 'B': return 'X'
        case 'C': return 'Y'

def get_drawing_selection(enemy:str) -> str:
    match enemy:
        case 'A': return 'X'
        case 'B': return 'Y'
        case 'C': return 'Z'

def rigg_game(enemy:str, rigged:str) -> str:
    match rigged:
        case "X": return get_loosing_selection(enemy)
        case "Y": return get_drawing_selection(enemy)
        case "Z": return get_winning_selection(enemy)

rigged_rounds = [(enemy, rigg_game(enemy,you)) for enemy,you in strategy_guide]

print(sum([calc_score(enemy, you) for enemy,you in rigged_rounds]))
