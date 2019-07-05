    import re
    import string
    import json
sample = open('stdout.txt', 'rU', encoding="utf8")
sampleText = sample.read()
print(sampleText)

keyword = "unbewußt"
sampleText = re.sub(r"[-()\"#/@;:<>{}`+=~|.!?,«»]", "", sampleText)
tmpArray = sampleText.split()


count = 0
overall =[]
for i in range(len(tmpArray)):
    if tmpArray[i] == keyword:
        tmp =[]
        tmp = [tmpArray[i-7],tmpArray[i-6],tmpArray[i-5],tmpArray[i-4],tmpArray[i-3],tmpArray[i-2],tmpArray[i-1],tmpArray[i],
               tmpArray[i+1], tmpArray[i+2],tmpArray[i+3],tmpArray[i+4], tmpArray[i+5],tmpArray[i+6],tmpArray[i+7]]
        overall.append(tmp)

print(overall)
