const CONFIG = {
	BASE_URL: window.location.origin,
	STAR_COUNT: 100
}

const themeToggle = document.querySelector('#theme-toggle')
const currentTheme = localStorage.getItem('theme')

if (currentTheme === 'dark') {
  document.body.classList.add('dark-theme')
} else if (currentTheme === 'light') {
  document.body.classList.add('light-theme')
}

themeToggle.addEventListener('click', () => {
  let theme
  
  if (document.body.classList.contains('dark-theme')) {
    document.body.classList.remove('dark-theme')
    document.body.classList.add('light-theme')
    theme = 'light'
  } else if (document.body.classList.contains('light-theme')) {
    document.body.classList.remove('light-theme')
    document.body.classList.add('dark-theme')
    theme = 'dark'
  } else {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark) {
      document.body.classList.add('light-theme')
      theme = 'light'
    } else {
      document.body.classList.add('dark-theme')
      theme = 'dark'
    }
  }
  
  localStorage.setItem('theme', theme)
})

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

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && showSidebar) {
		toggleSidebar()
	}
})
	document.addEventListener('DOMContentLoaded', () => {
		const buttons = document.querySelectorAll('.toggle-btn')
		const slider = document.querySelector('.nav-slider')
		const sections = document.querySelectorAll('.tab-content')
		const updateView = (activeIndex) => {
			const target = buttons[activeIndex].getAttribute('data-target')
			slider.style.transform = 'translateX(' + activeIndex * 100 + '%)'
			buttons.forEach((btn) => {
				btn.classList.remove('active')
			})
			buttons[activeIndex].classList.add('active')
			sections.forEach((sec) => {
				if (sec.id === target + '-content') {
					sec.classList.remove('hidden')
					sec.scrollIntoView({ behavior: 'auto', block: 'start' })
				} else {
					sec.classList.add('hidden')
				}
			})
		}

		buttons.forEach((btn, index) => {
			btn.addEventListener('click', () => {
				updateView(index)
			})
		})
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
			animationDelay: `${delay}s`
		})
		container.appendChild(star)
	}
}

document.addEventListener('DOMContentLoaded', initStars)

let touchstartX = 0
let touchendX = 0
const swipeContainer = document.querySelector('#swipe-container')

const handleGesture = () => {
    const minDistance = 50
    const activeBtn = document.querySelector('.toggle-btn.active')
    if (!activeBtn) return

    const allBtns = Array.from(document.querySelectorAll('.toggle-btn'))
    const currentIndex = allBtns.indexOf(activeBtn)

    if (touchendX + minDistance < touchstartX) {
        if (currentIndex < allBtns.length - 1) {
            allBtns[currentIndex + 1].click()
        }
    }
    
    if (touchendX > touchstartX + minDistance) {
        if (currentIndex > 0) {
            allBtns[currentIndex - 1].click()
        }
    }
}

swipeContainer.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
}, { passive: true })

swipeContainer.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    handleGesture()
}, { passive: true })
