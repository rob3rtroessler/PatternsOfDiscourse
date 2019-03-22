function check() {
    selected = [];
    fire(selected)
}

function fire() {
    axios.post('/corpus', {
        'selected texts' : ['textID_1','textID_2','textID_3']
    })
        .then(function (response) {
            console.log(response);
            initTexTileModule(response);
        })
        .catch(function (error) {
            console.log(error)


        });
}
