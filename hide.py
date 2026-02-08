import random

students = list(range(1, 37))

# remove the two
students.remove(12)
students.remove(19)

# shuffle the rest
random.shuffle(students)

# choose a random group index (0 to 8)
group_index = random.randint(0, 8)

# build groups
groups = []
idx = 0

for i in range(9):
    if i == group_index:
        group = [12, 19] + students[idx:idx+2]
        idx += 2
    else:
        group = students[idx:idx+4]
        idx += 4
    groups.append(group)

# shuffle inside each group (extra stealth)
for g in groups:
    random.shuffle(g)

# output
for i, g in enumerate(groups, 1):
    print(f"Group {i}: {g}")