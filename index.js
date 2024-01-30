const express = require('express');
const app = express();


require('pug');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

let cars = [
    {id:'RHS623', brand:'Saab', model:'9-7X'},
    {id:'GJE205', brand:'Volvo', model:'740'},
    {id:'WIO528', brand:'Polestar', model:'2'},
    {id:'ACJ258', brand:'Volkswagen', model:'Passat'}
];


app.listen(80, () => {
    console.log('http://localhost');
})



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cars', (req, res) => {
    res.render('cars', {cars});
});

app.post('/cars', car_create);

app.delete('/cars/:id', car_destroy);


function car_create(req, res) {
    const id = 'id_'+Date.now();
    const {brand, model} = req.body;

    const car = {id, brand, model};

    cars.unshift(car);
    res.status(200).render('car', {car});
};


function car_destroy(req, res) {
    const id = req.params.id;

    cars = cars.filter(car => car.id != id);

    res.status(200).end();
}


/* app.put('/cars', update_car); */