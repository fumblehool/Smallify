from flask import Flask, jsonify, render_template, request, session
import MySQLdb
import random, string

app = Flask(__name__)



@app.route("/")
def main():
    return render_template("index.html")


@app.route("/<shorturl>")
def renderUI(shorturl):
    c, conn = connection()
    query = "SELECT * FROM url WHERE shorturl="
    values = "'{0}'".format(str(shorturl))
    x = c.execute(query + values)
    if x:
        data = c.fetchall()
        return render_template("abc.html", url=str(data[0][2]), message=str(data[0][3]))
    else:
        return "x not found"
    return render_template("abc.html")


@app.route("/api/", methods=['GET', 'POST'])
def create_entry():
    if request.method == "POST":
        if request.json:
            data = request.json
            sourceurl = data.get("url")
            message = data.get("message")
            c, conn = connection()
            shorturl = randomword()
            query = "INSERT into url VALUES"
            values = "('{0}','{1}','{2}','{3}')"\
                .format("daman3", shorturl, sourceurl, message)
            c.execute(query + values)
            conn.commit()
            c.close()
            conn.close()
            return jsonify(shorturl=shorturl)
    return render_template("addurl.html")


@app.route("/api/<shorturl>")
def ShortUrl(shorturl):
    c, conn = connection()
    query = "SELECT * FROM url WHERE shorturl = "
    values = "'{0}'".format(str(shorturl))
    x = c.execute(query + values)
    if x:
        data = c.fetchall()
        return jsonify(username=data[0][0], url=data[0][2], message=data[0][3])
    else:
        return "not Found", 404


@app.route("/login/", methods=['GET', 'POST'])
def login():
    return "Login"


@app.route("/geturl/", methods=['GET', 'POST'])
def geturl():
    return render_template("geturl.html")


def connection():
    conn = MySQLdb.connect("localhost", "root", "Daman", "restapi")
    c = conn.cursor()

    return c, conn


def randomword():
    return ''.join(random.choice(string.lowercase) for i in range(7))


app.run(host="0.0.0.0", debug=True, port=7777)