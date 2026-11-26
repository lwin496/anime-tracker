import express from 'express'

const app = express()

const port = 3001; 


app.use(express.static('public'))



const shows = [
{id: 1, title: 'bleach', status: 'watching'},
{id: 2, title: 'naruto', status: 'plan-to-watch'},
{id: 3, title: 'one piece', status: 'watching'},
]


app.get('/api/shows', (req, res)=>{ 
      res.json(shows)
})

app.use(express.json())
let newID = Math.max(0, ...shows.map(show => show.id)) + 1 

app.post('/api/shows', (req, res)=>{ 
      const {title, status} = req.body 
      const validStatuses = ['watching', 'plan-to-watch', 'finished']

      if(typeof title !== 'string' || title.trim() === '' || !validStatuses.includes(status)){ 
            return res.status(400).json({error: 'enter a valid title and status'})
      }

      const show = { 
            id: newID++,
            title: title,
            status: status
      }

      shows.push(show)
      res.status(201).json(show)
})


app.delete('/api/shows/:id', (req,res) =>{
      const index = shows.findIndex(show => String(show.id) === req.params.id)
      if(index === -1){ 
            return res.status(404).json({error: 'show not found'})
      }
      shows.splice(index, 1)
      res.sendStatus(204)
})


app.patch('/api/shows/:id', (req, res)=>{
      const id = Number(req.params.id)
      const {status} = req.body ?? {}

      const findShow = shows.find(show => show.id === id)
      const validStatuses = ['watching', 'plan-to-watch', 'finished']

      if(!validStatuses.includes(status)){ 
            return res.status(400).json({error: 'enter a valid status'})
      }

      if(!findShow){ 
            return res.status(404).json({error: 'cannot find show'})
      }

      findShow.status = status
      return res.json(findShow)
})

app.listen(port, ()=>{ 
      console.log('site is running on http://localhost:3001')
})





