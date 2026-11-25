const showTitleInput = document.getElementById('show-title')
const showStatusInput = document.getElementById('show-status')
const showSubmitButton = document.getElementById('show-submit')
const showList = document.getElementById('show-list')

const setup = async () =>{ 
      const response = await fetch('/api/shows')
      const shows = await response.json()
      renderShows(shows)

      const statusFilter = document.getElementById('middle-status')

      const renderFilteredShows = () =>{ 
             const selectedStatus = statusFilter.value
            if(selectedStatus === 'all'){ 
                  renderShows(shows)
                  return
            }
            const filtered = shows.filter(show => show.status === selectedStatus)
            renderShows(filtered)
      }

      statusFilter.addEventListener('change', renderFilteredShows)

    
      const addShowForm = document.getElementById('add-show-form')
      
      addShowForm.addEventListener('submit', async(event)=>{ 
            event.preventDefault()

            const fields = new FormData(event.currentTarget)
            const title = fields.get('title')
            const status = fields.get('status')
            

            try{
                  const response = await fetch('/api/shows', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({title, status})
                  })
                  if(!response.ok){ 
                        alert('could not create a new show card')
                        return
                  }
                  const newShow = await response.json()
                  shows.push(newShow)
                  renderFilteredShows()

            }catch(err){ 
                  console.error(err)
                  return
            }
            const newShow = await response.json()
            shows.push(newShow)
           
      })
}



const renderShows = (showsToRender) =>{ 
      showList.replaceChildren()


      for(const show of showsToRender){ 
                    console.table(show)
            const card = document.createElement('li')
            card.className = 'flex sm:flex-row sm:items-center sm:justify-between justify-between border-3 rounded-4xl p-4 sm:p-10 mt-2 items-center'

            const cardTitle = document.createElement('h3')
            cardTitle.textContent = show.title
            cardTitle.className = 'text-xl sm:text-3xl'

            const cardStatus = document.createElement('select')
            cardStatus.className = 'border-3 rounded-4xl p-4 bg-panel-gray w-full md:w-70 show-select'
            const watchingOption = document.createElement('option')
            watchingOption.value = 'watching'
            watchingOption.textContent = 'watching'
            const planToWatchOption = document.createElement('option')
            planToWatchOption.value  = 'plan-to-watch'
            planToWatchOption.textContent = 'Plan to watch'
            const finishedOption = document.createElement('option')
            finishedOption.value = 'finished'
            finishedOption.textContent = 'finished'

            
            cardStatus.append(watchingOption, planToWatchOption, finishedOption)
            cardStatus.value = show.status
            cardStatus.addEventListener('change', async()=>{ 
                  try{ 
                        const response = await fetch(`/api/shows/${show.id}`,{ 
                              method: 'PATCH',
                              headers: {'Content-Type': 'application/json'},
                              body: JSON.stringify({status: cardStatus.value})
                        })

                        if(!response.ok){ 
                              throw new Error(`Could not update the show ${response.status}`)
                        }

                        const updatedShow = await response.json()
                        show.status = updatedShow
                  }catch(err){ 
                        cardStatus.value = show.status
                        console.error(err)
                  }finally{ 
                        cardStatus.disabled = false
                  }
            })
           

            card.append(cardTitle,cardStatus)
            showList.append(card)
      }
} 




 
setup()
