from itertools import pairwise
from dataclasses import dataclass, field
import os 
import time

@dataclass
class Coordinate:
    x: int
    y: int
    occupied: str = "."

    @staticmethod
    def of_str(s:str):
        splt = s.split(",")
        return Coordinate(int(splt[1]), int(splt[0]))

@dataclass
class Cave:
    min_row: int = 0
    max_row: int = 0
    min_col: int = 0
    max_col: int = 0
    sand_fallen: int = 0
    sand_source_row: int = 0
    sand_source_col:int = 0
    is_abyss: bool = False
    grid: list[list[Coordinate]] = field(default_factory=list) 

    @staticmethod
    def init(min_row, max_row, min_col, max_col, sand_source_row, sand_source_col):
        grid = [[ Coordinate(row,col) for col in range(max_col + 2)] for row in range(max_row+1)]
        grid[sand_source_row][sand_source_col].occupied = '+'
        return Cave(
            min_row= min_row,
            max_row= max_row,
            min_col= min_col,
            max_col= max_col,
            sand_source_row= sand_source_row,
            sand_source_col= sand_source_col,
            grid= grid
        )

    def format_grid(self):
        return '\n'.join([f'{r_index}: ' + ''.join([c.occupied for c in row[self.min_col-1:]]) for r_index, row in enumerate(self.grid[self.min_row:])])

    def draw(self, current_row, current_col):
        time.sleep(0.001)
        os.system('cls')
        print(f'current position: {current_row, current_col}')
        print(f'sand at rest: {self.sand_fallen}')
        print(f'terminated?: {self.is_abyss}')
        print(self.format_grid())

    def set_sand(self,row,col):
        self.grid[row][col].occupied = "o"

    def clear_sand(self,row,col):
        self.grid[row][col].occupied = "."

    def is_occupied(self,row,col):
        return self.grid[row][col].occupied != "."

    def move_sand(self, draw:bool):
        if self.grid[self.sand_source_row][self.sand_source_col].occupied == "o":
            self.is_abyss = True
            if draw: self.draw(self.sand_source_row, self.sand_source_col)
            return None
        elif not self.is_abyss:
            row = self.sand_source_row
            col = self.sand_source_col
            self.set_sand(row,col)
            while row < self.max_row:
                if not self.is_occupied(row+1, col):
                    self.clear_sand(row,col)
                    row+=1
                    self.set_sand(row,col)
                    if draw: self.draw(row, col)
                elif not self.is_occupied(row+1, col-1):
                    self.clear_sand(row,col)
                    row+=1
                    col-=1
                    self.set_sand(row,col)
                    if draw: self.draw(row, col)
                elif not self.is_occupied(row+1, col+1):
                    self.clear_sand(row,col)
                    row+=1
                    col+=1
                    self.set_sand(row,col)
                    if draw: self.draw(row, col)
                else:
                    # sand is at rest
                    self.sand_fallen += 1
                    if draw: self.draw(row, col)
                    return None

            if row >= self.max_row:
                self.is_abyss = True

from itertools import chain

def parse_input():
    rocks: list[list[Coordinate]] = []
    with open("input.txt","r") as f:
        for line in f:
            splt = line.replace("\n","").split(" -> ")
            r = []
            for rock in [Coordinate.of_str(s) for s in splt]:
                r.append(rock)
            rocks.append(r)
    min_row = 0
    max_row = max(chain(*rocks), key=lambda r: r.x).x
    min_col = min(chain(*rocks), key=lambda r: r.y).y
    max_col = max(chain(*rocks), key=lambda r: r.y).y

    print(min_row, max_row, min_col, max_col)

    cave = Cave.init(
        min_row= min_row,
        max_row= max_row,
        min_col= min_col,
        max_col= max_col,
        sand_source_row = 0,
        sand_source_col = 500,
    )

    for path in rocks:
        for (r1, r2) in pairwise(path):
            if r1.x == r2.x:
                for y in range(min(r1.y, r2.y), 1 + (max(r1.y, r2.y))):
                    cave.grid[r1.x][y].occupied = "#"
            elif r1.y == r2.y:
                for x in range(min(r1.x, r2.x), 1 + (max(r1.x, r2.x))):
                    cave.grid[x][r1.y].occupied = "#"
                

    return cave


cave = parse_input()

while not cave.is_abyss:
    cave.move_sand(False)

print(cave.sand_fallen)

# part2: add a bottom line

def parse_input2():
    rocks: list[list[Coordinate]] = []
    with open("input.txt","r") as f:
        for line in f:
            splt = line.replace("\n","").split(" -> ")
            r = []
            for rock in [Coordinate.of_str(s) for s in splt]:
                r.append(rock)
            rocks.append(r)

    min_row = 0
    max_row = max(chain(*rocks), key=lambda r: r.x).x + 2
    min_col = min(chain(*rocks), key=lambda r: r.y).y - max_row
    max_col = max(chain(*rocks), key=lambda r: r.y).y + max_row
    rocks.append([Coordinate(max_row, min_col), Coordinate(max_row, max_col)])

    print(min_row, max_row, min_col, max_col)

    cave = Cave.init(
        min_row= min_row,
        max_row= max_row,
        min_col= min_col,
        max_col= max_col,
        sand_source_row = 0,
        sand_source_col = 500,
    )

    for path in rocks:
        for (r1, r2) in pairwise(path):
            if r1.x == r2.x:
                for y in range(min(r1.y, r2.y), 1 + (max(r1.y, r2.y))):
                    cave.grid[r1.x][y].occupied = "#"
            elif r1.y == r2.y:
                for x in range(min(r1.x, r2.x), 1 + (max(r1.x, r2.x))):
                    cave.grid[x][r1.y].occupied = "#"
                

    return cave

cave2 = parse_input2()

while not cave2.is_abyss:
    cave2.move_sand(False)

print(cave2.sand_fallen)