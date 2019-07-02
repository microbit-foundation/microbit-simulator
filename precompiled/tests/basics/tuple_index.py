a = (1, 2, 3)
print(a.index(1))
print(a.index(2))
print(a.index(3))
print(a.index(3, 2))
try:
    print(a.index(3, 2, 2))
except ValueError:
    pass
else:
    print("FAIL")
    raise SystemExit

a = a + a
b = (0, 0, a)
print(a.index(2))
print(b.index(a))
print(a.index(2, 2))

try:
    a.index(2, 2, 2)
except ValueError:
    print("PASS")
else:
    print("FAIL")
    raise SystemExit
