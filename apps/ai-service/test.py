a = {
    1 : "aa",
    77 : "fjfj"
}
print(a)

def abb(a:dict[int,str])->dict[int,str]:
    return f"hello , {a}"
    


b = abb({1:"ddd","b":"frr"})
print(b)