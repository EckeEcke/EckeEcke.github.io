const pages = [
	{ path: '/', title: 'HOMEPAGE', id: 'homepage' },
	{ path: '/shooter', title: 'SHOOTER GAME', id: 'shooter' },
	{
		path: '/commit-combat',
		title: 'COMMIT COMBAT GAME',
		id: 'commit-combat'
	},
	{ path: '/pong', title: 'PONG GAME', id: 'pong' },
	{ path: '/snake', title: 'SNAKE GAME', id: 'snake' },
	{ path: '/templelooter', title: 'TEMPLE LOOTER', id: 'templelooter' },
	{ path: '/drawing', title: 'DRAWING APP', id: 'drawing' },
	{ path: '/metrics', title: 'METRICS', id: 'metrics' },
	{ path: '/404', title: '404', id: '404' }
]

function createMetricsHTML() {
	const container = document.getElementById('metrics-container')

	pages.forEach((page) => {
		const div = document.createElement('div')
		div.className = 'metric-item'
		div.innerHTML = `
        <h2>${page.title}</h2>
        <div id="visit-count-${page.id}" class="visit-count"></div>
    `
		container.appendChild(div)
	})
}

function loadVisitCounts() {
	var t = setInterval(function () {
		if (window.goatcounter && window.goatcounter.visit_count) {
			clearInterval(t)

			pages.forEach((page) => {
				window.goatcounter.visit_count({
					path: page.path,
					append: `#visit-count-${page.id}`,
					no_branding: true,
					style:
						'* {color: #000; font-size: 14px;font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;border: none!important}'
				})
			})
		}
	}, 100)
}

document.addEventListener('DOMContentLoaded', function () {
	createMetricsHTML()
	loadVisitCounts()
})
