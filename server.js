const express = require('express');
const path = require('path');
const app = express();
const proxy = require('express-http-proxy');
const secureRandom = require('secure-random');
const crypto = require('crypto');
const axios = require('axios');
const querystring = require('querystring'); // module for converting json to parameter
const parser = require('cookie-parser');
// const btoa = require('')

const CLIENT_ID = "THIS SHOULD BE A SECURE RANDOM VALUE";

function create_code_verifier() {
    const bytes = secureRandom(64);
    var byte_string = "";
    for(var i = 0; i < bytes.length; i++) {
        byte_string += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(byte_string).toString("base64");
        // .replace("+", "-")
        // .replace("/", "_")
        // .replace("=", "");
}

function create_code_challenge(code_verifier) {
    hash = crypto.createHash('sha256');
    hash.update(code_verifier);
    return hash.digest('base64')
        .replace("+", "-")
        .replace("/", "_")
        .replace("=", "");
}
const CODE_VERIFIER = create_code_verifier();
const CODE_CHALLENGE = create_code_challenge(CODE_VERIFIER);


app.use(parser());
app.get('/auth', (req, res) => {
    const redirect_url = new URL('http://localhost:5001/auth');
    redirect_url.searchParams.append('response_type', 'code');
    redirect_url.searchParams.append('client_id', CLIENT_ID);
    // var baseUrl = req.url;
    console.log(`base-url: ` + req.protocol + '://' + req.get('host') + req.originalUrl);
    code_receiver_url = `${req.protocol}://${req.get('host')}/code`;
    redirect_url.searchParams.append('redirect_url', code_receiver_url);
    redirect_url.searchParams.append('code_challenge', CODE_CHALLENGE);
    redirect_url.searchParams.append('code_challenge_method', 'S256');
    res.redirect(redirect_url.href);
});

app.get('/code', async (req, res) => {
    // res.send(`Authorization code: ${req.query.authorization_code}`);
    try {
        redirect_url = `${req.protocol}://${req.get('host')}/code`;
        response = await axios.post(
            'http://localhost:5001/token',
            querystring.stringify({
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                authorization_code: req.query.authorization_code,
                redirect_url: redirect_url, //'http://localhost:3000/main',
                code_verifier: CODE_VERIFIER
            })
        );
        // res.send(response.data);
        // res.json(response.data);
        res.cookie('token', response.data.access_token,
                   {'httpOnly': true, encode: (val) => val});
        res.redirect('http://localhost:3000/main');
        // res.cookie('token_type', response.data.token_type);
        // res.cookie('expires_in', response.data.expires_in);
    } catch (err) {
        res.send(err);
    }
});
const setAuthorizationHeader = (req, res, next) => {
    console.log('Proxied request: ' + req.url);
    console.log(req.cookies);
    if (req.cookies) {
        req.headers['Authorization'] = `Bearer ${req.cookies.token}`;
        console.log('Authorization header set');
    }
    next();
}
// app.use(setAuthorizationHeader);
app.use('/api', setAuthorizationHeader, proxy('http://localhost:5002'));

app.listen(9000);