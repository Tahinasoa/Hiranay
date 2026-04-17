from flask import Flask, render_template, request, redirect
from flask_socketio import SocketIO
import json

import os.path
from os import listdir
import sys
from formatter import format

import re
import unicodedata

app = Flask(__name__)
appRootPath = os.path.dirname(__file__)

@app.route("/")
@app.route("/index")
def index():
    #getting and formating books
    sourcesPath = os.path.join(appRootPath, "sources")
    data = listdir(sourcesPath) #book are directories in «sources»
    data.sort()
    data = [{"bookName" : i, "songs" : []} for i in data] #songs containes list of object {path : "?", title}
    for book in data :
        bookPath = os.path.join(sourcesPath, book["bookName"])
        songs = listdir(bookPath)
        #sorting songs in numeric order
        paired = [] #sorting variable
        for s in songs :
            match = re.search(r"(\d+)" , s)
            num = -1
            if match :
                num = int(match.group(1))
            paired.append((num, s))
        
        paired.sort(key=lambda x: (x[0] != -1, x[0], unicodedata.normalize("NFD", x[1])))
        songs = [x[1] for x in paired]

        for song in songs :
            path = os.path.join(book["bookName"], song)
            editorUrl = "/editor/{}/{}".format(book["bookName"], song) #song is the filename
            with open(os.path.join(sourcesPath,path), "r") as f :
                f.readline()
                title = f.readline().strip() #read the second line
            song = {"path" : path,
                    "title" : title,
                    "editorUrl" : editorUrl}

            book["songs"].append(song)
    return render_template('index.html', data=data)


@app.route("/hira/<collection>/<filename>", methods=["GET"])
def getLyric(collection,filename) :
    filepath = os.path.join(appRootPath,"sources/{}/{}".format(collection, filename))

    if os.path.isfile(filepath) :
        with open(filepath, "r") as f: 
            return format(f.read(), appRootPath) #formater.format

        return
    else :
        return "The file : {} in {} does not exist".format(filename, collection)

#Get the editor
@app.route("/editor/<collection>/<filename>", methods=["GET"])
def editor(collection, filename):
    filepath = os.path.join(appRootPath,"sources/{}/{}".format(collection, filename))
    if os.path.isfile(filepath) :
        with open(filepath, "r") as f:
            text = f.read()
            return render_template('editor.html',text=text, collection=collection, filename=filename)
    else :
        return "The file : {} in {} does not exist".format(filename, collection)

    return "<h1>Bad URL</h1>"


@app.route("/editor/save", methods=["POST"])
def saveChanges():
    if "collection" in request.form and request.form["collection"] != "" and\
        "filename" in request.form and request.form["filename"] != "" and\
        "text" in request.form and request.form["text"] != "" :
            collection = request.form["collection"]
            filename = request.form["filename"]
            filepath = os.path.join(appRootPath,"sources/{}/{}".format(collection, filename)) ;
            if os.path.isfile(filepath) :
                with open(filepath, "w") as f:
                    f.write(request.form["text"])
                
                msg = {}
                msg["code"] = 2
                msg["collection"] = collection
                msg["filename"] = filename
                socket.emit("message", json.dumps(msg), ) #reload every slides
            else :
                pass
                #todo we create the file
            return "ok"
    return "bad request"

###############
#socketio
###############


socket = SocketIO(app)

@socket.on("message")
def handle_message(data) :
    socket.emit("message", data, broadcast=True, include_self=False)

if __name__ == "__main__" :
    print("server is running on port : 5000")
    socket.run(app, host="0.0.0.0", port=5000)