const axios = require("axios")
const cheerio = require("cheerio")
const url = "https://elpais.com/ultimas-noticias/"
const fs = require("node:fs")

module.exports = async () => {
    try{
        const res = await axios.get(url)
        if(res.status === 200){
            const html = res.data
            const $ = cheerio.load(html)
            let noticias = []
            
            $('article').each((i, element) => {
                const noticia = {
                    id: noticias.length + 1,
                    titulo: $(element).find("h2").text(),
                    imagen: $(element).find("img").attr("src"),
                    descripcion: $(element).find("p").text().trim(),
                    enlace: $(element).find("a").attr("href")
                }
                noticias.push(noticia)
            })
        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2))
        }
    }
    catch(error){
        console.log("Error en el scrapping inicial error: "+error)
    }
}