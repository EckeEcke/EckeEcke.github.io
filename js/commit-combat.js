const GH_SANS = [
	'-apple-system',
	'BlinkMacSystemFont',
	'"Segoe UI"',
	'Helvetica',
	'Arial',
	'sans-serif'
]
const GH_MONO = [
	'ui-monospace',
	'SFMono-Regular',
	'SF Mono',
	'Menlo',
	'Consolas',
	'monospace'
]

const setupLauncher = () => {
	const container = document.getElementById('game-container')
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		) || window.innerWidth < 768

	if (isMobile) {
		const notSupportedMsg = document.createElement('div')
		notSupportedMsg.style.cssText = `position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:#2d333b; padding:30px; border-radius:8px; color:white; font-family:${GH_SANS.join(',')}; text-align:center; border:2px solid #ff4444; width:80%`
		notSupportedMsg.innerHTML = `<h2 style="color:#ff4444; margin-top:0">PC Required</h2><p>This game requires a keyboard and a larger screen to play.</p>`
		container.appendChild(notSupportedMsg)
		return
	}

	const uiOverlay = document.createElement('div')
	uiOverlay.id = 'ui-overlay'
	uiOverlay.style.cssText = `position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:#2d333b; padding:20px; border-radius:8px; display:flex; flex-direction:column; gap:10px; color:white; font-family:${GH_SANS.join(',')}; z-index:100; border:2px solid #39d353`

	const title = document.createElement('h2')
	title.innerText = 'Commit Combat'
	title.style.margin = '0 0 10px 0'
	title.style.textAlign = 'center'

	const infoBox = document.createElement('div')
	infoBox.style.cssText =
		'background:#22272e; padding:15px; border-radius:6px; font-size:13px; border:1px solid #444c56'
	infoBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #444c56; padding-bottom:10px">
            <div style="text-align:center; flex:1">
                <strong style="color:#39d353">P1 (Green)</strong><br>Move: A / D<br>Shoot: W
            </div>
            <div style="width:1px; background:#444c56; margin:0 10px"></div>
            <div style="text-align:center; flex:1">
                <strong style="color:#ff4444">P2 (Red)</strong><br>Move: ← / →<br>Shoot: ↓
            </div>
        </div>
        <div style="text-align:center; color:#8b949e">
            Goal: First to 10 Hits or most hits after 1:00 min wins!
        </div>
    `

	const input1 = document.createElement('input')
	input1.placeholder = 'Enter github user name'
	input1.style.cssText =
		'padding:8px; border-radius:4px; border:1px solid #444c56; background:#22272e; color:white'

	const input2 = document.createElement('input')
	input2.placeholder = 'Enter github user name'
	input2.style.cssText =
		'padding:8px; border-radius:4px; border:1px solid #444c56; background:#22272e; color:white'

	const radioContainer = document.createElement('div')
	radioContainer.style.cssText =
		'display:flex; justify-content:space-around; padding:10px; background:#22272e; border-radius:4px'

	const createRadio = (id, label, checked) => {
		const wrap = document.createElement('label')
		wrap.style.cursor = 'pointer'
		const radio = document.createElement('input')
		radio.type = 'radio'
		radio.name = 'mode'
		radio.value = id
		radio.checked = checked
		wrap.append(radio, ' ' + label)
		return wrap
	}

	radioContainer.append(
		createRadio('cpu', '1 player', true),
		createRadio('pvp', '2 player', false)
	)

	const startBtn = document.createElement('button')
	startBtn.innerText = 'START BATTLE'
	startBtn.style.cssText =
		'padding:10px; background:#39d353; border:none; border-radius:4px; cursor:pointer; font-weight:bold'

	uiOverlay.append(title, infoBox, input1, input2, radioContainer, startBtn)
	container.appendChild(uiOverlay)

	startBtn.onclick = async () => {
		const p1 = input1.value.trim() || 'EckeEcke'
		const p2 = input2.value.trim() || 'torvalds'
		const mode = document.querySelector('input[name="mode"]:checked').value

		startBtn.disabled = true
		startBtn.innerText = 'CHECKING USERS...'
		startBtn.style.background = '#8b949e'

		try {
			const res = await fetch(
				`https://eckeecke.pythonanywhere.com/get-battle/${p1}/${p2}`
			)
			const data = await res.json()

			if (!res.ok) {
				alert(`BATTLE ERROR:\n${data.message || 'Users not found'}`)
				input1.value = ''
				input2.value = ''
				startBtn.disabled = false
				startBtn.innerText = 'START BATTLE'
				startBtn.style.background = '#39d353'
				return
			}

			uiOverlay.remove()
			showPreGameScreen(p1, p2, mode, data)
		} catch (e) {
			alert('Network Error: Could not connect to battle server.')
			startBtn.disabled = false
			startBtn.innerText = 'START BATTLE'
			startBtn.style.background = '#39d353'
		}
	}
}

const showPreGameScreen = async (p1, p2, mode, battleData) => {
	const app = new PIXI.Application()
	const DESIGN_W = 400
	const DESIGN_H = 400
	const res = Math.max(window.devicePixelRatio, 2)

	await app.init({
		background: '#1a1a1a',
		antialias: true,
		resizeTo: window,
		resolution: res,
		autoDensity: true
	})

	document.getElementById('game-container').appendChild(app.canvas)
	const stage = new PIXI.Container()
	app.stage.addChild(stage)

	const resize = () => {
		const sw = window.innerWidth
		const sh = window.innerHeight
		const scale = Math.min(sw / DESIGN_W, sh / DESIGN_H)
		stage.scale.set(scale)
		stage.x = (sw - DESIGN_W * scale) / 2
		stage.y = (sh - DESIGN_H * scale) / 2
	}

	window.addEventListener('resize', resize)
	resize()

	const createSharpText = (text, fontSize, isBold = true) => {
		const t = new PIXI.Text({
			text,
			resolution: res,
			style: {
				fontFamily: GH_SANS,
				fontSize,
				fontWeight: isBold ? 'bold' : 'normal',
				fill: '#ffffff'
			}
		})
		t.roundPixels = true
		return t
	}

	const drawPreAvatar = async (name, x, y, color) => {
		const container = new PIXI.Container()
		container.position.set(x, y)
		stage.addChild(container)

		const border = new PIXI.Graphics()
			.roundRect(-42, -42, 84, 84, 8)
			.stroke({ width: 3, color })
		container.addChild(border)

		try {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.src = `https://eckeecke.pythonanywhere.com/image-proxy/${name}`

			await new Promise((resolve, reject) => {
				img.onload = resolve
				img.onerror = reject
			})

			const sprite = new PIXI.Sprite(PIXI.Texture.from(img))
			sprite.anchor.set(0.5)
			sprite.width = 80
			sprite.height = 80
			const mask = new PIXI.Graphics()
				.roundRect(-40, -40, 80, 80, 6)
				.fill(0xffffff)
			sprite.mask = mask
			container.addChild(mask, sprite)
		} catch (e) {
			const fallback = createSharpText(name[0].toUpperCase(), 40)
			fallback.anchor.set(0.5)
			container.addChild(fallback)
		}

		const txt = createSharpText(name, 18)
		txt.anchor.set(0.5)
		txt.y = 65
		container.addChild(txt)
	}

	await Promise.all([
		drawPreAvatar(p1, 100, 150, 0x39d353),
		drawPreAvatar(p2, 300, 150, 0xff4444)
	])

	const vs = createSharpText('VS', 40)
	vs.style.fill = '#39d353'
	vs.anchor.set(0.5)
	vs.position.set(200, 150)
	stage.addChild(vs)

	const btn = createSharpText('CLICK TO FIGHT', 20)
	btn.anchor.set(0.5)
	btn.position.set(200, 300)
	stage.addChild(btn)

	stage.eventMode = 'static'
	stage.hitArea = app.screen
	stage.once('pointerdown', () => {
		window.removeEventListener('resize', resize)
		setTimeout(() => {
			if (app.canvas && app.canvas.parentNode)
				app.canvas.parentNode.removeChild(app.canvas)
			app.destroy(true, { children: true, texture: true })
			initGame(p1, p2, mode, battleData)
		}, 50)
	})
}

const initGame = async (p1, p2, mode, battleData) => {
	const keys = {
		a: false,
		d: false,
		w: false,
		arrowleft: false,
		arrowright: false,
		arrowdown: false
	}

	window.addEventListener('keydown', (e) => {
		const k = e.key.toLowerCase()
		if (keys.hasOwnProperty(k)) keys[k] = true
	})

	window.addEventListener('keyup', (e) => {
		const k = e.key.toLowerCase()
		if (keys.hasOwnProperty(k)) keys[k] = false
	})

	const app = new PIXI.Application()
	const DESIGN_W = 300
	const SIDEBAR_W = 120
	const TOTAL_W = DESIGN_W + SIDEBAR_W
	const DESIGN_H = 400
	const res = Math.max(window.devicePixelRatio, 2)

	await app.init({
		background: '#1a1a1a',
		antialias: true,
		resizeTo: window,
		resolution: res,
		autoDensity: true
	})

	document.getElementById('game-container').appendChild(app.canvas)
	const stage = new PIXI.Container()
	app.stage.addChild(stage)

	const resize = () => {
		const sw = window.innerWidth
		const sh = window.innerHeight
		const scale = Math.min(sw / TOTAL_W, sh / DESIGN_H)
		stage.scale.set(scale)
		stage.x = (sw - TOTAL_W * scale) / 2
		stage.y = (sh - DESIGN_H * scale) / 2
	}
	window.addEventListener('resize', resize)
	resize()

	const createSharpText = (
		text,
		fontSize,
		isBold = true,
		color = '#ffffff',
		isMono = false
	) => {
		const t = new PIXI.Text({
			text,
			resolution: res,
			style: {
				fontFamily: isMono ? GH_MONO : GH_SANS,
				fontSize,
				fontWeight: isBold ? 'bold' : 'normal',
				fill: color,
				wordWrap: true,
				wordWrapWidth: SIDEBAR_W - 10
			}
		})
		t.roundPixels = true
		return t
	}

	const sidebar = new PIXI.Graphics()
		.rect(DESIGN_W, 0, SIDEBAR_W, DESIGN_H)
		.fill({ color: 0x000000, alpha: 0.5 })
	stage.addChild(sidebar)

	let playerHits = 0
	let enemyHits = 0
	let p1ShieldHits = 0
	let p2ShieldHits = 0
	let timeLeft = 60
	let gameOver = false
	let lastShotTime = 0
	let lastEnemyShotTime = 0
	const SHOT_COOLDOWN = 400

	let cpuPattern = 0 // 0: Random L/R, 1: Follow Player, 2: Target Shields
	let enemyDir = 1

	const timerLabel = createSharpText('01:00', 24, true, '#39d353', true)
	timerLabel.position.set(DESIGN_W + 5, 180)
	stage.addChild(timerLabel)

	const enemyNameLabel = createSharpText(p2, 14)
	enemyNameLabel.position.set(DESIGN_W + 5, 20)
	stage.addChild(enemyNameLabel)

	const enemyHitLabel = createSharpText('Hits: 0', 12, false, '#aaaaaa', true)
	enemyHitLabel.position.set(DESIGN_W + 5, 45)
	stage.addChild(enemyHitLabel)

	const playerNameLabel = createSharpText(p1, 14)
	playerNameLabel.position.set(DESIGN_W + 5, 320)
	stage.addChild(playerNameLabel)

	const playerHitLabel = createSharpText('Hits: 0', 12, false, '#aaaaaa', true)
	playerHitLabel.position.set(DESIGN_W + 5, 345)
	stage.addChild(playerHitLabel)

	const checkWin = (reason) => {
		if (gameOver) return
		let winner = ''
		if (playerHits >= 10) winner = p1
		else if (enemyHits >= 10) winner = p2
		else if (reason === 'time') {
			if (playerHits > enemyHits) winner = p1
			else if (enemyHits > playerHits) winner = p2
			else if (p1ShieldHits > p2ShieldHits) winner = p1
			else if (p2ShieldHits > p1ShieldHits) winner = p2
		}
		if (winner || reason === 'time') {
			gameOver = true
			clearInterval(timerInterval)
			if (mode === 'cpu') clearInterval(patternInterval)
			const overlay = new PIXI.Graphics()
				.rect(0, 0, TOTAL_W, DESIGN_H)
				.fill({ color: 0x000000, alpha: 0.8 })
			const msg = winner ? `${winner}\nWINS!` : 'DRAW'
			const message = createSharpText(msg, 30, true, '#39d353')
			message.style.align = 'center'
			message.anchor.set(0.5)
			message.position.set(TOTAL_W / 2, DESIGN_H / 2)
			stage.addChild(overlay, message)
			setTimeout(() => window.location.reload(), 4000)
		}
	}

	const timerInterval = setInterval(() => {
		if (gameOver) return clearInterval(timerInterval)
		timeLeft--
		const m = Math.floor(timeLeft / 60)
		const s = timeLeft % 60
		timerLabel.text = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
		if (timeLeft <= 0) {
			timerLabel.text = '00:00'
			checkWin('time')
		}
	}, 1000)

	const patternInterval =
		mode === 'cpu'
			? setInterval(() => {
					if (gameOver) return clearInterval(patternInterval)
					cpuPattern = (cpuPattern + 1) % 3
				}, 3000)
			: null

	const createExplosion = (x, y, color) => {
		for (let i = 0; i < 8; i++) {
			const p = new PIXI.Graphics().rect(0, 0, 3, 3).fill(color)
			p.x = x
			p.y = y
			const angle = Math.random() * Math.PI * 2
			const speed = Math.random() * 2 + 1
			const vx = Math.cos(angle) * speed
			const vy = Math.sin(angle) * speed
			stage.addChild(p)
			const pTick = () => {
				p.x += vx
				p.y += vy
				p.alpha -= 0.03
				if (p.alpha <= 0) {
					stage.removeChild(p)
					app.ticker.remove(pTick)
				}
			}
			app.ticker.add(pTick)
		}
	}

	const animateHit = (container, isEnemyHit) => {
		if (gameOver) return
		createExplosion(container.x, container.y, isEnemyHit ? 0x39d353 : 0xff4444)
		if (isEnemyHit) {
			playerHits++
			playerHitLabel.text = `Hits: ${playerHits}`
		} else {
			enemyHits++
			enemyHitLabel.text = `Hits: ${enemyHits}`
		}
		checkWin('hits')
		const filter = new PIXI.ColorMatrixFilter()
		container.filters = [filter]
		filter.negative()
		setTimeout(() => (container.filters = []), 100)
	}

	const enemyShields = new PIXI.Container()
	const playerShields = new PIXI.Container()
	stage.addChild(enemyShields, playerShields)

	const playerChar = new PIXI.Container()
	playerChar.position.set(DESIGN_W / 2, 380)
	stage.addChild(playerChar)

	const enemyChar = new PIXI.Container()
	enemyChar.position.set(DESIGN_W / 2, 20)
	stage.addChild(enemyChar)

	const getGitColor = (c) => {
		if (c <= 0) return 0x2d333b
		const colors = [0x0e4429, 0x006d32, 0x26a641, 0x39d353]
		return colors[Math.min(3, Math.max(0, Math.ceil(c / 3) - 1))]
	}

	const createBullet = (x, y, vy, isEnemy) => {
		if (gameOver) return
		const b = new PIXI.Graphics()
			.circle(0, 0, 4)
			.fill(isEnemy ? 0xff4444 : 0xffff00)
		b.x = x
		b.y = y
		stage.addChild(b)
		const tick = () => {
			b.y += vy
			const target = isEnemy ? playerChar : enemyChar
			if (Math.hypot(b.x - target.x, b.y - target.y) < 15) {
				animateHit(target, !isEnemy)
				stage.removeChild(b)
				app.ticker.remove(tick)
				return
			}
			const shields = isEnemy ? playerShields : enemyShields
			const tileSize = (DESIGN_W - 70) / 7
			shields.children.forEach((s) => {
				if (
					s.visible &&
					b.x + 4 > s.x + shields.x &&
					b.x - 4 < s.x + shields.x + tileSize &&
					b.y > s.y + shields.y &&
					b.y < s.y + shields.y + tileSize
				) {
					s.lives--
					createExplosion(b.x, b.y, getGitColor(s.lives + 1))
					if (s.lives < 0) {
						s.visible = false
						if (isEnemy) p2ShieldHits++
						else p1ShieldHits++
					} else
						s.clear()
							.roundRect(0, 0, tileSize, tileSize, 6)
							.fill(getGitColor(s.lives))
					stage.removeChild(b)
					app.ticker.remove(tick)
				}
			})
			if (b.y < 0 || b.y > DESIGN_H) {
				stage.removeChild(b)
				app.ticker.remove(tick)
			}
		}
		app.ticker.add(tick)
	}

	const tileSize = (DESIGN_W - 70) / 7
	const drawGrid = (cont, grid, y) => {
		cont.position.set(20, y)
		grid.forEach((row, rIdx) =>
			row.forEach((c, cIdx) => {
				const s = new PIXI.Graphics()
					.roundRect(0, 0, tileSize, tileSize, 6)
					.fill(getGitColor(c))
				s.x = cIdx * (tileSize + 6)
				s.y = rIdx * (tileSize + 6)
				s.lives = c
				cont.addChild(s)
			})
		)
	}
	drawGrid(enemyShields, battleData.enemy.shield_grid, 50)
	drawGrid(playerShields, battleData.player.shield_grid, 280)

	const loadAvatar = async (cont, name, isEnemy) => {
		const border = new PIXI.Graphics()
			.roundRect(-13, -13, 26, 26, 4)
			.stroke({ width: 2, color: isEnemy ? 0xff4444 : 0x39d353 })
		cont.addChild(border)
		try {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.src = `https://eckeecke.pythonanywhere.com/image-proxy/${name}`
			await new Promise((resolve, reject) => {
				img.onload = resolve
				img.onerror = reject
			})
			const spr = new PIXI.Sprite(PIXI.Texture.from(img))
			spr.anchor.set(0.5)
			spr.width = 24
			spr.height = 24
			const mask = new PIXI.Graphics()
				.roundRect(-12, -12, 24, 24, 3)
				.fill(0xffffff)
			spr.mask = mask
			cont.addChild(mask, spr)
		} catch (avatarError) {
			const letter = createSharpText(
				name[0].toUpperCase(),
				14,
				true,
				isEnemy ? '#ff4444' : '#39d353'
			)
			letter.anchor.set(0.5)
			cont.addChild(letter)
		}
	}
	await Promise.all([
		loadAvatar(playerChar, p1, false),
		loadAvatar(enemyChar, p2, true)
	])

	if (mode === 'cpu') {
		const shootAI = () => {
			if (!gameOver) {
				createBullet(enemyChar.x, enemyChar.y + 15, 5, true)
				setTimeout(shootAI, Math.random() * 600 + 400)
			}
		}
		shootAI()
	}

	app.ticker.add(() => {
		if (gameOver) return
		if (keys.a) playerChar.x -= 4
		if (keys.d) playerChar.x += 4
		playerChar.x = Math.max(20, Math.min(DESIGN_W - 20, playerChar.x))
		const now = Date.now()
		if (mode === 'pvp') {
			if (keys.arrowleft) enemyChar.x -= 4
			if (keys.arrowright) enemyChar.x += 4
			enemyChar.x = Math.max(20, Math.min(DESIGN_W - 20, enemyChar.x))
			if (keys.arrowdown && now - lastEnemyShotTime > SHOT_COOLDOWN) {
				createBullet(enemyChar.x, enemyChar.y + 15, 5, true)
				lastEnemyShotTime = now
			}
		} else {
			if (cpuPattern === 0) {
				enemyChar.x += 2 * enemyDir
				if (enemyChar.x > DESIGN_W - 20 || enemyChar.x < 20) enemyDir *= -1
			} else if (cpuPattern === 1) {
				const diff = playerChar.x - enemyChar.x
				if (Math.abs(diff) > 5) {
					enemyChar.x += diff > 0 ? 2.5 : -2.5
				}
			} else if (cpuPattern === 2) {
				const activeShields = playerShields.children.filter((s) => s.visible)
				if (activeShields.length > 0) {
					const targetX = activeShields[0].x + playerShields.x + tileSize / 2
					const diff = targetX - enemyChar.x
					if (Math.abs(diff) > 5) {
						enemyChar.x += diff > 0 ? 2 : -2
					}
				} else {
					const diff = playerChar.x - enemyChar.x
					enemyChar.x += diff > 0 ? 2 : -2
				}
			}
			enemyChar.x = Math.max(20, Math.min(DESIGN_W - 20, enemyChar.x))
		}

		if (keys.w && now - lastShotTime > SHOT_COOLDOWN) {
			createBullet(playerChar.x, playerChar.y - 15, -5, false)
			lastShotTime = now
		}
	})
}

setupLauncher()
