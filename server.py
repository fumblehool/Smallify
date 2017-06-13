from flask import Flask, jsonify, render_template, request, \
    redirect, url_for, session
import MySQLdb
import random
import string
import requests
from config import secrets, Secret_Key, db
from flask.ext.script import Manager
from flask_oauth import OAuth


app = Flask(__name__)
manager = Manager(app)

GOOGLE_CLIENT_ID = secrets['GOOGLE_CLIENT_ID']
GOOGLE_CLIENT_SECRET = secrets['GOOGLE_CLIENT_SECRET']
REDIRECT_URI = secrets['REDIRECT_URI']
app.secret_key = Secret_Key

oauth = OAuth()

google = oauth.remote_app('google',
                          base_url='https://www.google.com/accounts/',
                          authorize_url='https://accounts.google.com/o/oauth2/auth',
                          request_token_url=None,
                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
                                                'response_type': 'code'},
                          access_token_url='https://accounts.google.com/o/oauth2/token',
                          access_token_method='POST',
                          access_token_params={'grant_type': 'authorization_code'},
                          consumer_key=GOOGLE_CLIENT_ID,
                          consumer_secret=GOOGLE_CLIENT_SECRET)


@app.route("/")
def main():
    access_token = session.get('access_token')
    if access_token is None:
        return render_template('index.html')

    access_token = access_token[0]
    url = "https://www.googleapis.com/oauth2/v1/userinfo"

    try:
        req = requests.get(url,
                           params=dict(access_token=access_token)
                           ).json()
        session['uid'] = req['id']
    except Exception:
        return redirect(url_for("login"))

    return render_template('home.html')


@app.route('/login')
def login():
    callback = url_for('authorized', _external=True)
    return google.authorize(callback=callback)


@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect(url_for('main'))


@google.tokengetter
def get_access_token():
    return session.get('access_token')


@app.route("/<shorturl>")
def renderUI(shorturl):
    c, conn = connection()
    query = "SELECT * FROM urls WHERE shorturl="
    values = "'{0}'".format(str(shorturl))
    x = c.execute(query + values)
    if x:
        data = c.fetchall()
        return render_template("abc.html",
                               url=str(data[0][2]),
                               message=str(data[0][3]))
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
            query = "INSERT into urls VALUES"
            values = "('{0}','{1}','{2}','{3}')"\
                .format(session['uid'], shorturl, sourceurl, message)
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


@app.route("/geturl/", methods=['GET', 'POST'])
def geturl():
    return render_template("geturl.html")


def connection():
    conn = MySQLdb.connect(db["host"], db["user"], db["password"],
                           db["database"])
    c = conn.cursor()

    return c, conn


def randomword():
    return ''.join(random.choice(string.lowercase) for i in range(7))


manager.run()
