from __future__ import annotations
from dataclasses import dataclass, field
from typing import Literal
from itertools import chain
import os, time

@dataclass
class Coordinate:
    row:int
    col:int
    occupation: Literal["@",".","#"]

@dataclass
class Cave:
    contents: list[list[str]] = field(default_factory=list) 
    dim_row = 0
    dim_col = 7
    highest_rock = 0
    highest_rock_row = 0
    rocks_fallen = 0

    def determine_highest_rock(self):
        for i,row in enumerate(self.contents):
            if "#" in row:
                self.highest_rock = self.dim_row - i
                self.highest_rock_row = i
                break

    def add_row(self):
        self.dim_row = self.dim_row + 1
        row = [["." for _ in range(self.dim_col)]]
        if self.contents == []:
            self.contents = row
        else:
            row.extend(self.contents)
            self.contents = row 

    def remove_row(self):
        if self.dim_row > 0:
            self.dim_row = self.dim_row - 1
            self.contents.pop(0)

    def set_content(self,row:int, col:int, occupation:str):
        self.contents[row][col] = occupation

    def spawn_shape(self, shape_type: Literal["+", "-", "L", "|", "o"]):
        s = Shape.create(shape_type)
        empty_space = self.dim_row - self.highest_rock
        # print("\n")
        # print(f"cave height is {self.dim_row}, highest rock is {self.highest_rock}")
        # print(f"spawning shape {shape_type} of height {s.dim_row}")
        # print(f"empty space is {empty_space}")
        if empty_space <= (3 + s.dim_row):
            # print(f"adding {len(list(range(3 + s.dim_row - empty_space)))} new lines")
            for _ in range(3 + s.dim_row - empty_space):
                self.add_row()
        if empty_space > (3 + s.dim_row):
            # print(f"removing {len(list(range(abs(3 + s.dim_row - empty_space))))} lines")
            for _ in range(abs(3 + s.dim_row - empty_space)):
                self.remove_row()
        for r in s.contents:
            for c in r:
                self.set_content(c.row, c.col, c.occupation)
        return s

    def format_grid(self):
        return '\n'.join([''.join([c for c in row]) for row in self.contents])

    def draw(self, sleep_time):
        time.sleep(sleep_time)
        os.system('cls')
        print(f"rocks fallen: {self.rocks_fallen}, highest rock: {self.highest_rock}, highest rock row: {self.highest_rock_row}, dimensions: {self.dim_row, self.dim_col}")
        print(self.format_grid())

@dataclass
class Shape:
    contents: list[list[Coordinate]]
    shape_type: Literal["+", "-", "L", "|", "o"]
    state: Literal["moving", "rested"]
    dim_row: int
    dim_col: int
    highest_col: int

    def __str__(self) -> str:
        return '\n'.join([''.join([c.occupation for c in row]) for row in self.contents])

    def __repr__(self) -> str:
        return self.__str__()

    def get_highest_point(self):
        print(self.contents[0][self.highest_col])
        return self.contents[0][self.highest_col].row

    def get_edge(self, direction:Literal["<",">","down"]) -> list[Coordinate]:
        edge = []
        match direction:
            case ">":
                for row in self.contents:
                    for c in reversed(row):
                        if c.occupation == "@":
                            edge.append(c)
                            break
                return edge
            case "<":
                for row in self.contents:
                    for c in row:
                        if c.occupation == "@":
                            edge.append(c)
                            break
                return edge
            case "down":
                for col_index in range(self.dim_col):
                    for row_index in list(reversed(range(self.dim_row))):
                        c = self.contents[row_index][col_index]
                        if c.occupation == "@":
                            edge.append(c)
                            break
                return edge

    def move(self, cave: Cave, direction:Literal["<",">","down"]):
        edge = self.get_edge(direction=direction)
        collision = False
        match direction:
            case ">":
                for c in edge:
                    if c.col == cave.dim_col - 1 or cave.contents[c.row][c.col+1] != ".": collision = True
                if not collision:
                    for row in self.contents:
                        for block in row:
                            if block.occupation != ".":
                                cave.set_content(block.row, block.col, ".")
                            block.col = block.col + 1
                        for block in row:
                            if block.occupation != ".":
                                cave.set_content(block.row, block.col, block.occupation)
            case "<":
                for c in edge:
                    if c.col == 0 or cave.contents[c.row][c.col-1] != ".": collision = True
                if not collision:
                    for row in self.contents:
                        for block in row:
                            if block.occupation != ".":
                                cave.set_content(block.row, block.col, ".")
                            block.col = block.col - 1
                        for block in row:
                            if block.occupation != ".":
                                cave.set_content(block.row, block.col, block.occupation)
        
            case "down":
                for c in edge:
                    if c.row == cave.dim_row - 1 or cave.contents[c.row+1][c.col] != ".": 
                        collision = True
                        for row in self.contents:
                            for block in row:
                                if block.occupation == "@":
                                    block.occupation = "#"
                if collision:
                    self.state = "rested"
                    cave.rocks_fallen += 1
                    for row in self.contents:
                        for block in row:
                            if block.occupation != ".":
                                cave.set_content(block.row, block.col, block.occupation)
                    cave.determine_highest_rock()
                else:
                    for row in reversed(self.contents):
                        for block in row:
                            if block.occupation != ".":
                                cave.set_content(block.row, block.col, ".")
                            block.row = block.row + 1
                        for block in row:
                            if block.occupation != ".":
                                cave.set_content(block.row, block.col, block.occupation)


    @staticmethod
    def create(shape_type: Literal["+", "-", "L", "|", "o"]) -> Shape:
        match(shape_type):
            case "+":
                return Shape(
                    contents=[
                        [Coordinate(0,2,"."), Coordinate(0,3,"@"), Coordinate(0,4,".")],
                        [Coordinate(1,2,"@"), Coordinate(1,3,"@"), Coordinate(1,4,"@")],
                        [Coordinate(2,2,"."), Coordinate(2,3,"@"), Coordinate(2,4,".")]
                    ],
                    shape_type=shape_type, state="moving", dim_col=3,dim_row=3,highest_col=1
                )            
            case "-":
                return Shape(
                    contents=[
                        [Coordinate(0,2,"@"), Coordinate(0,3,"@"), Coordinate(0,4,"@"), Coordinate(0,5,"@")]
                    ],
                    shape_type=shape_type, state="moving", dim_col=4,dim_row=1, highest_col=0
                )
            case "L":
                return Shape(
                    [
                        [Coordinate(0,2,"."), Coordinate(0,3,"."), Coordinate(0,4,"@")],
                        [Coordinate(1,2,"."), Coordinate(1,3,"."), Coordinate(1,4,"@")],
                        [Coordinate(2,2,"@"), Coordinate(2,3,"@"), Coordinate(2,4,"@")]
                    ],
                    shape_type=shape_type, state="moving", dim_col=3,dim_row=3,highest_col=2
                )
            case "|":
                return Shape(
                    contents=[
                        [Coordinate(0,2,"@")],
                        [Coordinate(1,2,"@")],
                        [Coordinate(2,2,"@")],
                        [Coordinate(3,2,"@")]
                    ],
                    shape_type=shape_type, state="moving", dim_col=1,dim_row=4,highest_col=0
                )            
            case "o":
                return Shape(
                    contents=[
                        [Coordinate(0,2,"@"), Coordinate(0,3,"@")],
                        [Coordinate(1,2,"@"), Coordinate(1,3,"@")]
                    ],
                    shape_type=shape_type, state="moving", dim_col=2,dim_row=2,highest_col=0
                )            

SHAPE_ORDER = ["-", "+", "L", "|", "o"]
JET_PATTERN = []

p = list(open("input.txt").readline().rstrip())
# p = list(">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>")

for d in p:
    JET_PATTERN.append(d)
    JET_PATTERN.append("down")

print(JET_PATTERN)

def fall_loop(shape_index:int, jet_index:int, cave: Cave, rock_amount:int, sleep_time:int, draw: bool):
    while cave.rocks_fallen < rock_amount:
        # if not draw: 
        #     print(f"fallen: {cave.rocks_fallen}, height: {cave.highest_rock}")
        current_shape = cave.spawn_shape(SHAPE_ORDER[shape_index])
        if draw: cave.draw(sleep_time)
        while current_shape.state == "moving":
            # one can use this to check cyclic behaviour
            # if jet_index == 0 and shape_index == 0:
            #     print(cave.highest_rock, cave.rocks_fallen)
            move = JET_PATTERN[jet_index]
            current_shape.move(cave, move)
            if jet_index < len(JET_PATTERN) - 1:
                jet_index += 1
            else:
                jet_index = 0
            if draw: 
                cave.draw(sleep_time)
                print(f"moved: {move}")
        if shape_index < len(SHAPE_ORDER) - 1:
            shape_index += 1
        else:
            shape_index = 0
    return cave.highest_rock


# print("+", Shape.create("+").get_edge("down"))
# print("-", Shape.create("-").get_edge("down"))
# print("L", Shape.create("L").get_edge("down"))
# print("|", Shape.create("|").get_edge("down"))
# print("o", Shape.create("o").get_edge("down"))

height = fall_loop(0,0,cave=Cave(),rock_amount=2022, draw=False, sleep_time=0.5)

print(height)

# part 2:
# one can determine the cyclic behaviour by observing occurences of shape and jet index = 0:
# for the input:
# height | rocks fallen
# 0 0
# 2622 1695
# 5245 3395
# 7868 5095
# 10491 6795
# 13114 8495
# 15737 10195
# 18360 11895
# 20983 13595
# 23606 15295
# 26229 16995

# the cycle starts at 1695 fallen rocks with a height of 2622.
# after that, for every 2000 rocks fallen the stack grows by 2623 units. 
# so, starting at 1695 rocks fallen,  1_000_000_000_000 - 2000 times 2623 units are added. 
# after that, the stack grows another (2000-1695) cacles.
# this means that the result should be:

# initial_height = 2622
# remaining_cylces = 1_000_000_000_000 - 2000
# cyclic_tower_height = (remaining_cylces / 2000) * 2623
# remaining_cycles = 2000-1695
# remaining_height = fall_loop(0,0,cave=Cave(),rock_amount=remaining_cycles, draw=False, sleep_time=0.5)

# print(initial_height + cyclic_tower_height + remaining_height)

# this is wrong, as the 2000 cycle is wrong (see line6 which is only a cycle of 1000).
# actual cycle length is 17000 (see output of the solution copied from the internet as well)

# the idea wa snot wrong, but i can currently not be bothered to determine the cycle programmatically.