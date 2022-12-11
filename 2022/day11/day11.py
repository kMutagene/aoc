from __future__ import annotations
from typing import Callable
import os

def parse_operation(steps: list[str]):
    match(steps):
        case ["new", "=", "old", "*", multiplier]:
            if multiplier == "old":
                operation: Callable[[int], int] = lambda old: old * old
                return operation        
            else:
                operation: Callable[[int], int] = lambda old: old * int(multiplier)
                return operation        
        case ["new", "=", "old", "+", addition]:
            if addition == "old":
                operation: Callable[[int], int] = lambda old: old + old
                return operation
            else:
                operation: Callable[[int], int] = lambda old: old + int(addition)
                return operation

def get_test_condition(test: list[str]):
    match test:
        case ["divisible", "by", divisor]:
            test_op: Callable[[int],bool] = lambda item: item % int(divisor) == 0
            return test_op

class Monkey():
    def __init__(self, id: int, items: list[int], operation: list[str], test_operation: list[str], if_true_monkey: int, if_false_monkey: int):
        self.id = id
        self.inspection_count = 0
        self.items = items 
        self.operation = operation
        self.test_operation = test_operation
        self.if_true_monkey = if_true_monkey
        self.if_false_monkey = if_false_monkey

    def inspect_item(self, item:int):
        self.inspection_count += 1
        return parse_operation(self.operation)(item)

    def test(self, item:int):
        return get_test_condition(self.test_operation)(item)

    def inspect_and_throw_item(self, monkeys:dict[int,Monkey], reduce_concern:bool, lcm:int = 1):
        if len(self.items) == 0: 
            pass
        else:
            item = 0
            if reduce_concern:
                item = self.inspect_item(self.items.pop()) // 3 
            else:
                item = self.inspect_item(self.items.pop()) % lcm
            if self.test(item):
                monkeys[self.if_true_monkey].items.append(item)
            else:
                monkeys[self.if_false_monkey].items.append(item)

    def __str__(self) -> str:
        return f'Monkey {self.id} (inspected {self.inspection_count} times):{os.linesep}Items:{self.items}{os.linesep}Operation: {self.operation}{os.linesep}Test: {self.test_operation} (t:{self.if_true_monkey}, f:{self.if_false_monkey})'

    def __repr__(self) -> str:
        return self.__str__()


def init_monkeys() -> tuple[dict[int,Monkey], int]:
    monkeys = {}
    with open("input.txt","r") as f:
        monkey_id: int = 0
        items: list[int] = []
        operation: list[str] = []
        test_operation: list[str] = []
        if_true_monkey = 0
        if_false_monkey = 0
        divisible: list[int] = []
        for line in f:
            match (line.split()):
                case []: monkeys[monkey_id] = Monkey(monkey_id, items, operation, test_operation, if_true_monkey, if_false_monkey)
                case ["Monkey", m]: monkey_id = int(m.replace(":",""))
                case ["Starting", "items:", *starting_items]: items = [int(i.replace(",","")) for i in starting_items]
                case ["Operation:", *operation_steps]: operation = operation_steps
                case ["Test:", *test_operation_steps]: 
                    test_operation = test_operation_steps
                    divisible.append(int(test_operation_steps[-1]))
                case ["If", "true:", "throw", "to", "monkey", m]: if_true_monkey = int(m)
                case ["If", "false:", "throw", "to", "monkey", m]: if_false_monkey = int(m)
        monkeys[monkey_id] = Monkey(monkey_id, items, operation, test_operation, if_true_monkey, if_false_monkey)
    return monkeys, divisible

monkeys1,_ = init_monkeys()

def round1():
    for m_id,monkey in monkeys1.items():
        while len(monkey.items) > 0:
            monkey.inspect_and_throw_item(monkeys1, True)

for i in range(20):
    round1()

result1 = sorted([monkey.inspection_count for _,monkey in monkeys1.items()], reverse=True)

print(result1[0] * result1[1])

monkeys2, div = init_monkeys()

import functools
lcm = functools.reduce(lambda a,b: a*b, div)
print(lcm)
def round2():
    for m_id,monkey in monkeys2.items():
        while len(monkey.items) > 0:
            monkey.inspect_and_throw_item(monkeys2, False, lcm)

for i in range(10000):
    round2()

result2 = sorted([monkey.inspection_count for _,monkey in monkeys2.items()], reverse=True)

print(result2[0] * result2[1])