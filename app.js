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
                e.preventDefault();
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

    searchInput.addEventListener('keydown', (e) => {
        if (e.key == "Enter") {
            let search = searchInput.value;
            if (search.replace(/ /gm, "").length > 0) { // 공백이 아닌 경우
                if (search.indexOf("https://" || "http://" || "www.")) location.href = search; // url인 경우 사이트로 이동
                else location.href = `https://duckduckgo.com/?q=${search}`; // url이 아닌 경우 duckduckgo 검색
            }
            else searchInput.value = ""; // 공백인 경우 input값 초기화
        }
    })
}