let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
window.onload = function() { clock(), command(), search() }
function clock() {
    let time = document.getElementById('time')
    let date = document.getElementById('date')

    let today = new Date()
    let hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours()
    let min = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()

    let year = today.getFullYear()
    let month = today.getMonth()
    let day = today.getDate()
    let weekday = today.getDay()

    time.innerHTML = `${hour}:${min}`
    date.innerHTML = `${year}/${month+1}/${day} ${week[weekday]}`

    setTimeout(clock, 1000)
}

function command() {
    let commandBox = document.getElementById('commandBox')
    let commandInput = document.getElementById('commandInput')
    let isShow = false

    document.addEventListener('keydown', function(e) {
        if (searchInput === document.activeElement) return;
        else {
            if (e.key === ':' && e.shiftKey === true) {
                e.preventDefault(); // prevent default behavior of typing ':'
                if (isShow === true) {
                    commandBox.style.display = 'none'
                    isShow = false
                } else {
                    commandBox.style.display = 'block'
                    setTimeout(() => {
                        commandInput.focus();
                    }, 0);
                    isShow = true
                }
            }
        }
    })

    document.addEventListener('keydown', function(e) {
        if (commandInput === document.activeElement) return;
        else {
            if (e.key === 'Escape') {
                commandBox.style.display = 'none'
                isShow = false
            }
        }
    })
}

function commandRecognition() {
    let commandInput = document.getElementById('commandInput')
    let commandForm = document.getElementById('commandForm')
    let command = commandInput.value

    commandForm.addEventListener('submit', function(e) {
        e.preventDefault()
        console.log(command)
        commandInput.value = ''
        command = ''
    })
}

function search() {
    let searchInput = document.getElementById('searchInput')
    let search = searchInput.value

    searchInput.addEventListener('keydown', (e) => {
        e.preventDefault()
        if (e.key == "Enter") {
            search = searchInput.value;
            if (search.replace(/ /gm, "").length > 0) location.href = `https://duckduckgo.com/?q=${search}`;
            else searchInput.value = "";
        }
    })
}