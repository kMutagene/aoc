import numpy as np

def parse_input():
    cubes = []
    with open("input.txt","r") as f:
        for line in f:
            splt = line.rstrip().split(",")
            cubes.append((int(splt[0]), int(splt[1]), int(splt[2])))
    return cubes

cubes = parse_input()

max_x = max(map(lambda c: c[0], cubes))
max_y = max(map(lambda c: c[1], cubes))
max_z = max(map(lambda c: c[2], cubes))

grid = np.pad(np.zeros((max_x,max_y,max_z)),2) # use padded grid so we do not have to do border checks in 3d space

def get_neighbours(grid,x,y,z) -> list[tuple[tuple[int,int,int],int]]:
    n = [
        ((x+1, y, z), grid[x+1][y][z]),
        ((x+1, y, z), grid[x-1][y][z]),
        ((x, y+1, z), grid[x][y+1][z]),
        ((x, y+1, z), grid[x][y-1][z]),
        ((x, y, z+1), grid[x][y][z+1]),
        ((x, y, z+1), grid[x][y][z-1])
    ]
    return n

faces = 0

for (x,y,z) in cubes:
    sides = 6
    neighbours = get_neighbours(grid, x+1, y+1, z+1)
    for (n_x, n_y, n_z), n_sides in neighbours:
        if n_sides > 0:
            sides = sides - 1
            grid[n_x][n_y][n_z] = max(0,grid[n_x][n_y][n_z] - 1)
    grid[x+1][y+1][z+1] = max(0,sides)

print(np.sum(grid))