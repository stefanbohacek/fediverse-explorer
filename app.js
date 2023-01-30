import express  from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';

import indexRoute from './routes/index.js';
import searchRoute from './routes/search.js';

const app = express();

      
app.use(compression());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/', indexRoute)
app.use('/search', searchRoute)

export default app;
