console.log('Hello world');

const form = document.querySelector('form');
const loadingElement  = document.querySelector('.loading')
const mewsElement = document.querySelector('.mews')
const API_URL = 'http://localhost:5000/mews'

loadingElement.style.display = ''

listAllMews();

form.addEventListener('submit', (event) =>{
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content')
    const mew = {
        name,
        content
    }
    form.style.display = 'none'
    loadingElement.style.display = ''
    
    fetch(API_URL,{
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdMew => {
          form.reset()
          setTimeout(()=> {
            form.style.display = ''
          },30000)
        listAllMews()
        loadingElement.style.display = 'none'
      })
})

function listAllMews(){
    mewsElement.innerHTML = ''
    fetch(API_URL)
        .then(response => response.json())
        .then(mews => {
            mews.reverse()
            mews.forEach(mew => {
                const div = document.createElement('div');

                const header = document.createElement('h3')
                header.textContent = mew.name
                
                const content  = document.createElement('p')
                content.textContent = mew.content

                const date = document.createElement('small')
                date.textContent = new Date(mew.created)

                div.appendChild(header);
                div.appendChild(content);

                mewsElement.appendChild(div)
                
            })
            loadingElement.style.display = 'none'
        })
}