const CONFIG = {
  BASE_URL: window.location.origin,
  SCROLL_THRESHOLD: 400,
  STAR_COUNT: 100,
}

const setVhProperty = () => {
  if (window.scrollY > 0) return
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setVhProperty()
window.addEventListener('resize', setVhProperty)

const items = document.querySelectorAll('.appear')
const active = (entries) => {
  entries.forEach((entry) =>
    entry.isIntersecting
      ? entry.target.classList.add('inview')
      : entry.target.classList.remove('inview')
  )
}
const io = new IntersectionObserver(active)
items.forEach((item) => io.observe(item))

const body = document.getElementById('body')
const scrollTopBTN = document.getElementById('scroll-back-top-BTN')
const scrollToTop = () => body.scrollIntoView({ behavior: 'smooth' })
document.addEventListener('scroll', () => {
  scrollTopBTN.style.display = window.scrollY > CONFIG.SCROLL_THRESHOLD ? 'block' : 'none'
})

let showSidebar = false
const backdrop = document.getElementById('backdrop')
const menuBtn = document.getElementById('menu-btn')
const sidebar = document.getElementById('sidebar')

const displayLevel1SidebarContent = () => {
  const level1 = document.querySelector('.level1')
  const level2Containers = document.querySelectorAll('.level2')
  level1.classList.remove('hidden')
  level2Containers.forEach((container) => container.classList.remove('active'))
}

const toggleSidebar = () => {
  menuBtn.classList.toggle('active')
  showSidebar = !showSidebar
  if (showSidebar) {
    sidebar.dataset.show = 'true'
    sidebar.setAttribute('aria-hidden', 'false')
    backdrop.style.display = 'block'
    document.body.style.overflowY = 'hidden'
    document.body.style.height = '100vh'
  } else {
    sidebar.dataset.show = 'false'
    sidebar.setAttribute('aria-hidden', 'true')
    backdrop.style.display = 'none'
    document.body.style.height = 'auto'
    document.body.style.overflowY = 'auto'
    displayLevel1SidebarContent()
  }
}

backdrop.addEventListener('click', toggleSidebar)
menuBtn.addEventListener('click', toggleSidebar)
scrollTopBTN.addEventListener('click', scrollToTop)

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && showSidebar) {
    toggleSidebar()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item')
  const backButtons = document.querySelectorAll('.back-button')
  const level1 = document.querySelector('.level1')

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target')
      const targetLevel = document.getElementById(targetId)
      if (targetLevel) {
        level1.classList.add('hidden')
        targetLevel.classList.add('active')
      }
    })
  })

  backButtons.forEach((button) => {
    button.addEventListener('click', displayLevel1SidebarContent)
  })
})

const initStars = () => {
  const container = document.getElementById('stars-container')
  for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    const x = Math.random() * 100
    const y = Math.random() * 100
    const duration = Math.random() * 3 + 2
    const delay = Math.random() * 5
    const size = Math.random() * 2 + 1
    Object.assign(star.style, {
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    })
    container.appendChild(star)
  }
}

document.addEventListener('DOMContentLoaded', initStars)
