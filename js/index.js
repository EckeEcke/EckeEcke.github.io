function setVhProperty() {
  if (window.scrollY > 0) return
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setVhProperty()

window.addEventListener('resize', setVhProperty)

const items = document.querySelectorAll('.appear')

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

const updateContent = (langData) => {
  document.querySelectorAll('[data-localization]').forEach(element => {
    const key = element.getAttribute('data-localization')
    element.textContent = langData[key]
  })
}

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

let showSidebar = false
const backdrop = document.getElementById("backdrop")

const toggleSidebar = () => {
  showSidebar = !showSidebar
  if (showSidebar) {
    document.getElementById("sidebar").dataset.show = "true"
    backdrop.style.display = "block"
    document.body.style.overflowY = "hidden"
    document.body.style.height = "100vh"
    return
  }
  document.getElementById("sidebar").dataset.show = "false"
  backdrop.style.display = "none"
  document.body.style.overflowY = "auto"
  document.body.style.height = "auto"
  displayLevel1SidebarContent()
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    if (showSidebar) {
      toggleSidebar()
    }
  }
})

function displayLevel1SidebarContent() {
  const level1 = document.querySelector('.level1')
  const level2Containers = document.querySelectorAll('.level2')
  level1.classList.remove('hidden')
  level2Containers.forEach(container => {
    container.classList.remove('active')
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item')
  const backButtons = document.querySelectorAll('.back-button')
  const level1 = document.querySelector('.level1')

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target')
      const targetContainer = document.getElementById(target)
      if (!target) return
      level1.classList.add('hidden')
      targetContainer.classList.add('active')
    })
  })

  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      displayLevel1SidebarContent()
    })
  })
})