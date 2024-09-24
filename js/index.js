const burgerMenu = document.getElementById("burger-menu")
let showBurgermenu = false
const backdrop = document.getElementById("backdrop")

const toggleBurgermenu = () => {
  showBurgermenu = !showBurgermenu
  if (showBurgermenu) {
    burgerMenu.style.right = "0px"
    backdrop.style.display = "block"
    document.body.style.overflowY = "hidden"
    document.body.style.height = "100%"
    return
  }
  burgerMenu.style.right = "-100%"
  backdrop.style.display = "none"
  document.body.style.overflowY = "auto"
  document.body.style.height = "auto"
}

const items = document.querySelectorAll('.appear');

const active = function(entries){
    entries.forEach(entry => 
      entry.isIntersecting 
        ? entry.target.classList.add('inview') 
        : entry.target.classList.remove('inview')
    )
}

const io = new IntersectionObserver(active)

for(let i=0; i < items.length; i++){
  io.observe(items[i])
}

const mainContent = document.getElementById("main-content")
const body = document.getElementById("body")
const scrollTopBTN = document.getElementById("scroll-back-top-BTN")

const scrollToMainContent = () => mainContent.scrollIntoView({behavior: "smooth"})

const scrollToTop = () => body.scrollIntoView({behavior: "smooth"})

document.addEventListener("scroll", () => scrollTopBTN.style.display = scrollY > 400 ? 'block' : 'none')

const updateContent = (langData) =>
  document.querySelectorAll('[data-localization]').forEach(element => {
      const key = element.getAttribute('data-localization')
      element.textContent = langData[key]
  })

const fetchLanguageData = async (lang) => {
  const response = await fetch(`https://eckeecke.github.io/locales/${lang}.json`)
  return response.json()
}

const changeLanguage = async (lang) => {
  localStorage.setItem('lang', lang)
  const langData = await fetchLanguageData(lang)
  const selectors = Array.from(document.getElementsByClassName('language-selector'))
  selectors.forEach(selector => {
    selector.classList.remove('inactive')
    if (selector.dataset.value !== lang) selector.classList.add('inactive')
  })
  document.documentElement.lang = lang
  updateContent(langData)
}

const validLangs = ['de', 'en']
const isValidLang = lang => validLangs.includes(lang)

const getValidatedLangFromStorage = () => {
  const lang = localStorage.getItem('lang')
  return lang && isValidLang(lang) ? lang : 'en'
}

document.addEventListener('DOMContentLoaded', () => {
  changeLanguage(getValidatedLangFromStorage())
})