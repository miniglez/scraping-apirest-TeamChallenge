const express = require("express")
const app = express()
const PORT = 3000
const fs = require("node:fs")
const getNews = require("./scraping.js")
let noticias = []

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.send("funciona")
})

app.get("/scraping/", (req, res) => {
    res.json(noticias.find())
})

app.get("/scraping/:titulo", (req, res) => {
    const mytitle = req.params.titulo
    const noticia = noticias.find(ele => ele.titulo === mytitle)
    res.json(noticia)
})

app.post("/scraping", (req, res) => {
    const nuevaNoticia = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        enlace: req.body.enlace,
        imagen: req.body.imagen
    }

    console.log(nuevaNoticia)
    noticias.push(nuevaNoticia)
    res.json(noticias)
})

app.put("/scraping/:titulo", (req, res) => {
    const mytitle = req.params.titulo
    const newTitulo = req.body.titulo
    const newDescripcion = req.body.descripcion

    const index = noticias.findIndex(ele => ele.titulo == mytitle)

    if(index === -1){
        res.status(404).json({error: "Noticia no encontrada"})
    }
    else{
        noticias[index] = {
            ...noticias[index],
            titulo: newTitulo || noticias[index].titulo,
            descripcion: newDescripcion || noticias[index].descripcion
        }
        res.json(noticias)
    }
})



app.delete("/scraping/:titulo", (req, res) => {
    const mytitle = req.params.titulo
    const newNoticias = noticias.filter(ele => ele.titulo != mytitle)
    noticias = newNoticias
    res.json(noticias)
})

app.listen(PORT, () => {
    leerDatos()
    console.log(`http://localhost:${PORT}`)
})

function leerDatos() {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        noticias = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo noticias.json:', error.message);
    }
}