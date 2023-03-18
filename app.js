const express = require('express')
const app = express()

const fs = require('fs')


app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({extended:false}))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description

    if(title.trim() === '' && description.trim() === ''){
        res.render('create', {error: true})
    } else {
        fs.readFile('./data/notes.json', (err, data) => {
            if(err) throw err

            const notes = JSON.parse(data)
            notes.push({
                id: id(),
                title: title,
                description: description,
            })

            fs.writeFile('./data/notes.json', JSON.stringify(notes), err => {
                if (err) throw err

                res.render('create', {success: true})

            })
        })

    }
})

app.get('/notes', (req, res) => {

    fs.readFile('./data/notes.json', (err, data) => {
        if(err) throw err

        const notes = JSON.parse(data)
        res.render('notes', {notes: notes})
    })
})

app.get('/notes/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/notes.json', (err, data) => {
        if(err) throw err

        const notes = JSON.parse(data)
        const note = notes.filter(note => note.id == id)[0]



        res.render('detail', {note: note})
    })
})

app.listen(8000, err => {
    if(err) throw err

    console.log("Server is running on port 8000...")
})

function id () {
    return '_' + Math.random().toString(36).substring(2, 9);
}