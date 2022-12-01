# AOC 2022

For this AOC, i will use `Python`. Specifically, python via the [miniconda]() dist.

in python/conda, you use environments to manage packages etc. The steps to create such an from scratch environment are:

- `conda create --name aoc2022` to create the environment
- `conda ativate aoc2022` to activate it
- `conda install <package name>` to install a package.

To re-use this env on another computer:
- save it as a `requirements.txt` file via `conda list -e > requirements.txt`
- load it on another computer via `conda create --name aoc2022 --file requirements.txt`