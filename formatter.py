from string import Template
from sys import argv
import os

def getPart(src, kwrd) :
	title=""
	for c in src:
		if kwrd in c and c !=kwrd:
			title= c[len(kwrd)+1:]
			src.remove(c)
			return title
	return title
	

def formatSection(src, className) :
	src=src.replace("\n","<br/>\n")
	src = "\n<section><p class='"+className+"' >\n"+src+"\n</p></section>\n"
	return src

def format(sourceText, appRootPath):
	sourceText = [i.strip("\n") for i in sourceText.split("\n\n")]
	
	title = getPart(sourceText, "[TITLE.]")
	documentTitle = title
	if title :
		title = "<section><h1>{}</h1></section>".format(title)
      
	fiv=[]
	fivTmp = getPart(sourceText, "[FIV.]")
	while fivTmp != "" :
		fiv.append(fivTmp)
		fivTmp = getPart(sourceText, "[FIV.]")
	
	content=[]
	for i in sourceText :
		if i != "[FIV.]" :
			content.append(formatSection(i,"myText"))
		else :
			for j in fiv :
				content.append(formatSection(j,"myText fiv"))

	content = "".join(content)
	
	with open(os.path.join(appRootPath,"templates/lyrics.html"),"r") as templateFile :
		txt = templateFile.read()
		template = Template(txt)

	out = template.substitute(DOCUMENT_TITLE = documentTitle, TITLE=title, CONTENT=content)
	return out