import nltk

Kapital = open('FreudTraumdeutung.txt', 'rU', encoding="utf-8-sig")
raw = Kapital.read()

# tokenize raw text
tokens = nltk.word_tokenize(raw)

# create NLTK text from the tokens in order to perform all the linguistic processing that NLTK allows us to do
text = nltk.Text(tokens)

tmp = text.concordance('Traum', width=100, lines=50)

print(tmp)


# calculate length of text (in words)
WordCount = len(tokens)
print("Words:", WordCount)

# calculate frequency distribution
fdist = nltk.FreqDist(tokens)
print("Most frequent words:", fdist.most_common(10))
print("Traum:", fdist['Traum'])
print("Frequency of 'Arbeiter':", fdist.freq('Traum'))

# fdist.plot()

# dispersion plot
text.dispersion_plot(["Traum", "Geld"])

# print(raw)
