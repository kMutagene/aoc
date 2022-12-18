import networkx as nx
import re
from dataclasses import dataclass
import time
# 1. create directed graph from input, with pressure released as node data and all edges having the weight 1

input_regex = re.compile(r'Valve (?P<source>\D+) has flow rate=(?P<flow_rate>\d+); tunnel[s]? lead[s]? to valve[s]? (?P<targets>\D*)')
    
def parse_input():
    G = nx.DiGraph()
    nodes = []
    edges = []
    with open("input.txt","r") as f:
        for line in f:
            re_match = input_regex.match(line)
            source = re_match.group("source")
            flow_rate = int(re_match.group("flow_rate"))
            targets = re_match.group("targets").split(", ")
            nodes.append((source, flow_rate))
            for t in targets:
                edges.append((source.replace("\n",""), t.replace("\n","")))

    for (n, fr) in nodes:
        G.add_node(n, pressure=fr, valve_state="closed")

    G.add_edges_from(edges)

    return G

G = parse_input()

print(G)

@dataclass
class CandidateNode:
    score: int
    distance: int
    name: str

paths = dict(nx.all_pairs_shortest_path_length(G))

def calculate_valve_score(time: int, distance: int, node: str) -> int:
    return (time - (distance + 1)) * G.nodes[node]["pressure"]

min_valve = min(p for n,p in list(G.nodes.data("pressure")) if p > 0)
print(min_valve)


best_path_p1 = None

# brute force, doe snot terminate though

def get_paths_p1(current_node: str, visited_nodes: list[str], score:int, time_left: int):
    global best_path_p1
    if best_path_p1 is None or score > best_path_p1[1] :
        best_path_p1 = visited_nodes, score
        print(best_path_p1)
    if time_left < 2:
        pass
    else:
        posible_moves = []
        for node, distance in paths[current_node].items():
            if G.nodes[node]["pressure"] > 0:
                posible_moves.append((node, distance))
        for node, distance in posible_moves:
            # print(node, distance)
            if distance < (time_left + 1) and not node in visited_nodes:
                move_score = calculate_valve_score(time_left, distance, node)
                get_paths_p1(node, visited_nodes + [node], (score + move_score), (time_left - distance - 1))

get_paths_p1("AA", [], 0, 30)

print(best_path_p1)

# maybe ill try part 2 in the future

# best_paths_p2 = []

# def get_paths_p2(current_node_me: str, current_node_elephant: str, visited_nodes_me: list[str], visited_nodes_elephant: list[str], score:int, time_left: int):
#     global best_path_p1
#     if best_path_p1 is None or score > best_path_p1[1] :
#         best_path_p1 = visited_nodes, score
#         print(best_path_p1)
#     if time_left < 2:
#         pass
#     else:
#         posible_moves = []
#         for node, distance in paths[current_node].items():
#             if G.nodes[node]["pressure"] > 0:
#                 posible_moves.append((node, distance))
#         for node, distance in posible_moves:
#             # print(node, distance)
#             if distance < (time_left + 1) and not node in visited_nodes:
#                 move_score = calculate_valve_score(time_left, distance, node)
#                 get_paths_p1(node, visited_nodes + [node], (score + move_score), (time_left - distance - 1))
