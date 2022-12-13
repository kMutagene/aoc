# AOC 2022

For this AOC, i will use `Python`. Specifically, python via the [miniconda]() dist.

in python/conda, you use environments to manage packages etc. The steps to create such an from scratch environment are:

- `conda create --name aoc2022` to create the environment
- `conda ativate aoc2022` to activate it
- `conda install <package name>` to install a package.

To re-use this env on another computer:
- save it as a `requirements.txt` file via `conda list -e > requirements.txt`
- load it on another computer via `conda create --name aoc2022 --file requirements.txt`

## Some notes on used packages and approaches

### day07 - No Space Left On Device

To create the directory tree structure, [treelib](https://treelib.readthedocs.io/en/latest/) was used as a simple implementation of a tree structure (without all the numpy/scipy overhead). Subtrees for the folders where then extracted and the file sizes contained where subsequently aggregated.

### day08 - Treetop Tree House

used [plotly](https://plotly.com/python/) for visualizing the height map of the trees.

for easier iteration regarding visualization, the puzzle was completed in a notebook instead of a `.py` script.

### day09 - Rope Bridge

used [plotly](https://plotly.com/python/) for visualizing the movement of the knots. Also played around with animation (turns out it takes forever for large amount of frames)

for easier iteration regarding visualization, the puzzle was completed in a notebook instead of a `.py` script.

### day10 - Cathode-Ray Tube

used [plotly](https://plotly.com/python/) for visualizing the pixels drawn onto the crt screen.

for easier iteration regarding visualization, the puzzle was completed in a notebook instead of a `.py` script.

## day11 - Monkey in the Middle

part 2 was very tough and needed a mathematical trick: As the checks of the monkeys use modulo arithmetic, one can use the numbers for division checks used by all monkeys, multiply them, and calculate the modulo of the items with that number to keep the numbers from integer overflows. I admit that i looked this up on the internetz.

## day12 - Hill Climbing Algorithm

Used [networkx](https://networkx.org/) to create graphs and calculate shortest path lengths
