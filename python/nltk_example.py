import nltk

Kapital = open('Traumdeutung.txt', 'rU', encoding="utf8")
raw = Kapital.read()

# tokenize raw text
tokens = nltk.word_tokenize(raw)

# TODO: CLEANUP - depunctuate, deuppercaseify, stopwords, stemming

# create NLTK text from the tokens in order to perform all the linguistic processing that NLTK allows us to do
text = nltk.Text(tokens)

tmp = text.concordance('unbewußt', 200, lines=50)

# print(tmp)


# calculate length of text (in words)
WordCount = len(tokens)
print("Words:", WordCount)

# calculate frequency distribution
fdist = nltk.FreqDist(tokens)
print("Most frequent words:", fdist.most_common(10))
print("unbewußt:", fdist['unbewußt'])

# dispersion plot
text.dispersion_plot(["Traum", "bewußt", "unbewußt", "Unbewußte", "unbewußte"])

# print(raw)
