import time
num = 100000
t = time.ticks_ms()

class Foo:

    def __init__(self):
        self.num = 200000

def test(num):
    o = Foo()
    i = 0
    while i < o.num:
        i += 1

test(num)
t = time.ticks_ms() - t
print("PASS: " + str(t))