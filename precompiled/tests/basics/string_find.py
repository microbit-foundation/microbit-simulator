print("hello world".find("ll"))
print("hello world".find("ll", None))
print("hello world".find("ll", 1))
print("hello world".find("ll", 1, None))
print("hello world".find("ll", None, None))
print("hello world".find("ll", 1, -1))
print("hello world".find("ll", 1, 1))
print("hello world".find("ll", 1, 2))
print("hello world".find("ll", 1, 3))
print("hello world".find("ll", 1, 4))
print("hello world".find("ll", 1, 5))
print("hello world".find("ll", -100))
print("0000".find('0'))
print("0000".find('0', 0))
print("0000".find('0', 1))
print("0000".find('0', 2))
print("0000".find('0', 3))
print("0000".find('0', 4))
print("0000".find('0', 5))
print("0000".find('-1', 3))
print("0000".find('1', 3))
print("0000".find('1', 4))
print("0000".find('1', 5))
# print("aaaaaaaaaaa".find("bbb", 9, 2))

try:
    'abc'.find(1)
    print("FAIL")
    raise SystemExit
except TypeError as e:
    pass

print("PASS")