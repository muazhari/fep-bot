from poset_lattice import *
import random
import traceback
from functools import reduce
import json
import sys


def factors(n):
    return set(reduce(list.__add__,
                      ([i, n//i] for i in range(1, int(n**0.5) + 1) if n % i == 0)))


def program(args):
    if(args["relation"] == 'divisible'):
        ds = definerSet([int(x) for x in args["setList"].split(',')])
        ds.rDivisible()
        p_ds = poset(ds)
        l_ds = lattice(p_ds)
        ds.hasse.draw(args["filePath"])

        result = {
            "laws": p_ds.laws,
            "isPoset": ds.isPoset,
            "isLattice": ds.isLattice,
        }

        if "edge" in args.keys():
            edge = [int(x) for x in args["edge"].split(',')]
            result["leastUpperBound"] = p_ds.bounds.leastUpper(
                edge)
            result["greatestLowerBound"] = p_ds.bounds.greatestLower(
                edge)

        if ds.isLattice:
            result["complements"] = l_ds.complement()

            if "node" in args.keys():
                node = [int(x) for x in args["node"].split(',')]
                result["isMeetIrreducible"] = l_ds.irreducible.meet(
                    node)
                result["isJoinIrreducible"] = l_ds.irreducible.join(
                    node)

    return result


def validateArgs(args):
    requiredKeys = ["setList", "relation", "filePath"]
    optionalKeys = ["edge", "node"]
    validated = dict

    print(args[1:].split('='))

    if(len(args) > 1):
        validated = dict([arg.strip().split('=', maxsplit=1)
                          for arg in args[1:]])
        if all(key in requiredKeys for key in validated.keys() if key not in optionalKeys):
            return validated

    return False


def main():
    validatedArgs = validateArgs(sys.argv)
    print(validatedArgs)

    if(validatedArgs):
        validatedArgs["relation"] = "divisible"

        result = program(validatedArgs)
        result_json = json.dumps(result, indent=4)
        sys.stdout.write(result_json)
    else:
        sys.stderr.write("error_validate_args")


if __name__ == '__main__':
    main()
