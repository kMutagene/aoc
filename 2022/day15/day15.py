from __future__ import annotations
from dataclasses import dataclass, field
import re

@dataclass
class Coordinate:
    x:int
    y:int

    @staticmethod
    def manhattan_distance(c1: Coordinate, c2: Coordinate):
        return manhattan_distance(c1.x, c2.x, c1.y, c2.y)

def manhattan_distance(x1: int, x2: int, y1: int, y2: int):
    return abs(x1-x2) + abs(y1-y2)

def manhattan_radius(c: Coordinate, distance: int, y: int):
    points_in_distance: list[Coordinate] = []
    for x in range(c.x - distance, c.x + distance + 1):
        if manhattan_distance(c.x, x, c.y, y) <= distance:
            points_in_distance.append(Coordinate(x,y))
    return points_in_distance

input_regex = re.compile(r'Sensor at x=(?P<sensor_x>-?\d+), y=(?P<sensor_y>-?\d+): closest beacon is at x=(?P<beacon_x>-?\d+), y=(?P<beacon_y>-?\d+)')
def parse_input_line(line:str):
    re_match = input_regex.match(line)
    sensor = Coordinate(int(re_match.group("sensor_x")), int(re_match.group("sensor_y")))
    beacon = Coordinate(int(re_match.group("beacon_x")), int(re_match.group("beacon_y")))
    return sensor, beacon


def parse_input():
    beacons = []
    sensors = []
    distances = []
    with open("input.txt","r") as f:
        for line in f:
            s, b = parse_input_line(line.replace("\n",""))
            d = Coordinate.manhattan_distance(s, b)
            beacons.append(b)
            sensors.append(s)
            distances.append(d)
    return beacons, sensors, distances

beacons, sensors, distances = parse_input()

from itertools import chain

max_x = max(chain(beacons, sensors), key=lambda c: c.x).x
max_y = max(chain(beacons, sensors), key=lambda c: c.y).y

line_of_interest = 2000000
occupied = []
beacons_in_occupied = list(map(lambda c: c.x, filter(lambda c: c.y == line_of_interest, beacons)))

# for distance,sensor in zip(distances,sensors):
#     radius = manhattan_radius(sensor, distance, line_of_interest)
#     for c in radius:
#         if c.y == line_of_interest and c.x not in beacons_in_occupied:
#             occupied.append(c.x)

# print(len(set((occupied))))

# part2

# calculate points outside of sensor range (distance + 1):

max_range = 4000000

def distinct(l):
    d = []
    for x in l:
        if x not in d:
            d.append(x)
    return d

def outside_manhattan_radius(c:Coordinate, distance):
    print("calculating outside radius")
    radius = []
    for x in range(c.x - (distance + 1), c.x + (distance + 2)):
        if x < max_range and x > 0:
            y_dist = distance + 1 - abs(c.x - x)
            yp = c.y + y_dist
            yn = c.y - y_dist
            if yp < max_range and yp > 0:
                radius.append((x, c.y + y_dist))
            if yn < max_range and yn > 0:
                radius.append((x, c.y - y_dist))
    return list(map(lambda xy: Coordinate(xy[1],xy[0]), set(radius)))

outside_radii = [] 

iters = 0

for s,d in zip(sensors,distances):
    print(iters)
    iters += 1
    r = outside_manhattan_radius(s, d)
    for p in r:
        outside_radii.append(p)

# for each point in outside_radii, check wether another sensor can detect it. hopefully only one will stay.

print("start filtering")

filter_iters = 0

for s,d in zip(sensors,distances):
    print(filter_iters)
    filter_iters += 1
    outside_radii = list(filter(lambda c: Coordinate.manhattan_distance(s,c) > d, outside_radii))
    print(len(outside_radii))

distress_signal = distinct(list(outside_radii))[0]

print((distress_signal.x * 4000000) + distress_signal.y)