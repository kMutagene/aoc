from treelib import Node, Tree
from pathlib import Path

class NodeType:
    def __init__(self, type, name, size = 0):
        self.type = type
        self.name = name
        self.size = size
    def __str__(self) -> str:
        if self.type == "dir":
            return f"{self.name} ({self.type})"
        else:
            return f"{self.name} ({self.type}, size={self.size})"
    def __repr__(self) -> str:
        return self.__str__()

tree = Tree()
root_node = NodeType("dir","\\")
tree.create_node(str(root_node), identifier="\\", data=root_node)  # root node

def change_directory(command:str, current_path:Path):
    match command.split():
        case ["cd", ".."]: 
            return current_path.parent
        case ["cd", "/"]: 
            return Path("\\")
        case ["cd", dir]: 
            path = current_path.joinpath(dir)
            # if not tree.contains(str(dir)) and str(path.parent) == "\\":
            #     node = NodeType("dir", str(path))
            #     tree.create_node(tag=str(node), identifier=str(path), parent=str(current_path), data=node)
            return path

def add_to_tree(current_path:Path, line:str):
    match line.split():
        case ["dir", dir_name]: 
            dir =  NodeType("dir", dir_name)
            path = current_path.joinpath(dir_name)
            # print(f'Dir: {dir}')
            # print(f'path: {path}')
            tree.create_node(tag=str(dir), identifier=str(path), parent=str(current_path), data=dir)
        case [size, file_name]: 
            file =  NodeType("file", Path(file_name).name, int(size))
            path = current_path.joinpath(file_name)
            # print(f'File: {file}')
            # print(f'path: {path}')
            tree.create_node(tag=str(file), identifier=str(path), parent=str(current_path), data=file)
            

is_dir_content = False
current_path = Path("\\")

with open("input.txt","r") as f:
    for line in f:
        clean = line.replace("\n","")
        # print(f'current path: {current_path}')
        # print(f'line: {clean}')
        if clean.startswith('$'):
            is_dir_content = not is_dir_content
            command = clean.replace("$ ","")
            if command == "ls":
                is_dir_content = True
            else:
                current_path = change_directory(command, current_path)
        elif is_dir_content:
            # print(f'dir content: {clean}')
            add_to_tree(current_path, clean)
        # print("tree:")
        # tree.show()

tree.show()
folder_ids = [node.identifier for node in tree.all_nodes() if node.data.type == "dir"]
subtrees = {
    id: tree.subtree(id) for id in folder_ids
}

folder_sizes = {
    id: sum([node.data.size for node in subtree.all_nodes()])
        for (id,subtree) in subtrees.items()
}

result = sum([size for folder,size in folder_sizes.items() if size <= 100000])

print(result)

# part 2

free_space = 70000000 - max([size for _,size in folder_sizes.items()])

space_needed = 30000000 - free_space

smallest_deletable_folder = [size for id, size in folder_sizes.items() if size >= space_needed]

print(sorted(smallest_deletable_folder)[0])
