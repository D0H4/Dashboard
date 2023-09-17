let $html = document.documentElement.getAttribute('color-theme');
let $darkmodeToggleBtn = document.querySelector('#darkmodeToggle');
let $darkmodeToggleIcon = document.querySelector('#darkmodeToggleIcon');
let $settingBtn = document.querySelector('#settingBtnIcon');

const isUserColorTheme = localStorage.getItem('color-theme');
const isOsColorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getUserTheme = () => (isUserColorTheme ? isUserColorTheme : isOsColorTheme);

window.onload = () => {
    // 다크모드 토글
    $darkmodeToggleBtn.addEventListener('click', e => {
        if ($html === 'light') {
            localStorage.setItem('color-theme', 'dark');
            document.documentElement.setAttribute('color-theme', 'dark');
            $html = 'dark';
            $darkmodeToggleIcon.className = "fa-solid fa-lightbulb";
            $darkmodeToggleIcon.style.color = "#fff";
        }
        else if ($html === 'dark') {
            localStorage.setItem('color-theme', 'light');
            document.documentElement.setAttribute('color-theme', 'light');
            $html = 'light';
            $darkmodeToggleIcon.className = "fa-regular fa-lightbulb";
            $darkmodeToggleIcon.style.color = "#121212";
        }
    });

    // 설정창 열기
    $settingBtn.addEventListener('click', e => {
        if (document.querySelector('#settingTab').style.display === 'none') {
            document.querySelector('#settingTab').style.display = 'block';
        }
        else {
            document.querySelector('#settingTab').style.display = 'none';
        }
    });
};