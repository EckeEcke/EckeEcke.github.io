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



const contactForm = document.getElementById('contact-form')

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }

    try {
        const response = await fetch('https://python-contact-form.vercel.app/api/send-mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const result = await response.json()

        if (response.ok) {
            alert('Message received! Thx, ' + result.received)
            contactForm.reset()
        } else {
            alert('Error while sending...')
        }
    } catch (error) {
        console.error('Backend connection failed:', error)
        alert('Backend not reachable.')
    }
})


const items = document.querySelectorAll('.appear')
const contentSections = document.querySelectorAll('.content-section')
const navLinks = document.querySelectorAll('.nav-item a')
navLinksMobile = document.querySelectorAll('.nav-item')

const active = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('inview')
        } 
		/* remove fade in once more on upscrolling
		else {
            entry.target.classList.remove('inview')
        }
		*/
    })
}

const activeNav = (entries) => {
    entries.forEach((entry) => {
        const id = entry.target.getAttribute('id')

        if (!id || !entry.isIntersecting) return

        navLinks.forEach((link) => {
            const href = link.getAttribute('href')
            
            link.classList.remove('active')
            if (href === `#${id}`) {
                link.classList.add('active')
            }
        })

		navLinksMobile.forEach((link) => {
            const href = link.getAttribute('href')
            
            link.classList.remove('active')
            if (href === `#${id}`) {
                link.classList.add('active')
            }
        })
    })
}

const io = new IntersectionObserver(active)
const io2 = new IntersectionObserver(activeNav, { rootMargin: '-40% 0px -40% 0px' })

items.forEach((item) => io.observe(item))
contentSections.forEach((section) => io2.observe(section))

const body = document.getElementById('body')

let showSidebar = false
const backdrop = document.getElementById('backdrop')
const menuBtn = document.getElementById('menu-btn')
const sidebar = document.getElementById('sidebar')

const toggleSidebar = () => {
	menuBtn.classList.toggle('active')
	showSidebar = !showSidebar
	if (showSidebar) {
		sidebar.dataset.show = 'true'
		sidebar.setAttribute('aria-hidden', 'false')
		backdrop.style.display = 'block'
	} else {
		sidebar.dataset.show = 'false'
		sidebar.setAttribute('aria-hidden', 'true')
		backdrop.style.display = 'none'
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
	const navItems = document.querySelectorAll('#sidebar .nav-item')

	navItems.forEach((item) => {
		item.addEventListener('click', () => {
			toggleSidebar()
		})
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

const header = document.querySelector('header')

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
})

const glow = document.getElementById('cursor-glow')

document.addEventListener('mousemove', (e) => {
    if (body.classList.contains('light-theme')) {
        glow.style.opacity = '0'
        return
    } 

    glow.style.left = e.clientX + 'px'
    glow.style.top = e.clientY + 'px'
    
    if (glow.style.opacity !== '1') {
        glow.style.opacity = '1'
    }
})

document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0'
})
